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
       if (res.status_code == 201){
              responses.successResponsePOST(res);
       }
});
//Rotta admin per l'inserimento di una nuova geofence area tramite POST
app.post('/creaGeofence', auth.checkRoleAdmin,validator.checkAdminJWT,validator.checkPostGeofence, errorHandler, (req, res) => {
       if (res.status_code == 201){
              responses.successResponsePOST(res);
       }
});
//Rotta admin per l'inserimento di una nuova associazione tra geofence area e imbarcazione tramite POST
app.post('/creaAssociazione', auth.checkRoleAdmin,validator.checkAdminJWT,validator.checkPostAssociazione, errorHandler, (req, res) => {
       if (res.status_code == 201){
              responses.successResponsePOST(res);
       }
});
//Rotta admin per la ricarica del credito dell'utente
app.put('/ricaricaUtente', auth.checkRoleAdmin,validator.checkAdminJWT,validator.checkRicaricaUtente, errorHandler, (req, res) => {
       if (res.status_code == 200){
              responses.successResponsePOST(res);
       }
       
});
//Rotta user per l'invio dei dati istantanei tramite POST
app.post('/inviaDati', auth.checkRoleUser,validator.checkUserJWT,validator.checkCredito,validator.checkPostInvioDati, errorHandler, (req, res) => {
       if (res.status_code == 201){
              responses.successResponsePOST(res);
       }
});

//Rotta admin per la rimozione di una associazione esistente tra geofence area e imbarcazione tramite DELETE
app.delete('/deleteAssociazione', auth.checkRoleAdmin,validator.checkAdminJWT,validator.checkDeleteAssociazione, errorHandler, (req, res) => {
       if (res.status_code == 200){
              responses.successResponsePOST(res);
       }
});
//Rotta admin per ottenere tutte le imbarcazioni tramite GET
app.get('/getAllImbarcazioni', auth.checkRoleAdmin,validator.checkAdminJWT,validator.getAllImbarcazioni, errorHandler, (req, res) => {
       if (res.status_code == 200){
              responses.successResponseGET(res);
       }
});
//Rotta admin per ottenere tutte le geofences tramite GET
app.get('/getAllGeofences', auth.checkRoleAdmin,validator.checkAdminJWT,validator.getAllGeofences, errorHandler, (req, res) => {
       if (res.status_code == 200){
              responses.successResponseGET(res);
       }
});
//Rotta admin per ottenere tutti gli utenti tramite GET
app.get('/getAllUsers', auth.checkRoleAdmin,validator.checkAdminJWT,validator.getAllUsers, errorHandler, (req, res) => {
       if (res.status_code == 200){
              responses.successResponseGET(res);
       }
});
//Rotta admin per ottenere tutte le associazioni tramite GET
app.get('/getAllAssociazioni', auth.checkRoleAdmin,validator.checkAdminJWT,validator.getAllAssociazioni, errorHandler, (req, res) => {
       if (res.status_code == 200){
              responses.successResponseGET(res);
       }
});
//Rotta admin per ottenere tutte le entrate/uscite tramite GET
app.get('/getEntrateUscite', auth.checkRoleAdmin,validator.checkAdminJWT,validator.getEntrateUscite, errorHandler, (req, res) => {
       if (res.status_code == 200){
              responses.successResponseGET(res);
       }
});

//Rotta admin per ottenere lo stato di tutte le imbarcazioni associate alla geofence richiesta
app.get('/getStatoImbarcazioni/:geofence', auth.checkRoleAdmin,validator.checkAdminJWT,validator.getStatoImbarcazioni, errorHandler, (req, res) => {
       if (res.status_code == 200){
              responses.successResponseGET(res);
       }
});
//Rotta admin per ottenere le posizioni di una imbarcazione in un dato intervallo temporale
app.get(['/getPosizioni/:mmsi/:dataInizio/','/getPosizioni/:mmsi/:dataInizio/:dataFine'], auth.checkRoleAdmin,validator.checkAdminJWT,validator.getPosizioni, errorHandler, (req, res) => {
       if (res.status_code == 200){
              responses.successResponseGET(res);
       }
});
//Rotta user per ottenerelo stato di tutte le proprie imbarcazioni associate alla geofence richiesta
app.get('/getStatoImbarcazioniUser/:geofence', auth.checkRoleUser,validator.checkUserJWT,validator.getStatoImbarcazioniUser, errorHandler, (req, res) => {
       if (res.status_code == 200){
              responses.successResponseGET(res);
       }
});
//Rotta user per ottenere tutte le proprie associazioni tramite GET
app.get('/getAssociazioni', auth.checkRoleUser,validator.checkUserJWT,validator.getAssociazioniUser, errorHandler, (req, res) => {
       if (res.status_code == 200){
              responses.successResponseGET(res);
       }
});
//Rotta user per visualizzare il proprio credito tramite GET
app.get('/getCredito', auth.checkRoleUser,validator.checkUserJWT,validator.getCredito, errorHandler, (req, res) => {
       if (res.status_code == 200){
              responses.successResponseGET(res);
       }
});
//Rotta admin o user per ottenere tutte le segnalazioni per le imbarcazioni tramite GET
app.get('/getSegnalazioni', auth.checkRole,validator.checkAdminUserJWT,validator.getSegnalazioni, errorHandler, (req, res) => {
       if (res.status_code == 200){
              responses.successResponseGET(res);
       }
});

//Rotta not found per le richieste HTTP di rotte non esistenti
app.all('*', function(req, res){
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