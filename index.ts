//importo le librerie
import validator = require("./components/middleware/middlewareValidation");
import * as responses from "./components/utils/responses"
import * as auth from './components/middleware/middlewareAuth'
import * as express from "express";
import {errorHandler} from "./components/middleware/middlewareErrorHandler";
import { ResponseHttpBuilder } from "./components/response/ResponseHttpBuilder";

const PORT = 8080;
const HOST = '0.0.0.0';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use([
        auth.checkHeader,
        auth.checkToken,
        auth.verifyAndAuthenticate,
        errorHandler
        ]);

//Rotta admin per l'inserimento di una nuova imbarcazione tramite POST
app.post('/creaImbarcazione', auth.checkRoleAdmin,validator.checkAdminJWT,validator.checkPostNewBoat, errorHandler, (req, res) => {
       responses.successResponsePOST(res);
});
//Rotta admin per l'inserimento di una nuova geofence area tramite POST
app.post('/creaGeofence', auth.checkRoleAdmin,validator.checkAdminJWT,validator.checkPostGeofence, errorHandler, (req, res) => {
       responses.successResponsePOST(res);
});
//Rotta admin per l'inserimento di una nuova associazione tra geofence area e imbarcazione tramite POST
app.post('/creaAssociazione', auth.checkRoleAdmin,validator.checkAdminJWT,validator.checkPostAssociazione, errorHandler, (req, res) => {
       responses.successResponsePOST(res);
});
//Rotta user per l'invio dei dati istantanei tramite POST
app.post('/inviaDati', auth.checkRoleUser,validator.checkUserJWT,validator.checkCredito,validator.checkPostInvioDati, errorHandler, (req, res) => {
       responses.successResponsePOST(res);
});
//Rotta admin per la rimozione di una associazione esistente tra geofence area e imbarcazione tramite DELETE
app.delete('/deleteAssociazione', auth.checkRoleAdmin,validator.checkAdminJWT,validator.checkDeleteAssociazione, errorHandler, (req, res) => {
       responses.successResponsePOST(res);
});
//Rotta admin per ottenere tutte le imbarcazioni tramite GET
app.get('/getAllImbarcazioni', auth.checkRoleAdmin,validator.checkAdminJWT,validator.getAllImbarcazioni, errorHandler, (req, res) => {
       responses.successResponseGET(res);
});
//Rotta admin per ottenere tutte le geofences tramite GET
app.get('/getAllGeofences', auth.checkRoleAdmin,validator.checkAdminJWT,validator.getAllGeofences, errorHandler, (req, res) => {
       responses.successResponseGET(res);
});
//Rotta admin per ottenere tutti gli utenti tramite GET
app.get('/getAllUsers', auth.checkRoleAdmin,validator.checkAdminJWT,validator.getAllUsers, errorHandler, (req, res) => {
       responses.successResponseGET(res);
});
//Rotta admin per ottenere tutte le associazioni tramite GET
app.get('/getAllAssociazioni', auth.checkRoleAdmin,validator.checkAdminJWT,validator.getAllAssociazioni, errorHandler, (req, res) => {
       responses.successResponseGET(res);
});
//Rotta admin per ottenere tutte le entrate/uscite tramite GET
app.get('/getEntrateUscite', auth.checkRoleAdmin,validator.checkAdminJWT,validator.getEntrateUscite, errorHandler, (req, res) => {
       responses.successResponseGET(res);
});
//Rotta user per ottenere tutte le proprie associazioni tramite GET
app.get('/getAssociazioni', auth.checkRoleUser,validator.checkUserJWT,validator.getAssociazioniUser, errorHandler, (req, res) => {
       responses.successResponseGET(res);
});



//Rotta not found per le richieste GET di rotte non esistenti
app.get('*', function(req, res){
       res.header("Content-Type", "application/json");
       const response = new ResponseHttpBuilder();
       let json = JSON.stringify(response.setStatusCode(404)
                      .setStatus("Not found")
                      .setMessage("Rotta non trovata")
                      .build());
       res.status(res.statusCode).send(json);
});
//Rotta not found per le richieste POST di rotte non esistenti
app.post('*', function(req, res){
       res.header("Content-Type", "application/json");
       const response = new ResponseHttpBuilder();
       let json = JSON.stringify(response.setStatusCode(404)
                      .setStatus("Not found")
                      .setMessage("Rotta non trovata")
                      .build());
       res.status(res.statusCode).send(json);
});
//Rotta not found per le richieste DELETE di rotte non esistenti
app.delete('*', function(req, res){
       res.header("Content-Type", "application/json");
       const response = new ResponseHttpBuilder();
       let json = JSON.stringify(response.setStatusCode(404)
                      .setStatus("Not found")
                      .setMessage("Rotta non trovata")
                      .build());
       res.status(res.statusCode).send(json);
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);