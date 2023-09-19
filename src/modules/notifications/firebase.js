const admin = require("./firebase-config");
const { isEmpty } = require("lodash");
const { findById } = require("../user/userDao");
const notification_options = {
  priority: "high",
  timeToLive: 60 * 60 * 24,
};

/**
 * 
 * @param {*} userId 
 * @param {*} type 
 * @param {*} data 
 * @returns 
 */
const processNotification = async (userId, type, data) => {
  try {
    const fcmToken = await findById(userId);
    if (!isEmpty(fcmToken.fcmToken)) {
      const payload = {
        registrationToken: fcmToken.fcmToken,
        message: {
          title: "Rzbels Notification",
          body: "You have a new notification in rzbels app.",
        },
      };
      switch (type) {
        case "ORDER_CREATED":
          payload.message.title = `Rzbels ORDER PLACED`;
          payload.message.body = `YOUR order "${data.order_id}" has been placed successfully.`;
          break;
        case "ORDER_STATUS_CHANGED":
          payload.message.title = `Rzbels ORDER STATUS UPDATED`;
          payload.message.body = `YOUR order "${data.order_id}" has been updated to "${data.newStatus.replace('_',' ')}".`;
          break;
        case "ORDER_DELIVERY":
          payload.message.title = `Rzbels ORDER ITEM DELIVERY`;
          payload.message.body = `YOUR order "${data.order_id}" delivery has been "${data.deliveryStatus.replace('_',' ')}" today.`;
          break;
        default:
          break;
      }
      sendNotification(payload);
    }
    return;
  } catch (e) {
    console.error(e);
  }
};

/**
 * 
 * @param {*} data 
 */
const sendNotification = (data) => {
  try {
    const { registrationToken, message } = data;
    const options = notification_options;
    const payload = {
      notification: {
        title: message.title,
        body: message.body,
      },
    };
    admin.admin
      .messaging()
      .sendToDevice(registrationToken, payload, options)
      .then(async (response) => {
        return response;
      })
      .catch((error) => {
        logger.error(error);
        return error;
      });
  } catch (e) {
    console.error(e);
  }
};

module.exports = {
  processNotification,
  sendNotification,
};
