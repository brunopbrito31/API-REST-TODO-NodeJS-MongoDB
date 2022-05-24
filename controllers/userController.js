const models = require('../models'),
    secret = require('../config/dev/secret');
    userModel = models.User;

const MSG_ERRO_500 = 'Houve um erro inesperado, contacte o administrador';

const userController = {

    newInsert: async (req, res) => {
        try{
            let userObject = req.body;
            let result = await userModel.createWithProtectedPassword( userObject );

            let userObjectResult = {
                id: result._id,
                name: result.name,
                login: result.login,
                tasks: result.tasks
            }

            res.status(201).json( userObjectResult );
        }catch(error){
            res.status(500).json({ error: true, menssagem: MSG_ERRO_500 });
        }
    },

    listAll: async (req, res) => {
        try{
            let result = await userModel.listAll();
            res.status(200).json({errors: false, content: result});
        }catch(error){
            res.status(500).json({errors: true, menssagem: error.message});
        }
    },

    login: async ( req, res, next ) => {
        console.log('Tentativa de login')
        console.log(req.body);

        if( !req.body?.login || !req.body?.password ){
            return res.status(401).json('Você Deve Informar o Usuário e Senha');
        }
        const { login, password } = req.body;

        let searchedUser = await userModel.findByLogin( login );

        if(!searchedUser){
            return res.status(401).json('Acesso não autorizado: Usuário ou senha inválido(s)');
        }

        if( userModel.isValidPassword( searchedUser.password, password ) ){
            let tokenUser = await userModel.generateJWT( searchedUser, secret );
            res.status(200).json(tokenUser);
        }else{
            return res.status(401).json('Acesso não autorizado: Usuário ou senha inválido(s)');
        }

    }
}

module.exports = userController;