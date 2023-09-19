const userDao = require("../user/userDao");
const { createToken } = require("../../middlewares/token_manager");
const sendSms = require("../../utils/twilio");
const responseHelper = require('../../helper/response_utility');

/**
 * Authenticate User
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @method authentication
 * @returns
 */
const authentication = async (req, res) => {
  try {
    const { google_id, facebook_id, fcm_token, language_id } = req.body;
    let { phone_number } = req.body;
    if ((phone_number, language_id)) {
      // update Phone number with +91
      //phone_number = '+91' + phone_number;
      phone_number = phone_number;
      const isUserExists = await userDao.findByPhoneNumber(phone_number);
      if (!isUserExists) {
        // generate Unique OTP
        const otp = generateOTP();
        // Send OTP on SMS
        // sendOTPSMS(phone_number, otp);

        //Storing FCM token in array
        const fcmTokenArr = fcm_token ? [fcm_token] : [];
        const userObject = {
          language_id,
          phone_number,
          phone_verification_token: otp,
          fcmToken: fcmTokenArr,
        };
        const user = await userDao.create(userObject);
        const userdata = {
          id: user.id,
          phone_number: user.phone_number,
          is_phone_verified: user.is_phone_verified,
          last_login: user.last_login,
          phone_verification_token: user.phone_verification_token,
        };
        return responseHelper.successResponse(req, res, userdata, "OTP has send to your mobile number");
      } else {
        // Existed user with mobile number not verified.
        if (!isUserExists.active) {
            return responseHelper.notFoundResponse(req, res, "Not a valid user.");
        }
        // Store FCM Token
        if (fcm_token) {
          storeFcmToken(isUserExists, fcm_token);
        }
        // generate Unique OTP
        const otp = generateOTP();

        // Send OTP on SMS
        // sendOTPSMS(phone_number, otp);

        const userObject = {
          phone_verification_token: otp,
          last_login: new Date(),
          is_phone_verified: false,
        };
        const [row, _user] = await userDao.update(isUserExists.id, userObject);
        const _userData = {
          id: _user[0].id,
          is_phone_verified: _user[0].is_phone_verified,
          phone_number: _user[0].phone_number,
          phone_verification_token: _user[0].phone_verification_token,
        };
        return responseHelper.successResponse(req, res, _userData, "OTP has send to your mobile number");
      }
    } else {
        return responseHelper.notFoundResponse(req, res, "Invalid input");
    }
  } catch (error) {
    console.error(error);
    return responseHelper.internalServerError(req, res, error)
  }
};

/**
 * Store FCM Token.
 * @param {*} user
 * @param {*} fcmToken
 * @returns
 */
const storeFcmToken = async (user, fcmToken) => {
  try {
    let checkToken = false;
    if (user.fcmToken !== null) {
      checkToken = user.fcmToken.includes(fcmToken);
    }

    if (!checkToken) {
      let arr = [];
      if (user.fcmToken !== null) {
        arr = user.fcmToken;
        arr.push(fcmToken);
      } else {
        arr.push(fcmToken);
      }
      // storing FCM token
      user = await userDao.update(user.id, { fcmToken: arr });
    }
    return user;
  } catch (error) {
    console.error(error);
  }
};

/**
 *
 * @returns
 */
const generateOTP = () => {
  // This will generate 4 digit number
  return Math.floor(1000 + Math.random() * 9000);
};

/**
 *
 * @param {*} phone_number
 * @param {*} otp
 */
const sendOTPSMS = async (phone_number, otp) => {
  const messageBody = `One Time Password for GSM authentication is ${otp}`;
  // Sending OTP to this mobile number
  sendSms(phone_number, messageBody);
};

/**
 *
 * @param {*} req
 * @param {*} res
 * @returns
 */
