const AuthController = require('../controllers/authController');

exports.authRoutes = ( routes ) => {
    routes.post('/login', AuthController.login);
}


