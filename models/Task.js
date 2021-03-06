const db = require('../db');
const taskModelOperator = db.models.Tasks;

const taskModel = {

    listByUser( userId ){
        let result = taskModelOperator.find({ user: userId },{ title:1, description:1, priority:1, status:1 });
        return result;
    },

    async listByUserwithPagination( userId, page=1, limit=5 ){
        let result = await taskModelOperator.find({ user: userId }).skip( (page-1)*limit ).limit(limit*1);

        let qtPages = (await taskModelOperator.find({ user: userId }).count())/limit;
        if( qtPages !== parseInt(qtPages) ){
            qtPages = (parseInt(qtPages) == qtPages +1) ? 
                parseInt(qtPages) : (parseInt(qtPages) + 1);
        }

        let finalResultObject = {
            pagination:{
                page: page,
                total: qtPages
            },
            return: result
        }

        return finalResultObject;
    },

    findById( idTask ){
        let result = taskModelOperator.findById(idTask);
        return result;
    },

    create( task, userId ){
        let { title, description, priority } = task;
        let status = 'new';
        let result = taskModelOperator.create({
            title, 
            description, 
            priority, 
            status, 
            user: userId 
        });
        return result;
    },

    updateStatusById( idTask, newStatus ){
        let result = taskModelOperator.updateOne({_id: idTask},{status: newStatus});
        return result;
    },

    updatePriorityById( idTask, newPriority ){
        let result = taskModelOperator.updateOne({_id: idTask},{priority: newPriority});
        return result;
    },

    async alterStatus( task, newStatus ){
        let oldStatus  = task.status;
        let msgErro = {
            newError: 'Não é possível alterar o status de uma tarefa em curso ou já existente para o status de nova tarefa',
            inProgressError: 'Só é possível realizar uma tarefa que esteja com o status de new',
            updtCancelError: 'Só é possível cancelar uma tarefa nova ou em andamento',
            completeError: 'Só é possível finalizar uma tarefa que esteja em andamento',
            inactiveError: 'Só é possível desativar uma tarefa que esteja concluída ou que foi cancelada',
            newStatus: newStatus.toLowerCase()
        }
        
        switch(newStatus){
            case 'new':
                return {
                    updated: false, 
                    content: {
                        message: msgErro.newError
                    }
                };
            case 'in-progress':
                if( oldStatus != 'new'){
                    return {
                        updated: false,
                        content:{
                            message: msgErro.inProgressError
                        }
                    }
                }
                await this.updateStatusById( task._id, newStatus);
                return { updated: true };
            case 'canceled':
                if( oldStatus == 'canceled' || oldStatus == 'complete' || oldStatus == 'inactive' ){
                    return {
                        updated: false,
                        content: {
                            message: msgErro.updtCancelError
                        }
                    }
                }
                await this.updateStatusById( task._id, newStatus);
                return { updated: true };
            case 'complete':
                if( oldStatus != 'in-progress' ){
                    return {
                        updated: false,
                        content: {
                            message: msgErro.completeError
                        }
                    }
                }
                await this.updateStatusById( task._id, newStatus);
                return { updated: true };
            case 'inactive':
                if( oldStatus == 'canceled' || oldStatus == 'complete' ){
                    await this.updateStatusById( task._id, newStatus);
                    return { updated: true };
                }
                return {
                    updated: false,
                    content: {
                        message: msgErro.inactiveError
                    }
                }
        }
    },

    async alterPriority( task, newPriority ){
        let oldstatus = task.status;

        if( oldstatus != 'new' || oldstatus != 'in-progress' ){
            return{
                updated: false,
                content:{
                    message: 'Só é possível alterar a prioridade de uma tarefa nova ou que esteja em andamento'
                }
            }
        }
        await this.updatePriorityById( task._id, newPriority );
        return { updated: true };
    },

    deleteById( taskId, userId ){
        let result = taskModelOperator.deleteOne({ _id:taskId, user: userId })
        return result;
    }

}

module.exports = taskModel;