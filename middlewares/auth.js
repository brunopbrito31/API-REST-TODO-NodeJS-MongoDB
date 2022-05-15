const secret = require('../config/dev/secret');
const expressJWT = require('express-jwt');

module.exports = expressJWT({
    secret: secret.key,
    algorithms: ["HS256"],
});