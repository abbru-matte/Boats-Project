
import * as Imbarcazioni from "../models/Imbarcazione";
import * as Users from "../models/User";
import * as Geofences from "../models/Geofence";
import * as Associazioni from "../models/Associazione";
import * as DatiIstantanei from "../models/DatoIstantaneo";
import * as typesValidator from "../utils/typesValidator"

const { Op } = require("sequelize");

/**
 * Funzione che verifica che l'username specificato nel payload del token JWT
 * sia presente nel DB con ruolo admin
 * @param req richiesta
 * @param res risposta
 * @param next successivo
 */
 export async function checkAdminJWT(req,res,next) {
    try{ 
        const check = await Users.findUser(req.username).then((user) => { 
            if(user) return user;
            else return false;
        });
        if (!check || check.ruolo !== "admin"){
            let error = new Error(`Non è stato trovato nessun utente con username ${req.username} e ruolo admin`);
            next(error)
        } else {
            next()
        }
    }catch(error){
        next(error);
    }
};
/**
 * Funzione che verifica che l'username specificato nel payload del token JWT
 * sia presente nel DB con ruolo admin
 * @param req richiesta
 * @param res risposta
 * @param next successivo
 */
 export async function checkUserJWT(req,res,next) {
    try{ 
        const check = await Users.findUser(req.username).then((user) => { 
            if(user) return user;
            else return false;
        });
        if (!check || check.ruolo !== "user"){
            let error = new Error(`Non è stato trovato nessun utente con username ${req.username} e ruolo user`);
            next(error)
        } else {
            req.username = check.username;
            next()
        }
    }catch(error){
        next(error);
    }
};

/**
 * Funzione che controlla e valida i dati inseriti per la nuova imbarcazione 
 * @param req richiesta
 * @param res risposta
 * @param next successivo
 */
export async function checkPostNewBoat (req:any,res:any,next:any){
    let errorResp:any;
    try{
        if(!typesValidator.validatorDatiImbarcazione(req.body)){
            errorResp = new Error("Inserire i dati del payload della richiesta in un formato valido")
            res.status_code = 400;
            res.status_message = "Bad Request";
        }
        else{
            errorResp = await Imbarcazioni.validatorBodyImbarcazione(req.body);
            if(!(errorResp instanceof Error)){
                await Imbarcazioni.Imbarcazione.create(req.body).then((imbarcazione:any) =>{
                    res.message = "Imbarcazione creata";
                    res.status_code = 200;
                    res.status_message = "STATUS OK";
                    res.data = {"mmsi":imbarcazione.mmsi};
                    next();
                });
            }
        } 
    }catch(error){
        next(error)
    }
    next(errorResp);
};
/**
 * Funzione che controlla e valida i dati inseriti per la nuova geofence 
 * @param req richiesta
 * @param res risposta
 * @param next successivo
 */
export async function checkPostGeofence (req:any,res:any,next:any){
    let errorResp:any;
    try{
        if(!typesValidator.validatorDatiGeofence(req.body)){
            errorResp = new Error("Inserire i dati del payload della richiesta in un formato valido")
            res.status_code = 400;
            res.status_message = "Bad Request";
        }
        else{
                await Geofences.Geofence.create(req.body).then((geofences:any) =>{
                    res.message = "Geofence creata";
                    res.status_code = 200;
                    res.status_message = "STATUS OK";
                    res.data = {"nome_area":geofences.nome_area};
                    next();
                });
        } 
    }catch(error){
        next(error)
    }
    next(errorResp);
};
/**
 * Funzione che controlla e valida i dati inseriti per la nuova associazione 
 * @param req richiesta
 * @param res risposta
 * @param next successivo
 */
 export async function checkPostAssociazione (req:any,res:any,next:any){
    let errorResp:any;
    try{
        if(!typesValidator.validatorDatiAssociazione(req.body)){
            errorResp = new Error("Inserire i dati del payload della richiesta in un formato valido")
            res.status_code = 400;
            res.status_message = "Bad Request";
        }
        else{
            errorResp = await Associazioni.validatorBodyAssociazione(req.body);
            if(!(errorResp instanceof Error)){
                await Associazioni.Associazione.create(req.body).then((associazione:any) =>{
                    res.message = "Associazione creata";
                    res.status_code = 200;
                    res.status_message = "STATUS OK";
                    res.data = {"id_associazione":associazione.id_associazione,
                                "nome_geofence": associazione.nome_geofence, 
                                "mmsi_imbarcazione": associazione.mmsi_imbarcazione};
                    next();
                });
            }
        } 
    }catch(error){
        next(error)
    }
    next(errorResp);
};
/**
 * Funzione che controlla e valida i dati istantanei inviati dall'utente
 * @param req richiesta
 * @param res risposta
 * @param next successivo
 */
 export async function checkPostInvioDati (req:any,res:any,next:any){
    let errorResp:any;
    try{
        if(!typesValidator.validatorDatiIstantanei(req.body)){
            errorResp = new Error("Inserire i dati del payload della richiesta in un formato valido")
            res.status_code = 400;
            res.status_message = "Bad Request";
        }
        else{
            errorResp = await Imbarcazioni.validatorBodyDatiIstantanei(req.body,req.username);
            if(!(errorResp instanceof Error)){
                let datiIstantanei = req.body;
                datiIstantanei.posizione = {};
                datiIstantanei.posizione.type = "Point";
                datiIstantanei.posizione.coordinates = [req.body.longitudine,req.body.latitudine];
                delete datiIstantanei['latitudine'];
                delete datiIstantanei['longitudine'];
                await DatiIstantanei.DatoIstantaneo.create(datiIstantanei).then((dati:any) =>{
                    res.message = "Dati inviati";
                    res.status_code = 200;
                    res.status_message = "STATUS OK";
                    res.data = {dati};
                    next();
                });
            }
        } 
    }catch(error){
        next(error)
    }
    next(errorResp);
};
/**
 * Funzione che controlla e valida i dati inseriti per la rimozione di un'associazione esistente
 * @param req richiesta
 * @param res risposta
 * @param next successivo
 */
 export async function checkDeleteAssociazione (req:any,res:any,next:any){
    let response:any;
    try{
        if(!typesValidator.validatorDatiAssociazione(req.body)){
            response = new Error("Inserire i dati del payload della richiesta in un formato valido")
            res.status_code = 400;
            res.status_message = "Bad Request";
        }
        else{
            response = await Associazioni.validatorDeleteAssociazione(req.body);
            if(!(response instanceof Error)){
                await Associazioni.Associazione.destroy({ where: { id_associazione: response } }).then(() =>{
                    res.message = "Associazione rimossa";
                    res.status_code = 200;
                    res.status_message = "STATUS OK";
                    res.data = {"id_associazione":response};
                    next();
                });
            }
        } 
    }catch(error){
        next(error)
    }
    next(response);
};
/**
 * Funzione che restituisce tutte le imbarcazioni presenti nel DB
 * @param req richiesta
 * @param res risposta
 * @param next successivo
 */
