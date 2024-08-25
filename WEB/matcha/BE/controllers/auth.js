const express = require("express");
const router = express.Router();
const {
  verifyTwoFactor,
  verifyAllprocess,
  verifyRegistEmailSession,
} = require("../configs/middleware.js");
const authService = require("../services/auth.service.js");
const userService = require("../services/user.service.js");
const bcypt = require("bcrypt");
const moment = require("moment-timezone");
const jwt = require("jsonwebtoken");
const Expire = require("expirable");

const {
  validateEmail,
  validatePassword,
  validateUsername,
} = require("../configs/validate.js");

const logger = require("../configs/logger.js");

const registerPasswordList = new Expire({
  expire: "5 minutes", // Default expire time for items
  interval: "2 minutes", // Interval to check and remove expired items
});

require("dotenv").config();

/*
  POST /auth/login

  username : String 사용자 이름
  password : String 사용자 비밀번호
*/
router.post("/login", async function (req, res, next) {
  try {
    logger.info("auth.js POST /auth/login: " + JSON.stringify(req.body));
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).send("username or password not found.");
    } else if (!validateUsername(username)) {
      return res.status(400).send("username is invalid.");
    } else if (!validatePassword(password)) {
      return res.status(400).send("password is invalid.");
    }

    const user = await authService.loginByUsernameAndPassword(
      username,
      password
    );

    if (!user) {
      return res.status(400).send("User not found.");
    }

    const authInfo = await authService.findAuthInfoById(user.id);

    if (authInfo.is_oauth === true) {
      return res
        .status(400)
        .send("OAuth user cannot login with username and password");
    }

    let jwtToken = {
      id: user.id,
      email: user.email,
      isOauth: false,
      accessToken: null,
      twofaVerified: false,
    };

    if (authInfo.is_twofa === false) {
      jwtToken.twofaVerified = true;
    }

    const cookie = authService.generateJWT(jwtToken);

    res.cookie("jwt", cookie, {});

    res.set("Authorization", `Bearer ${cookie}`);

    await userService.updateConnectedAtById(user.id);

    return res.send(authInfo.is_twofa);
  } catch (error) {
    next(error);
  }
});

/*
  POST /auth/register

  email : String 사용자 이메일
  password : String 사용자 비밀번호
  confirmedPassword : String 비밀번호 확인
*/

router.post("/register", async function (req, res, next) {
  try {
    logger.info("auth.js POST /auth/register: " + JSON.stringify(req.body));

    const { email, password, confirmedPassword } = req.body;

    if (!email || !password || !confirmedPassword) {
      return res.status(400).send("Email or password not found.");
    } else if (password !== confirmedPassword) {
      return res.status(400).send("Password not matched.");
    } else if (!validateEmail(email)) {
      return res.status(400).send("Please enter a valid email.");
    } else if (!validatePassword(password)) {
      return res
        .status(400)
        .send("Please enter a valid password. (8~15 characters)");
    }

    const result = await userService.findOneUserByEmail(email);

    if (result) {
      return res.status(409).send("User already exists.");
    }

    const hashedPassword = await bcypt.hash(password, 10);

    req.session.userInfo = {
      email,
      password: hashedPassword,
      isOauth: false,
      accessToken: null,
      isValid: false,
    };

    req.session.save();

    return res.send();
  } catch (error) {
    next(error);
  }
});

/* DELETE/auth/logout
 */
//TODO: POST로 바꾸는거 고려
router.delete("/logout", function (req, res, next) {
  try {
    logger.info("auth.js DELETE /auth/logout");
    res.clearCookie("jwt");
    res.send("Logout success.");
  } catch (error) {
    next(error);
  }
});

/* POST /auth/callback
code : String OAuth 인증 코드
*/

