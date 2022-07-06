require('dotenv').config();
const jwt = require('jsonwebtoken');

/**
 * Funzione che controlla che sia presente l'header nella richiesta
 * @param req richiesta
 * @param res risposta
 * @param next successivo
 */
export const checkHeader = (req,res,next) => {
    try{
        const authHeader = req.headers.authorization;
        if(authHeader){
            next();
        } else {
            let err = new Error("no auth header");
            next(err);
        }
    }catch(error){
        next(error);
    }
};
/**
 * Funzione che verifica la correttezza del token JWT e decodifica il payload.
 * @param req richiesta
 * @param res risposta
 * @param next successivo
 */
export const verifyAndAuthenticate = (req,res,next) => {
    try{
        let decoded = jwt.verify(req.token, process.env.SECRET_KEY);
        if(decoded !== null){
            req.param = decoded.ruolo
            req.user = decoded.username
            next();
        }else{
            let error = new Error("Signature Error") 
            next(error);
        }
    }catch(error){
        next(error);
    }
};
/**
 * Funzione che verifica che il token JWT contenga nel payload il ruolo admin
 * @param req richiesta
 * @param res risposta
 * @param next successivo
 */
export const checkRoleAdmin = (req,res,next) => {
    try{  
        if(req.param === "admin"){
            req.username = req.user;
            next();
        }else{
            let error = new Error("Solo un utente admin può eseguire questa operazione") 
            next(error);
        }
    }catch(error){
        next(error);
    }
};
/**
 * Funzione che verifica che il token JWT contenga nel payload il ruolo user
 * @param req richiesta
 * @param res risposta
 * @param next successivo
 */
export const checkRoleUser = (req,res,next) => {
    try{  
        if(req.param === "user"){
            req.username = req.user;
            next();
        }else{
            let error = new Error("Solo un utente con ruolo user può eseguire questa operazione") 
            next(error);
        }
    }catch(error){
        next(error);
    }
};

/**
 * Funzione che controlla la presenza del bearerToken JWT
 * @param req richiesta
 * @param res risposta
 * @param next successivo 
 */
export const checkToken = (req,res,next) => {
    try{
        const bearerHeader = req.headers.authorization;
        if(typeof bearerHeader!=='undefined'){
            const bearerToken = bearerHeader.split(' ')[1];
            req.token = bearerToken;
            next();
        }else{
            let error = new Error("Signature error") 
            next(error)
        }
    }catch(error){
        next(error);
    }
};