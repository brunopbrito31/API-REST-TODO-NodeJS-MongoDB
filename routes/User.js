const userController = require('../controllers/userController');

exports.userRoutes = ( routes ) => {
    routes.post('/users', userController.newInsert);
    routes.get('/users',  userController.listAll);
    routes.post('/login', userController.login);
}