const PayTmChecksum = require("./config/checksum");
const PayTmConfig = require("./config/config");
const axios = require("axios");

/**
 * Create transaction token for PayTm.
 * @param {*} orderId
 * @param {*} orderData
 */
const createPayTmTxnToken = async (orderId, orderData) => {
  try {
    const payTmParams = {};
    payTmParams.body = {
      requestType: "Payment",
      mid: PayTmConfig.PayTmConfig.mid,
      websiteName: PayTmConfig.PayTmConfig.website,
      orderId,
      callbackUrl: PayTmConfig.PayTmConfig.callback_url + orderId,
      txnAmount: {
        value: orderData.amount,
        currency: orderData.currency || "INR",
      },
      userInfo: {
        custId: orderData.customerId,
      },
    };

    let response = "";

    await PayTmChecksum.generateSignature(
      JSON.stringify(payTmParams.body),
      PayTmConfig.PayTmConfig.key
    ).then(async (checksum) => {
      payTmParams.head = {
        signature: checksum,
      };

      const post_data = JSON.stringify(payTmParams);
      const url = `https://securegw-stage.paytm.in/theia/api/v1/initiateTransaction?mid=${PayTmConfig.PayTmConfig.mid}&orderId=${orderId}`;
      const result = await axios.post(url, post_data, {
        headers: {
          "Content-Type": "application/json",
          "Content-Length": post_data.length,
        },
      });
      response = result.data;
    });
    if (response?.body?.resultInfo?.resultStatus === 'S') {
      return {
        txnToken: response.body.txnToken,
        callbackUrl: PayTmConfig.PayTmConfig.callback_url + orderId,
        payment_amount: orderData.amount,
        payment_currency: orderData.currency || "INR"
      };
    } else {
      return false;
    }
  } catch (e) {
    console.error(e);
    throw new Error(e.message);
  }
};

/**
 *
 * @param {*} orderId
 */
const checkPaymentStatus = async (orderId) => {
  try {
    const payTmParams = {};
    payTmParams.body = {
      mid: PayTmConfig.PayTmConfig.mid,
      orderId,
    };

    let response = "";
    await PayTmChecksum.generateSignature(
      JSON.stringify(payTmParams.body),
      PayTmConfig.PayTmConfig.key
    ).then(async (checksum) => {
      payTmParams.head = {
        signature: checksum,
      };

      const post_data = JSON.stringify(payTmParams);
      const url = `https://securegw-stage.paytm.in//v3/order/status`;
      const result = await axios.post(url, post_data, {
        headers: {
          "Content-Type": "application/json",
          "Content-Length": post_data.length,
        },
      });
      response = result.data;
    });
    return response;
  } catch (e) {
    console.error(e);
    throw new Error(e.message);
  }
};

module.exports = {
  createPayTmTxnToken,
  checkPaymentStatus,
};
