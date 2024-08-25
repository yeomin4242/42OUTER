const socket = require("socket.io");
const jwt = require("jsonwebtoken");
const Filter = require("badwords-ko");

const userService = require("../services/user.service");
const userChatService = require("../services/user.chat.service");
const userLikeService = require("../services/user.like.service");
const userViewService = require("../services/user.view.service");
const userAlarmService = require("../services/user.alarm.service");
const userBlockService = require("../services/user.block.service");

const logger = require("../configs/logger");
const { validateUsername, validateMessage } = require("../configs/validate");

/* 필요한 기능
- 유저는 다음 알림들을 실시간으로 보내야 한다
    - 유저가 좋아요를 받았을때
    - 유저의 프로필을 방문했을때
    - 유저가 메세지를 받았을때
    - 좋아요를 눌렀던 유저에게 좋아요를 받았을때 (연결됨)
    - 연결된 유저가 좋아요를 취소했을때
- 유저는 어떤 페이지에서도 알림이 왔던 것을 알수 있어야 함
- 유저간 연결 (채팅), 알림은 10초 이내에 이루어져야 한다
*/

//TODO: 소켓 에러 상황 처리
module.exports = (server, app) => {
  const io = socket(server, {
    cors: {
      origin: [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://localhost:3001",
        "http://localhost:5173/email",
        "http://localhost:5173/twofactor",
        "http://127.0.0.1:3000",
      ],
      credentials: true,
    },
  });

  const filter = new Filter();

  const userActivate = new Map();
  //var userId;
  app.set("userActivate", userActivate);

  // 소캣 연결
  io.on("connection", async (socket) => {
    try {
      logger.info(
        "user.socket.js connection: " +
          socket.handshake.auth.authorization +
          " " +
          socket.id
      );
      //JWT 토큰 검증
      if (!socket.handshake.auth.authorization) {
        await socket.disconnect();
        return;
      }
      const token = socket.handshake.auth.authorization;

      if (!token) {
        logger.error("user.socket.js connection error: token is null");
        await socket.disconnect();
        return;
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      if (decoded.isValid === false) {
        await socket.disconnect();
        return;
      } else if (decoded.twofaVerified === false) {
        await socket.disconnect();
        return;
      }

      socket.jwtInfo = decoded;
      userId = socket.jwtInfo.id;

      if (!userId) {
        await socket.disconnect();
        return;
      }

      // 유저 접속 상태

      userActivate.set(userId, socket.id);
      await socket.join(socket.id);

      // 유저가 채팅목록 불러올때
      socket.on("getChatList", async () => {
        try {
          logger.info("user.socket.js getChatList");
          const userId = await [...userActivate.entries()].find(
            ([key, value]) => value === socket.id
          )?.[0];
          const chatList = await userChatService.findAllChatRooms(userId);
          await io.to(socket.id).emit("getChatList", chatList);
        } catch (error) {
          logger.error("user.socket.js getChatList error: " + error.message);
          io.to(socket.id).emit("error", error.message);
        }
      });

      // 유저가 채팅방에 들어갔을때
      socket.on("joinChatRoom", async (data) => {
        try {
          logger.info("user.socket.js joinChatRoom: " + JSON.stringify(data)); 

          socket.rooms.forEach((room) => {
            if (room !== socket.id) {
              logger.info(`Leaving room: ${room}`);
              socket.leave(room);
            }
          });

          const userId = await [...userActivate.entries()].find(
            ([key, value]) => value === socket.id
          )?.[0];
          const socketId = await userActivate.get(userId);

          const username = data;

          if (!username || !validateUsername(username)) {
            throw new Error("username is null");
          }

          const userInfo = await userService.findOneUserByUsername(username);
          if (!userInfo) {
            throw new Error("userInfo is null");
          }

          const chatRoomInfo = await userChatService.findOneChatRoomById(
            userId,
            userInfo.id
          );

          if (!chatRoomInfo) {
            throw new Error("chatRoomInfo is null");
          }

          // var rooms = await io.sockets.adapter.sids[socket.id];
          // for (var room in rooms) {
          //   logger.info("room: " + room);
          //   if (room !== socket.id) await socket.leave(room);
          // }

          const chatHistories =
            await userChatService.findAllChatHistoriesByRoomId(chatRoomInfo.id);

          if (chatHistories) {
            const chatHistory = await Promise.all(
              chatHistories.map(async (chat) => {
                const userInfo = await userService.findOneUserById(
                  chat.sender_id
                );

                if (!userInfo) {
                  return null;
                }
                return {
                  message: chat.content,
                  sender: userInfo.username,
                  createdAt: chat.created_at,
                };
              })
            );

            const filteredChatHistory = chatHistory.filter(
              (history) => history !== null
            );

            await io.to(socketId).emit("getMessages", filteredChatHistory);
          } else {
            await io.to(socketId).emit("getMessages", []);
          }

          await socket.join(chatRoomInfo.id);
          //chatRoomInfo.id == 1
          // 1 701, 702의 대화
        } catch (error) {
          logger.error("user.socket.js joinChatRoom error: " + error.message);
          io.to(socket.id).emit("error", error.message);
        }
      });
    } catch (error) {
      logger.error("user.socket.js connection error: " + error.message);
      io.to(socket.id).emit("error", error.message);
    }

    // 채팅 받아서 저장하고, 그 채팅 보내서 보여주기

    //채팅 받는 사람 === username
    socket.on("sendMessage", async (data) => {
      try {
        logger.info("user.socket.js sendMessage: " + JSON.stringify(data));
        const userId = await [...userActivate.entries()].find(
          ([key, value]) => value === socket.id
        )?.[0];
        const { username } = data;

        let { message } = data;

        if (!message || !username) {
          throw new Error("message or username is null");
        } else if (!validateMessage(message)) {
          throw new Error("message is invalid");
        }

        message = filter.clean(message);

        const recieverInfo = await userService.findOneUserByUsername(username);

        if (!recieverInfo) {
          throw new Error("recieverInfo is null");
        }

        const chatRoomInfo = await userChatService.findOneChatRoomById(
          userId,
          recieverInfo.id
        );

        const senderInfo = await userService.findOneUserById(userId);

        if (!chatRoomInfo) {
          throw new Error("chatRoomInfo is null");
        }
        const param = {
          message,
          sender: senderInfo.username,
          createdAt: new Date(),
        };

        await userChatService.saveSendedChatById(
          chatRoomInfo.id,
          userId,
          message
        );

        await io.to(chatRoomInfo.id).emit("sendMessage", param);
        //await io
        //.to(await userActivate.get(recieverInfo.id))
        //.emit("getMessages", param);
        //await socket.to(chatRoomInfo.id).emit("getMessages", param);

        const chatRoomExistUsers = await io.sockets.adapter.rooms.get(
          chatRoomInfo.id
        );

        logger.info("chatRoomExistUsers: " + JSON.stringify([...chatRoomExistUsers]));

        const recieverSocketId = await userActivate.get(recieverInfo.id);

        if (chatRoomExistUsers.has(recieverSocketId) === false) {
          logger.info("I WILL SEND!");
          await io.to(recieverSocketId).emit("alarm", {
            AlarmType: "MESSAGED",
          });
        }
    
        await userAlarmService.saveAlarmById(
          userId,
          recieverInfo.id,
          "MESSAGED"
        );
      } catch (error) {
        logger.error("user.socket.js sendMessage error: " + error.message);
        io.to(socket.id).emit("error", error.message);
      }
    });

    socket.on("leaveRoom", async (data) => {
      try {
        logger.info("user.socket.js leaveRoom");
        socket.rooms.forEach((room) => {
          if (room !== socket.id) {
            logger.info(`Leaving room: ${room}`);
            socket.leave(room);
          }
        });
      } catch (error) {
        logger.error("user.socket.js leaveRoom error: " + error.message);
        io.to(socket.id).emit("error", error.message);
      }
    });

    socket.on("likeUser", async (data) => {
      try {
        logger.info("user.socket.js likeUser: " + JSON.stringify(data));
        const userId = await [...userActivate.entries()].find(
          ([key, value]) => value === socket.id
        )?.[0];
        const username = data;

        if (!username) {
          throw new Error("username is null");
        } else if (!userId) {
          throw new Error("userId is null");
        }
        const userInfo = await userService.findOneUserByUsername(username);

        if (!userInfo) {
          throw new Error("userInfo is null");
        }

        const result = await userLikeService.likeUserByUsername(
          username,
          userId
        );

        if (typeof result === "undefined") {
          throw new Error("Bad Request");
        }

        await io.to(userActivate.get(userInfo.id)).emit("alarm", {
          alarmType: "LIKED",
        }); //유저가 좋아요를 받았을때
        if (result === true) {
          await io.to(userActivate.get(userInfo.id)).emit("alarm", {
            alarmType: "MATCHED",
          });
          await io.to(userActivate.get(userId)).emit("alarm", {
            alarmType: "MATCHED",
          });
        }
      } catch (error) {
        logger.error("user.socket.js likeUser error: " + error.message);
        io.to(socket.id).emit("error", error.message);
      }
    });

    socket.on("dislikeUser", async (data) => {
      try {
        logger.info("user.socket.js dislikeUser: " + JSON.stringify(data));
        const userId = await [...userActivate.entries()].find(
          ([key, value]) => value === socket.id
        )?.[0];
        const username = data;

        if (!username) {
          throw new Error("username is null");
        } else if (!userId) {
          throw new Error("userId is null");
        }

        const userInfo = await userService.findOneUserByUsername(username);
        if (!userInfo) {
          throw new Error("userInfo is null");
        }

        const chatRoomInfo = await userChatService.findOneChatRoomById(
          userId,
          userInfo.id
        );

        const result = await userLikeService.dislikeUserByUsername(
          username,
          userId
        );

        if (typeof result === "undefined") {
          throw new Error("Bad Request");
        }

        //연결된 유저가 좋아요를 취소했을때
        await io.to(userActivate.get(userInfo.id)).emit("alarm", {
          alarmType: "DISLIKED",
        });

        if (result === true) {
          await io.to(userActivate.get(userId)).emit("alarm", {
            alarmType: "UNMATCHED",
          });

        const existRoomUser = await io.sockets.adapter.rooms.get(chatRoomInfo.id)
        logger.info("ExistRoomUser :" + [...existRoomUser]); 

          if (
            existRoomUser.has(await userActivate.get(userInfo.id)) === true
          ) {
            await io.to(userActivate.get(userInfo.id)).emit("kick", {
              alarmType: "UNMATCHED",
            });
          }
        }
      } catch (error) {
        logger.error("user.socket.js dislikeUser error: " + error.message);
        io.to(socket.id).emit("error", error.message);
      }
    });

    socket.on("visitUserProfile", async (data) => {
      try {
        logger.info("user.socket.js visitUserProfile: " + JSON.stringify(data));
        const userId = await [...userActivate.entries()].find(
          ([key, value]) => value === socket.id
        )?.[0];
        const username = data;

        if (!username) {
          throw new Error("username is null");
        } else if (!userId) {
          throw new Error("userId is null");
        }

        const userInfo = await userService.findOneUserByUsername(username);

        if (!userInfo) {
          throw new Error("userInfo is null");
        }

        await io.to(userActivate.get(userInfo.id)).emit("alarm", {}); //유저의 프로필을 방문했을때

        await userViewService.saveVisitHistoryById(username, userId);
      } catch (error) {
        logger.error("user.socket.js visitUserProfile error: " + error.message);
        io.to(socket.id).emit("error", error.message);
      }
    });

    socket.on("getAlarms", async () => {
      try {
        logger.info("user.socket.js getAlarms");
        const userId = await [...userActivate.entries()].find(
          ([key, value]) => value === socket.id
        )?.[0];

        const alarms = await userAlarmService.findAllAlarmsById(userId);
        await userAlarmService.deleteAllAlarmsById(userId);

        await io.to(userActivate.get(userId)).emit("getAlarms", alarms);
      } catch (error) {
        logger.error("user.socket.js getAlarms error: " + error.message);
        io.to(socket.id).emit("error", error.message);
      }
    });

    //socket.on("sendAlarm", async (date) => {
    //  try {
    //    console.log(`sendAlarm : ${date.message}`)
    //    io.to(userActivate[0]).emit("alarm", {
    //      AlarmType: "LIKED",
    //      username: "test",
    //    });
    //  } catch (error) {
    //    console.log(error);
    //    return false;
    //  }
    //});

    socket.on("disconnect", async () => {
      try {
        logger.info(
          "user.socket.js disconnect: " + socket.handshake.auth.authorization
        );

        // //이 코드는 현재 클라이언트 소켓이 참여하고 있는 모든 방(room)에서 해당 소켓을 제외시키는 역할을 합니다.
        // var rooms = io.sockets.adapter.sids[socket.id];
        // for (var room in rooms) {
        //   await socket.leave(room);
        // }

        // 유저 접속 상태
        const userKey = [...userActivate.entries()].find(
          ([key, value]) => value === socket.id
          )?.[0];
        if (userKey) {
          userActivate.delete(userKey);
        } else {
          throw new Error(`Could not find user key for socket ${socket.id}`);
        }
      } catch (error) {
        logger.error("user.socket.js disconnect error: " + error.message);
      }
    });
  });
};
