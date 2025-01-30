import session from 'express-session';
import MySQLStore from 'express-mysql-session';
import jwt from 'jsonwebtoken'

const options = {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'root',
    database: 'blogdb'
};

const SessionStore = MySQLStore(session);
export const store = new SessionStore(options);


export const middlewareAuth = (req,res,next)=>{



    try{

        if(!req.session.user || !req.session.token || !req.session){

            return res.status(401).json({
                success:false,
                message:'session invalide ou expiré',
                status:401
            })
        }

        try{

            const token = req.session.token

            const decodage = jwt.verify(token,'message secret')

            const user = req.session.user

            if(decodage.id !== user.id || decodage.username !== user.username || decodage.email !== user.email){

                return res.status(401).json({
                    success:false,
                    message:"information d'utilisateur incorrect",
                    status:401
                })
    
            }

            console.log('middleware validé')
            req.user = decodage
            next()

        }catch(error){


            return res.status(500).json({
                success:false,
                message:error.message
            })

        }
        
    }catch(error){

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }
}