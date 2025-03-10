"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendTokenResponse = void 0;
//get token from model , create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
    //create token
    const token = user.getSignedJwtToken();
    const options = {
        expires: new Date(Date.now() + Number(process.env.JWT_COOKIE_EXPIRE) * 24 * 60 * 60 * 1000),
        //we only want cookie to be acced though client side
        httpOnly: true,
    };
    if (process.env.NODE_ENV === 'production') {
        options.secure = true;
    }
    res.status(statusCode).cookie('token', token, options).json({
        success: true,
        token,
    });
};
exports.sendTokenResponse = sendTokenResponse;
//# sourceMappingURL=generateCookieResponse.js.map