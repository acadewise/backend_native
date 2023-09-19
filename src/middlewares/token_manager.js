const jwt = require("jsonwebtoken");
const cypherKey = process.env.CYPER_KEY;
const userDao = require('../modules/user/userDao');
const adminDao = require('../modules/admin/adminDao');
const roleDao = require('../modules/role/roleDao')
const commonMessage = require('../response-message/commonMessage');
const { badReqResponse, internalServerError } = require('../helper/response_utility');

async function createToken(payload) {
    let token = jwt.sign({ userId: payload.id }, cypherKey, {
        algorithm: "HS256",
        expiresIn: 60 * 60 * 24 * 365 * 2,
    });
    token = Buffer.from(token).toString("base64");
    return token;
}

async function createAdminToken(payload) {
    let token = jwt.sign({ email: payload.email, id: payload.id }, cypherKey, {
        algorithm: "HS256",
        expiresIn: '24h',
    });
    token = Buffer.from(token).toString("base64");
    return token;
}

async function verifyToken(request, response, next) {
    try {
        const authHeader = request.headers['authorization'];
        const _token = authHeader && authHeader.split(' ')[1];
        if (_token !== undefined) {

            let token = Buffer.from(_token, "base64").toString("utf-8");
            let verification;
            try {
                verification = jwt.verify(token, cypherKey);
            } catch (ex) {
                verification = false;
            }
            if (verification) {
                let decoded = jwt.decode(token);
                let user = await userDao.findById(decoded.userId);
                if (user) {
                    request.userData = decoded;
                    next();
                } else {
                    return badReqResponse(request, response, commonMessage.INVALID_USER);
                }
            } else {
                return badReqResponse(request, response, commonMessage.INVALID_TOKEN);
            }
        } else {
            return badReqResponse(request, response, commonMessage.MISSING_TOKEN);
        }
    } catch (err) {
        return badReqResponse(request, response, commonMessage.APP_REINSTALL);
    }
}

async function verifyAdminToken(request, response, next) {
    try {
        const authHeader = request.headers['authorization'];
        const _token = authHeader && authHeader.split(' ')[1];
        if (_token !== undefined) {

            let token = Buffer.from(_token, "base64").toString("utf-8");
            let verification;
            try {
                verification = jwt.verify(token, cypherKey);
            } catch (ex) {
                verification = false;
            }
            if (verification) {
                let decoded = jwt.decode(token);
                try {
                    let user = await adminDao.findByEmailIdWithRole(decoded.email, decoded.id);
                    if (user) {
                        decoded.role = user.roles
                        request.adminData = decoded;
                        next();
                    } else {
                        return badReqResponse(request, response, commonMessage.INVALID_USER);
                    }
                } catch (error) {
                    console.log("error", error);
                    return badReqResponse(request, response, commonMessage.INVALID_USER);
                }
            } else {
                return badReqResponse(request, response, commonMessage.INVALID_TOKEN);
            }
        } else {
            return badReqResponse(request, response, commonMessage.MISSING_TOKEN);
        }
    } catch (error) {
        return internalServerError(request, response, error);
    }
}

module.exports = {
    createToken,
    verifyToken,
    createAdminToken,
    verifyAdminToken
}