const models = require('../models'),
    taskModel = models.Task;

const MSG_ERRO_500 = 'Houve um erro inesperado, contacte o administrador';

const TaskController = {

    // Cria uma nova tarefa para o usuário
    newInsert: async (req, res) => {
        try{
            const { title, description, priority } = req.body;
            const status = 1;
            const user = req.userId;
            let task = { title, description, priority, status };
            let result = await taskModel.create( task, user );

            res.status(201).json({ result: result });
        }catch( error ){
            res.status(500).json({ error: true, message: MSG_ERRO_500 });
        }
    },

    // Lista todas as tarefas do usuário
    listByUser: async ( req, res ) => {
        try{
            let user = req.userId;
            let result = await taskModel.listByUser( user );
            res.status(200).json({ result: result });
        }catch( error ){
            res.status(500).json({ error: true, message: MSG_ERRO_500 })
        }
    },

    // Realiza a remoção de tarefa pelo Id da Tarefa e pelo usuário do Token
    removeById: async ( req, res ) => {
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