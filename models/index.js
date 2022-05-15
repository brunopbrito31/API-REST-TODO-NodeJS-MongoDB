const userModel = require('./User');
const taskModel = require('./Task');

const models = {
    User: userModel,
    Task: taskModel
}

module.exports = models;