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

    // Lista todas as tarefas do usuário (Com Paginação);
    listByUserWithPagination: async ( req, res, next ) => {
        try{
            let user = req.userId;
            let { page, limit } = req.query;
            let result = await taskModel.listByUserwithPagination( user, page, limit );
            res.status(200).json({ result: result });
        }catch( error ){
            res.status(500).json({ error: true, message: error.message })
        }
    },

    findByIdTask: async ( req, res, next ) => {
        try{
            if( !req.params.idTask ){
                return res.status(400).json({ Error: 'Voce deve informar o Id da Tarefa (idTask)' });
            }
            let user = req.userId;
            let idTask = req.params.idTask;
            let searchedTask = await taskModel.findById( idTask );

            if( !searchedTask || searchedTask.user != user ){
                return res.status(404).json({Error: 'Tarefa não encontrada!'});
            }else{
                res.status(200).json({result: searchedTask});
            }

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

    alterPriority: async ( req, res, next ) => {
        try{
            if( !req.query.idTask ){
                return res.status(400).json({ Error: 'Voce deve informar o Id da Tarefa (idTask)' });
            }
            if( !req.query.newPriority ){
                return res.status(400).json({ Error: 'Nova prioridade não informada' });
            }
            let user = req.userId;
            let { idTask, newPriority } = req.query;
            let searchedTask = await taskModel.findById( idTask );

            if( searchedTask && searchedTask.user == user ){
                let result = await taskModel.alterPriority(searchedTask, newPriority);
                result.updated ? res.status(240).json() : res.status(400).json({ message: result.content.message });
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
    },

    // Realiza o download de um relatório com todas as tarefas do usuário 
    getDownload: async (req, res, next) =>{
        const db = require('../db');
        // Id de usuário mockado 
        let userId = req.userId;
        
        const taskModelOperator = db.models.Tasks;
        const createCsvWriter = require('csv-writer').createObjectCsvWriter;
        console.log('Chegou no endpoint de download');
        let csvWriter = createCsvWriter({
            path:'./report-user.csv',
            header:[
                {id: 'title', title: 'TITULO'},
                {id: 'description', title: 'DESCRICAO'},
                {id: 'priority' , title: 'PRIORIDADE'},
                {id: 'status' , title: 'STATUS'}
            ]
        });
        
        let taskCursor = taskModelOperator.find({ user: userId },
        {
            title:1, 
            description:1, 
            priority:1, 
            status:1 
        }).cursor();
        
        taskCursor.on('data', async ( chunk )=>{
            console.log('Escrevendo');
            taskCursor.pause();
            await csvWriter.writeRecords([
                {
                    title: chunk.title, 
                    description: chunk.description, 
                    priority: chunk.priority, 
                    status: chunk.status
                }
            ]);
            taskCursor.resume();
            console.log('.:Done')
        })

        taskCursor.on('end', ()=>{
            res.download('./report-user.csv');
        })
    }
}

module.exports = TaskController;