export async function getAllImbarcazioni(req:any,res:any,next:any) {
    let errorResp:any;
    try{
            await Imbarcazioni.Imbarcazione.findAll().then((imbarcazioni:any) =>{
            res.message = "Richiesta avvenuta con successo";
            res.status_code = 200;
            res.status_message = "OK";
            res.data = {"Elenco imbarcazioni": imbarcazioni};
            next();
            });
        
        if(errorResp instanceof Error)
            next(errorResp) 
    }catch(error){
        next(error)
    }
};
/**
 * Funzione che restituisce tutte gli utenti presenti nel DB
 * @param req richiesta
 * @param res risposta
 * @param next successivo
 */
export async function getAllUsers(req:any,res:any,next:any) {
    let errorResp:any;
    try{
            await Users.User.findAll().then((users:any) =>{
            res.message = "Richiesta avvenuta con successo";
            res.status_code = 200;
            res.status_message = "OK";
            res.data = {"Elenco users": users};
            next();
            });
        
        if(errorResp instanceof Error)
            next(errorResp) 
    }catch(error){
        next(error)
    }
};
/**
 * Funzione che restituisce tutte le geofence presenti nel DB
 * @param req richiesta
 * @param res risposta
 * @param next successivo
 */
export async function getAllGeofences(req:any,res:any,next:any) {
    let errorResp:any;
    try{
            await Geofences.Geofence.findAll().then((geofences:any) =>{
            res.message = "Richiesta avvenuta con successo";
            res.status_code = 200;
            res.status_message = "OK";
            res.data = {"Elenco geofences": geofences};
            next();
            });
        
        if(errorResp instanceof Error)
            next(errorResp) 
    }catch(error){
        next(error)
    }
};
/**
 * Funzione che restituisce tutte le associazioni presenti nel DB
 * @param req richiesta
 * @param res risposta
 * @param next successivo
 */
 export async function getAllAssociazioni(req:any,res:any,next:any) {
    let errorResp:any;
    try{
            await Associazioni.Associazione.findAll().then((associazioni:any) =>{
            res.message = "Richiesta avvenuta con successo";
            res.status_code = 200;
            res.status_message = "OK";
            res.data = {"Elenco associazioni": associazioni};
            next();
            });
        
        if(errorResp instanceof Error)
            next(errorResp) 
    }catch(error){
        next(error)
    }
};
/**
 * Funzione che restituisce tutte le associazioni presenti nel DB 
 * relative ad imbarcazioni possedute dall'utente che fa la richiesta
 * @param req richiesta
 * @param res risposta
 * @param next successivo
 */
 export async function getAssociazioniUser(req:any,res:any,next:any) {
    let errorResp:any;
    let listaImbarcazioni: string[] = [];
    try{
            await Imbarcazioni.Imbarcazione.findAll({where:{proprietario:req.username}}).then((imbarcazioni:any) =>{
                imbarcazioni.forEach(imbarcazione => {
                    listaImbarcazioni.push(imbarcazione.mmsi);
                });
                Associazioni.Associazione.findAll({where:{mmsi_imbarcazione:listaImbarcazioni}}).then((associazioni:any) =>{
                    res.message = "Richiesta avvenuta con successo";
                    res.status_code = 200;
                    res.status_message = "OK";
                    res.data = {"Elenco associazioni utente": associazioni};
                    next();
                    });
                });
            
        
        if(errorResp instanceof Error)
            next(errorResp) 
    }catch(error){
        next(error)
    }
};
