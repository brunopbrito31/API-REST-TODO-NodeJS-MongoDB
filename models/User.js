const db = require('../db'),
    bcrypt = require('bcryptjs'),
    jwt = require('jsonwebtoken');
const userModelOperator = db.models.Users;
 
const userModel = {

    async createWithProtectedPassword(userObject){
        
        let { name, login, password } = userObject;
        let tasksTemp = userObject.tasks ? userObject.tasks : [];
        let passwordTemp = await bcrypt.hash( password, 10 );

        let result = userModelOperator.create({
            name: name,
            login: login,
            password: passwordTemp,
            tasks: tasksTemp
        });
        return result;
    },

    listAll(){
        var result = userModelOperator.find( {}, { name:1,login:1, tasks:1 } );
        return result;
    },

    findByLogin( login ){
        let searchedUser = userModelOperator.findOne({ login });
        return searchedUser;
    },

    async isValidPassword( databasePassword, password ){
        let validPassword = bcrypt.compareSync( password, databasePassword );
        return validPassword;
    },

    async generateJWT( user, secret ){
        let token =  await jwt.sign(
            {
                id: user.id,
                login: user.login,
                name: user.name
            },
            secret.key
        );
        return token;
    }

}

module.exports = userModel;