import { ResponseHttpBuilder } from "../response/ResponseHttpBuilder";
/**
 * Invia la risposta di una POST andata a buon fine
 * @param res contiene i parametri per la risposta HTTP
 */
export const successResponsePOST = (res:any) => {
    res.header("Content-Type", "application/json");
    const response = new ResponseHttpBuilder();
    if(res.data!=null) response.setData(res.data);
    let jsonResponse = JSON.stringify(response.setStatusCode(res.status_code)
            .setStatus(res.status_message)
            .setMessage(res.message)
            .build());
    res.status(res.status_code).send(jsonResponse);
};
/**
 * Invia la risposta di una GET andata a buon fine
 * @param res contiene i parametri per la risposta HTTP
 */
export const successResponseGET = (res:any) => {
    res.header("Content-Type", "application/json");
    const response = new ResponseHttpBuilder();
    let jsonResponse = JSON.stringify(response.setStatusCode(res.status_code)
            .setStatus(res.status_message)
            .setMessage(res.message)
            .setData(res.data)
            .build());
    res.status(res.status_code).send(jsonResponse);
};

/**
 * Invia la risposta di una richiesta che presenta errori
 * @param res contiene i parametri la risposta HTTP
 */
export const errorMessage = (res:any) => {
    res.header("Content-Type", "application/json");
    const response = new ResponseHttpBuilder();
    let jsonResponse = JSON.stringify(response.setStatusCode(res.status_code)
            .setStatus(res.status_message)
            .setMessage(res.message)
            .build());
    res.status(res.status_code).send(jsonResponse);
}

