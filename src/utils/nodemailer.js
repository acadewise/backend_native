require('dotenv').config();
const nodemailer = require('nodemailer');
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;

const COMMON = require('../constants/common')

/**
 * This method send an email to user to set his/her password to login in to site
 * @method sendSetPasswordEmail
 * @param {String} email
 * @param {Sting} token
 */
async function sendResetPasswordEmail(email, link) {

    const clientId = process.env.EMAIL_CLIENT_ID;
    const clientSecret = process.env.EMAIL_CLIENT_SECRET;
    const refreshToken = process.env.EMAIL_REFERSH_TOKEN;
    const emailRedirectUri = process.env.EMAIL_REDIRECT_URI;
    const emailId = process.env.EMAIL_ID;

    const oauth2Client = new OAuth2(
        clientId,
        clientSecret,
        emailRedirectUri
    );
    oauth2Client.setCredentials({
        refresh_token: refreshToken
    });
    const accessToken = oauth2Client.getAccessToken();
    const smtpTransport = nodemailer.createTransport({
        service: "gmail",
        auth: {
            type: "OAuth2",
            user: emailId,
            clientId: clientId,
            clientSecret: clientSecret,
            refreshToken: refreshToken,
            accessToken: accessToken
        }
    });
    let htmls = '';
    let subjects = '';
        htmls = `<h4> Your account email is:- ${email} Click on this link to set your password </h4>
        ${link}`
        subjects = 'Password reset'

    let mailDetails = {
        from: `Rzbels <itshrbels@gmail.com>`,
        to: email,
        subject: subjects,
        generateTextFromHTML: true,
        html: htmls
    };
    new Promise((resolve, reject) => {
        smtpTransport.sendMail(mailDetails, function (err, data) {
            if (err) {
                smtpTransport.close();
                return reject(err);
            } else {
                smtpTransport.close();
                return resolve(true);
            }

        });
    })
}

async function sendAdminRegistrationEmail(email, link) {

    const clientId = process.env.EMAIL_CLIENT_ID;
    const clientSecret = process.env.EMAIL_CLIENT_SECRET;
    const refreshToken = process.env.EMAIL_REFERSH_TOKEN;
    const emailRedirectUri = process.env.EMAIL_REDIRECT_URI;
    const emailId = process.env.EMAIL_ID;

    const oauth2Client = new OAuth2(
        clientId,
        clientSecret,
        emailRedirectUri
    );
    oauth2Client.setCredentials({
        refresh_token: refreshToken
    });
    const accessToken = oauth2Client.getAccessToken();
    const smtpTransport = nodemailer.createTransport({
        service: "gmail",
        auth: {
            type: "OAuth2",
            user: emailId,
            clientId: clientId,
            clientSecret: clientSecret,
            refreshToken: refreshToken,
            accessToken: accessToken
        }
    });
    let htmls = '';
    let subjects = '';
        htmls = `<h4> Your account successfully created. Please click on this link ${link} to login and login credentials email is:- ${email}, password is:- ${COMMON.DEFAULT_PASS}`
        subjects = 'Account Created'

    let mailDetails = {
        from: `Rzbels <itshrbels@gmail.com>`,
        to: email,
        subject: subjects,
        generateTextFromHTML: true,
        html: htmls
    };
    new Promise((resolve, reject) => {
        smtpTransport.sendMail(mailDetails, function (err, data) {
            if (err) {
                smtpTransport.close();
                return reject(err);
            } else {
                smtpTransport.close();
                return resolve(true);
            }

        });
    })
}

module.exports = {
    sendResetPasswordEmail,
    sendAdminRegistrationEmail
}
