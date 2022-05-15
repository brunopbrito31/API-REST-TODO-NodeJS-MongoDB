const mongoose = require('mongoose');
const url = require('../config/dev/index');

mongoose.connect(url.database_string_conn);

const taskSchema = new mongoose.Schema({
    title: {type: String, required: true},
    description: {type: String, required: true},
    priority: {type: String, required: true},
    status:{type:Number, required: true},
    user: {type:String, required:false}
});

const userSchema = new mongoose.Schema({
    name: {type: String, required: true},
    login: {type: String, required: true},
    password: {type: String, required: true},
    tasks: {type: Array, required: false, default: []}
});

mongoose.model('Tasks', taskSchema);
mongoose.model('Users', userSchema);

module.exports = mongoose;