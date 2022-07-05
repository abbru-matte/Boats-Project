
import { errorMessage } from "../utils/responses";
/**
 * Funzione per costruire e tornare gli errori
 * @param err errore generato nella richiesta
 * @param req richiesta
 * @param res risposta
 * @param next successivo
 */
export const errorHandler = (err,req,res,next) => { 
    res.message = err.message;
    if(res.status_code == null){
        res.status_code = 401;
        res.status_message = "Unauthorized";
    }
    errorMessage(res);
}