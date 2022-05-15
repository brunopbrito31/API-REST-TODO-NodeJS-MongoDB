const db = require('../db');
const taskModelOperator = db.models.Tasks;

const taskModel = {

    listByUser( userId ){
        let result = taskModelOperator.find({ user: userId },{ title:1,description:1,priority:1 });
        return result;
    },

    findById( idTask ){
        let result = taskModelOperator.findById(idTask);
        return result;
    },

    create( task, userId ){
        let { title, description, priority } = task;
        let status = 1;
        let result = taskModelOperator.create({
            title, 
            description, 
            priority, 
            status, 
            user: userId 
        });
        return result;
    },

    deleteById( taskId, userId ){
        let result = taskModelOperator.deleteOne({ _id:taskId, user: userId })
        return result;
    }

}

module.exports = taskModel;