//TODO: 기가입된 일반유저의 EMAIL로 OAUTH 하는 경우 막기
router.get("/callback", async function (req, res, next) {
  try {
    logger.info("auth.js POST /auth/callback: " + JSON.stringify(req.query));
    const code = req.query.code;
    if (!code) {
      res.setHeader("errorMessage", "Code not found.");
      return res.redirect(process.env.FE_ERROR_URL);
    }

    const result = await authService.getOauthInfo(code);

    if (!result) {
      res.setHeader("errorMessage", "Failed to get oauth info.");
      return res.redirect(process.env.FE_ERROR_URL);
    }

    const { user, oauthInfo } = result;

    if (!oauthInfo) {
      res.setHeader("errorMessage", "Failed to get oauth info.");
      return res.redirect(process.env.FE_ERROR_URL);
    }

    let jwtToken = null;
    if (!user) {
      //user REGISTRATION_URL
      req.session.userInfo = {
        email: oauthInfo.email,
        password: null,
        isOauth: true,
        accessToken: oauthInfo.accessToken,
        isValid: true,
      };

      return res.redirect(process.env.OAUTH_USER_REGISTRATION_URL);
    } else {
      const authInfo = await authService.findAuthInfoById(user.id);

      if (authInfo.is_twofa === true) {
        jwtToken = authService.generateJWT({
          id: user.id,
          email: user.email,
          isOauth: true,
          accessToken: oauthInfo.accessToken,
          twofaVerified: false,
        });

        res.cookie("jwt", jwtToken, {
          //httpOnly: true,
          //secure: false,
        });

        res.set("Authorization", `Bearer ${jwtToken}`);

        await userService.updateConnectedAtById(user.id);

        return res.redirect(process.env.FE_TWOFACTOR_URL);
      } else {
        jwtToken = authService.generateJWT({
          id: user.id,
          email: user.email,
          isOauth: true,
          accessToken: oauthInfo.accessToken,
          twofaVerified: true,
        });

        res.cookie("jwt", jwtToken, {
          //httpOnly: true,
          //secure: false,
        });

        res.set("Authorization", `Bearer ${jwtToken}`);

        await userService.updateConnectedAtById(user.id);

        return res.redirect(process.env.FE_MAIN_URL);
      }
    }
  } catch (error) {
    res.setHeader("errorMessage", error.message);
    return res.redirect(process.env.FE_ERROR_URL);
  }
});

/* POST /auth/twofactor/create
 */
router.post(
  "/twofactor/create",
  verifyTwoFactor,
  async function (req, res, next) {
    try {
      logger.info("auth.js POST /auth/twofactor/create");

      //임시 id로 테스트
      const authInfo = await authService.findAuthInfoById(req.jwtInfo.id);

      if (!authInfo) {
        return res.status(400).send("AuthInfo not found.");
      } else if (authInfo.is_twofa === false) {
        return res.status(400).send("2FA is not enabled.");
      }

      const email = req.jwtInfo.email;

      if (!email) {
        res.status(400).send("Email not found.");
      }
      const code = await authService.createTwofactorCode(email);

      const userTimezone = "Asia/Seoul"; // 사용자의 시간대
      const expirationDate = moment()
        .tz(userTimezone)
        .add(2, "minutes")
        .toDate(); // 5분 후 만료

      if (req.session.twofactorComponents) {
        req.session.twofactorComponents = null;
      }

      req.session.twofactorComponents = {
        code: code,
        expirationDate: expirationDate,
      };

      req.session.save();

      res.send();
    } catch (error) {
      logger.error("auth.js POST /auth/twofactor/create: " + error.message);
      next(error);
    }
  }
);

/* POST /auth/twoFactor/verify
code : String 2FA 인증 코드
*/
router.post("/twofactor/verify", verifyTwoFactor, function (req, res, next) {
  try {
    logger.info(
      "auth.js POST /auth/twofactor/verify: " + JSON.stringify(req.body)
    );
    //임시 email로 테스트
    const email = req.jwtInfo.email;

    const code = req.body.code;

    if (!code) {
      return res.status(400).send("Code not found.");
    } else if (!email) {
      return res.status(400).send("Email not found.");
    } else if (!req.session.twofactorComponents) {
      return res.status(400).send("Session not found.");
    } else if (req.session.twofactorComponents.expirationDate < new Date()) {
      return res.status(400).send("Code expired.");
    }

    //const result = authService.verifyTwoFactorCode(code);

    if (req.session.twofactorComponents.code !== code) {
      return res.status(400).send("Invalid code.");
    } else {
      const jwtToken = authService.generateJWT({
        id: req.jwtInfo.id,
        email: req.jwtInfo.email,
        isOauth: req.jwtInfo.isOauth,
        accessToken: req.jwtInfo.accessToken,
        twofaVerified: true,
      });

      res.cookie("jwt", jwtToken, {
        //httpOnly: true,
        //secure: false,
      });

      res.set("Authorization", `Bearer ${jwtToken}`);

      req.session.destroy();

      return res.send();
    }
  } catch (error) {
    next(error);
  }
});