const verifyOTP = async (req, res) => {
  try {
    // points: validation - verify phone number and OTP
    // Check this mobile number registered or not
    let { phone_number, otp } = req.body;
    //phone_number = '+91' + phone_number;
    phone_number = phone_number;
    const isUserExists = await userDao.findByPhoneNumber(phone_number);
    if (isUserExists && isUserExists.phone_verification_token == otp) {
      const [row, _user] = await userDao.update(isUserExists.id, {
        is_phone_verified: true,
        last_login: new Date(),
      });
      const userData = {
        id: _user[0].id,
        is_phone_verified: _user[0].is_phone_verified,
        phone_number: _user[0].phone_number,
        user_language: isUserExists.user_language,
      };
      const token = await createToken(userData);
      // Notes : Add a record in user homes and user home access
      return responseHelper.successResponse(req, res, { user: userData, token }, "User has been matched..");
    } else {
        return responseHelper.notFoundResponse(req, res, "OTP not matched");
    }
  } catch (error) {
    console.error(error);
    return responseHelper.internalServerError(req, res, error);
  }
};

/**
 *
 * @param {*} req
 * @param {*} res
 * @returns
 */
const resendOTP = async (req, res) => {
  try {
    // point: Verify the phone number here
    const { phone_number } = req.body;
    const isUser = await userDao.findByPhoneNumber(phone_number);
    if (isUser) {
      // generate Unique OTP
      const otp = generateOTP();

      // Send Otp SMS
    //   sendOTPSMS(phone_number, otp);

      const userObject = {
        phone_verification_token: otp,
      };
      const user = await userDao.update(isUser.id, userObject);
      return responseHelper.successResponse(req, res, {}, "OTP has been sent on register mobile number");
    } else {
        return responseHelper.notFoundResponse(req, res, "OTP not matched");
    }
  } catch (error) {
    console.error(error);
    return responseHelper.internalServerError(req, res, error);
  }
};

/**
 *
 * @param {*} request
 * @param {*} response
 * @returns
 */
async function checkLatestAppVersion(request, response) {
  try {
    const { system, version } = request.params;
    if (system && version) {
      const APP_SYSTEMS = COMMON_CONSTANTS.APP_SYSTEMS;
      const validResultValues = [0, 1, -1];
      if (APP_SYSTEMS.includes(system)) {
        const systemVersion =
          system === COMMON_CONSTANTS.APP_SYSTEMS[0]
            ? COMMON_CONSTANTS.IOS_APP_VERSION
            : COMMON_CONSTANTS.ANDROID_APP_VERSION;
        const requiredSystemVersion = COMMON_CONSTANTS.APP_SYSTEMS[0]
          ? COMMON_CONSTANTS.IOS_REQUIRED_APP_VERSION
          : COMMON_CONSTANTS.ANDROID_REQUIRED_APP_VERSION;
        const versionOutput = systemVersion.localeCompare(version, undefined, {
          numeric: true,
          sensitivity: "base",
        });
        const reqVersionOutput = requiredSystemVersion.localeCompare(
          version,
          undefined,
          { numeric: true, sensitivity: "base" }
        );
        // versionOutput =  1  = system version is upgraded - need to update application version
        // versionOutput =  0  = system version and application version are same
        // versionOutput =  -1  = system version is downgraded - Application version already updated
        if (validResultValues.includes(versionOutput)) {
          const result = {
            current_version: version,
            system_version: systemVersion,
            is_update_require: versionOutput === 1 ? true : false,
            is_force_update_require: reqVersionOutput === 1 ? true : false,
          };
        return responseHelper.successResponse(req, res, {data: result}, commonMessage.APP_VER_SUCC);
        } else {
        return responseHelper.successResponse(req, res, {}, commonMessage.APP_VER_FAILED);
        }
      } else {
        return responseHelper.badReqResponse(req, res, commonMessage.INCORT_SYS);
      }
    } else {
        return responseHelper.badReqResponse(req, res, commonMessage.PARA_MISSING);
    }
  } catch (error) {
    console.error(error);
    return responseHelper.internalServerError(req, res, error);
  }
}

module.exports = {
  authentication,
  verifyOTP,
  resendOTP,
  checkLatestAppVersion,
};
