const http = require("https");

const sendSMS = async (phone, msg) => {
    const options = {
        "method": "POST",
        "hostname": "api.msg91.com",
        "port": null,
        "path": "/api/v5/flow/",
        "headers": {
            "authkey": "",
            "content-type": "application/JSON"
        }
    };

    const req = http.request(options, function (res) {
        const chunks = [];

        res.on("data", function (chunk) {
            chunks.push(chunk);
        });

        res.on("end", function () {
            const body = Buffer.concat(chunks);
            console.log(body.toString());
        });
    });

    req.write("{\n  \"flow_id\": \"EnterflowID\",\n  \"sender\": \"EnterSenderID\",\n  \"mobiles\": \"919XXXXXXXXX\",\n  \"VAR1\": \"VALUE 1\",\n  \"VAR2\": \"VALUE 2\"\n}");
    req.end();
}

const sendOTP = async (phone) => {
    const templateId = '';  // get templateId from configuration variables.
    const authkey = '';     // get authKey from configuration variables.

    const options = {
        "method": "GET",
        "hostname": "api.msg91.com",
        "port": null,
        "path": `/api/v5/otp?template_id=${templateId}&mobile=${phone}&authkey=${authkey}`,
        "headers": {
            "Content-Type": "application/json"
        }
    };

    const req = http.request(options, function (res) {
        const chunks = [];

        res.on("data", function (chunk) {
            chunks.push(chunk);
        });

        res.on("end", function () {
            const body = Buffer.concat(chunks);
            console.log(body.toString());
        });
    });

    req.write("{\"Value1\":\"Param1\",\"Value2\":\"Param2\",\"Value3\":\"Param3\"}");
    req.end();
}

const resendOTP = async (phone) => {
    const retrytype = '';  // get retrytype from configuration variables.
    const authkey = '';     // get authKey from configuration variables.

    const options = {
        "method": "GET",
        "hostname": "api.msg91.com",
        "port": null,
        "path": `/api/v5/otp/retry?authkey=${authkey}&retrytype=${retrytype}&mobile=${phone}`,
        "headers": {}
    };

    const req = http.request(options, function (res) {
        const chunks = [];

        res.on("data", function (chunk) {
            chunks.push(chunk);
        });

        res.on("end", function () {
            const body = Buffer.concat(chunks);
            console.log(body.toString());
        });
    });

    req.end();
}

const verifyOTP = async (phone, otp) => {
    const authkey = '';     // get authKey from configuration variables.

    const options = {
        "method": "GET",
        "hostname": "api.msg91.com",
        "port": null,
        "path": `/api/v5/otp/verify?otp=${otp}&authkey=${authkey}&mobile=${phone}`,
        "headers": {}
    };

    const req = http.request(options, function (res) {
        const chunks = [];

        res.on("data", function (chunk) {
            chunks.push(chunk);
        });

        res.on("end", function () {
            const body = Buffer.concat(chunks);
            console.log(body.toString());
        });
    });

    req.end();
}

module.exports = {
    sendSMS,
    sendOTP,
    resendOTP,
    verifyOTP
}