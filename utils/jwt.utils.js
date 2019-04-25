const jwt = require('jsonwebtoken');

const JWT_SIGN_SECRET = ' SFGQDFB54QSDF5G4W5XV43QGREgdfg54214542sdf24242sf424bjksgdfsqfgZR';
module.exports = {
    generateToken(userData){
        return jwt.sign({
            id : userData.id,
            type : userData.type
            //pas plus d'info que ca car facilement decodable
        },
        JWT_SIGN_SECRET,
        {
            expiresIn: '24h'
        });
    },

    //verify tokens (à mettre dans toute les routes à securiser)
    verifyToken(req, res, next){
        if(!req.headers.authorization){
            return res.status(401).send('Unauthorized');
        }
        
        let token = req.headers.authorization.split(' ')[1];
        if( token === 'null'){
            return res.status(401).send('Unauthorized', );
        }
       
        try{
            let payLoad = jwt.verify(token, JWT_SIGN_SECRET, {expiresIn:  "24h"});
            req.userId = payLoad.subject;
            next();
        }
        catch{
            return res.status(401).send('Unauthorized'); 
        }
        
            
        
        
    }
}