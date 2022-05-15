const express= require('express'),
    TaskRoutes = require('./Task'),
    UserRoutes = require('./User'),
    routes = express.Router();

// Routes of Application
TaskRoutes.taskRoutes( routes );
UserRoutes.userRoutes( routes );

module.exports = routes;