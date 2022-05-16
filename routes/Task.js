const TaskController = require('../controllers/TaskController');

// Middleware que Verifica Se o Usuário está Autenticado
const AuthValidator = require('../middlewares/auth');
const DecodeToken   = require('../middlewares/decodeToken');
const TaskValidation= require('../validations/task');


exports.taskRoutes = ( routes ) =>{
    routes.get('/tasks',    AuthValidator, DecodeToken, TaskController.listByUser);
    routes.post('/tasks',   AuthValidator, TaskValidation, DecodeToken, TaskController.newInsert);
    routes.put('/tasks/update-status', AuthValidator, DecodeToken, TaskController.alterStatus);
    routes.delete('/tasks', AuthValidator, DecodeToken, TaskController.removeById);
}