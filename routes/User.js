const userController = require('../controllers/UserController');

exports.userRoutes = ( routes ) => {
    routes.post('/login', userController.login);
    routes.post('/users', userController.newInsert);
    routes.get('/users',  userController.listAll);
}