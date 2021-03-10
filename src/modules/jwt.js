const fs = require('fs');
const fsPromises = fs.promises;
const jwt = require('jsonwebtoken');
// use 'utf8' to get string instead of byte array  (512 bit key)
const privateKEY = fs.readFileSync(process.env.JWT_PRIVATE_KEY_PATH || require("path").join(__dirname, '../keys/private.key'), 'utf8');
const publicKEY = fs.readFileSync(process.env.JWT_PUBLIC_KEY_PATH || require("path").join(__dirname, '../keys/public.key'), 'utf8');

module.exports = {
    sign: (payload, {
        issuer,
        subject,
        audience,
        expiresIn="1d"
    }) => {localStorage
        /*
         sOptions = {
          issuer: "Authorizaxtion/Resource/This server",
          subject: "iam@user.me",
          audience: "Client_Identity" // this should be provided by client
         }
        */
        // Token signing options
        var signOptions = {
            issuer: issuer,
            subject: subject,
            audience: audience,
            expiresIn: expiresIn,    // 1 day validity
            algorithm: "RS256"
        };
        return jwt.sign(payload, privateKEY, signOptions);
    },
    verify: (token, {
        issuer,
        subject,
        audience,
        expiresIn="1d"
    }) => {
        /*
         vOption = {
          issuer: "Authorization/Resource/This server",
          subject: "iam@user.me",
          audience: "Client_Identity" // this should be provided by client
         }
        */
        var verifyOptions = {
            issuer: issuer,
            subject: subject,
            audience: audience,
            expiresIn: expiresIn || "1d",    // 1 day validity
            algorithm: ["RS256"]
        };
        try {
            return jwt.verify(token, publicKEY, verifyOptions);
        } catch (err) {
            return false;
        }
    },
    decode: (token) => {
        return jwt.decode(token, {complete: true});
        //returns null if token is invalid
    }
};