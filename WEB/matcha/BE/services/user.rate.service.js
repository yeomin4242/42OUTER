const userRateRepository = require("../repositories/user.rate.repository");
const userRepository = require("../repositories/user.repository");
const logger = require("../configs/logger");

const rateUser = async (ratedUsername, rateScore, userId) => {
  try {
    logger.info(
      "user.rate.service.js rateUser: " +
        ratedUsername +
        ", " +
        rateScore +
        ", " +
        userId
    );
    const ratedUserInfo = await userRepository.findUserByUsername(
      ratedUsername
    );
    if (!ratedUserInfo) {
      const error = new Error("Rate user not found.");
      error.status = 404;
      throw error;
    }
    await userRateRepository.rateUser(ratedUserInfo.id, rateScore, userId);

    const meanRate = await userRateRepository.findRateAvgByUserId(
      ratedUserInfo.id
    );

    return meanRate;
  } catch (error) {
    logger.error("user.rate.service.js rateUser: " + error.message);
    throw error;
  }
};

const findRateAvgByUserId = async (userId) => {
  try {
    logger.info("user.rate.service.js findRateAvgByUserId: " + userId);
    const meanRate = await userRateRepository.findRateAvgByUserId(userId);
    return meanRate;
  } catch (error) {
    logger.error("user.rate.service.js findRateAvgByUserId: " + error.message);
    throw error;
  }
};

module.exports = {
  rateUser,
  findRateAvgByUserId,
};
