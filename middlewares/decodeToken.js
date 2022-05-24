const jwt = require('jsonwebtoken');

module.exports = (req, res, next) =>{
    let token = req.header('Authorization');
    token = token.replace('Bearer ','');
    token = jwt.decode(token);
    req.userId = token.id;
    next();
}