//https://typo.tistory.com/entry/Nodejs-JQuery-%ED%9A%8C%EC%9B%90%EA%B0%80%EC%9E%85-%EB%A7%8C%EB%93%A4%EA%B8%B0-%EC%9D%B8%EC%A6%9D%EB%B2%88%ED%98%B8-%EC%9D%B4%EB%A9%94%EC%9D%BC-%EC%A0%84%EC%86%A12

/* POST /auth/register/email/send
 */

router.post(
  "/register/email/send",
  verifyRegistEmailSession,
  async function (req, res, next) {
    try {
      logger.info("auth.js POST /auth/register/email/send");

      if (!req.session.userInfo) {
        return res.status(400).send("User info not found.");
      } else if (!req.session.userInfo.email) {
        return res.status(400).send("Email not found.");
      }

      const { email } = req.session.userInfo;

      const code = await authService.createRegistURL(
        email,
        req.session.userInfo
      );

      registerPasswordList.set(code, req.session.userInfo.password);

      return res.send();
    } catch (error) {
      next(error);
    }
  }
);

/* GET /auth/register/email/verify
code : String 인증 코드
*/

router.get("/register/email/verify", async function (req, res, next) {
  try {
    logger.info(
      "auth.js GET /auth/register/email/verify: " +
        JSON.stringify(req.query.code)
    );

    const code = req.query.code;

    if (!code) {
      return res.status(400).send("Code not found.");
    }

    const decoded = jwt.verify(code, process.env.JWT_SECRET);

    const password = registerPasswordList.get(code);

    if (!decoded) {
      return res.status(400).send("Invalid code.");
    } else if (decoded.expirationDate < new Date()) {
      return res.status(400).send("Code expired.");
    } else if (decoded.isValid === true) {
      return res.status(400).send("Code already verified.");
    } else if (!password) {
      return res.status(400).send("Code Expired.");
    }

    req.session.userInfo = {
      email: decoded.email,
      password: password,
      isOauth: decoded.isOauth,
      accessToken: decoded.accessToken,
      isValid: true,
    };

    req.session.save();

    return res.redirect(process.env.REGISTRATION_URL);
  } catch (error) {
    next(error);
  }
});

//https://well-made-codestory.tistory.com/37

/* POST /auth/reset/email/create
email : String 사용자 이메일
*/

router.post("/reset/email/create", async function (req, res, next) {
  try {
    logger.info(
      "auth.js POST /auth/reset/email/create: " + JSON.stringify(req.body)
    );
    const email = req.body.email;
    if (!email) {
      res.status(400).send("Email not found.");
    }
    await authService.createResetPasswordURL(email);

    return res.send();
  } catch (error) {
    next(error);
  }
});

/* GET /auth/reset/email/verify
code : String 인증 코드
*/
router.get("/reset/email/verify", async function (req, res, next) {
  try {
    logger.info(
      "auth.js GET /auth/reset/email/verify: " + JSON.stringify(req.query.code)
    );

    const code = req.query.code;

    if (!code) {
      return res.status(400).send("Code not found.");
    }

    const decoded = jwt.verify(code, process.env.JWT_SECRET);

    if (!decoded) {
      return res.status(400).send("Invalid code.");
    } else if (decoded.expirationDate < new Date()) {
      return res.status(400).send("Code expired.");
    }

    req.session.resetPasswordEmail = decoded;

    req.session.save();

    return res.redirect(process.env.FE_RESET_PASSWORD_URL);
  } catch (error) {
    next(error);
  }
});

/* GET /auth/check/access
 */

router.get("/check/access", verifyAllprocess, async function (req, res, next) {
  try {
    logger.info("auth.js GET /auth/check/access");
    return res.send("Access verified.");
  } catch (error) {
    next(error);
  }
});

module.exports = router;

//분기 3개
//객체 유무 분기
//객체 내부에 Boolean값 분기
