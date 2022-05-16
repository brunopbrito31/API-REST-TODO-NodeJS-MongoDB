const models = require('../models'),
    taskModel = models.Task;

const MSG_ERRO_500 = 'Houve um erro inesperado, contacte o administrador';

const TaskController = {

    // Cria uma nova tarefa para o usuário
    newInsert: async ( req, res, next ) => {
        try{
            let { title, description, priority } = req.body;
            let status = 'new';
            let user = req.userId;
            let task = { title, description, priority, status };
            let result = await taskModel.create( task, user );

            res.status(201).json({ result: result });
        }catch( error ){
            res.status(500).json({ error: true, message: MSG_ERRO_500 });
        }
    },

    // Lista todas as tarefas do usuário
    listByUser: async ( req, res, next ) => {
        try{
            let user = req.userId;
            let result = await taskModel.listByUser( user );
            res.status(200).json({ result: result });
        }catch( error ){
            res.status(500).json({ error: true, message: MSG_ERRO_500 })
        }
    },

    alterStatus: async ( req, res, next ) =>{
        try{
            if( !req.query.idTask ){
                return res.status(400).json({ Error: 'Voce deve informar o Id da Tarefa (idTask)' });
            }
            if( !req.query.newStatus ){
                return res.status(400).json({ Error: 'Novo status não informado' });
            }
            let user = req.userId;
            let { idTask, newStatus } = req.query;
            let searchedTask = await taskModel.findById( idTask );

            if( searchedTask && searchedTask.user == user ){
               // Função de alterar o status
                let result = await taskModel.alterStatus( searchedTask, newStatus );
                result.updated ? res.status(204).json() : res.status(400).json({ message: result.content.message });
            }else{
                return res.status(404).json({Error: 'Tarefa não encontrada!'});
            }

        }catch( error ){
            res.status(500).json({ error: true, message: MSG_ERRO_500 })
        }
    },

    // Realiza a remoção de tarefa pelo Id da Tarefa e pelo usuário do Token
    removeById: async ( req, res, next ) => {
        try{
            // Caso o usuário não informe o Id da Tarefa
            if( !req.query.idTask ){
                return res.status(400).json({ Error: 'Voce deve informar o Id da Tarefa (idTask)' });
            }
            // Id do Usuário e Id da Tarefa
            let user = req.userId;
            let idTask = req.query.idTask;

            let task = await taskModel.findById( idTask );
            if( task && task.user == user ){
                let result = await taskModel.deleteById( idTask,  user );
                if(result.deletedCount == 1){
                    res.status(204).json();
                }else{
                    res.status(500).json({ error: true, message: MSG_ERRO_500 });
                }
            }else{
                return res.status(404).json({Error: 'Tarefa não encontrada!'});
            }
        }catch(error){
            res.status(500).json({ message: error.message });
        }
    }
}

module.exports = TaskController;