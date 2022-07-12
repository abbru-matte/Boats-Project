
import * as Imbarcazioni from "../models/Imbarcazione";
import * as Users from "../models/User";
import * as Geofences from "../models/Geofence";
import * as Associazioni from "../models/Associazione";
import * as DatiIstantanei from "../models/DatoIstantaneo";
import * as typesValidator from "../utils/typesValidator"
import * as EntrateUscite from "../models/EntrataUscita";
import * as Segnalazioni from "../models/Segnalazione";
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
            req.credito = check.credito;
            next()
        }
    }catch(error){
        next(error);
    }
};
/**
 * Funzione che verifica che l'utente possieda credito sufficiente per l'invio dei dati
 * @param req richiesta
 * @param res risposta
 * @param next successivo
 */
export async function checkCredito(req,res,next) {
    if (req.credito >= 0.025){
        req.username = req.username;
        next();
    } else {
        let error = new Error(`Non si possiede credito sufficiente per l'invio dei dati istantanei`);
        next(error)
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
                    res.status_code = 201;
                    res.status_message = "Created";
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
                    res.status_code = 201;
                    res.status_message = "Created";
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
                    res.status_code = 201;
                    res.status_message = "Created";
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
 * Funzione che controlla e valida i dati inseriti per la ricarica dell'utente
 * @param res risposta
 * @param next successivo
 */
 export async function checkRicaricaUtente (req:any,res:any,next:any){
    let errorResp:any;
    try{
        if(!typesValidator.validatorDatiRicarica(req.body)){
            errorResp = new Error("Inserire i dati del payload della richiesta in un formato valido")
            res.status_code = 400;
            res.status_message = "Bad Request";
        }
        else{
            errorResp = await Users.validatorRicaricaUtente(req.body.mail);
            if(!(errorResp instanceof Error)){  
                const user = {
                    credito: req.body.credito,
                }
                await Users.User.update(user, {where: { mail:req.body.mail }}).then(()=>{
                    res.message = "Credito aggiornato";
                    res.status_code = 200;
                    res.status_message = "OK";
                    next();
                })           
                   
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

                let dati = await DatiIstantanei.DatoIstantaneo.create(datiIstantanei);
                await Users.scalaCredito(req.username);
                await Associazioni.findAllAssociazioni(datiIstantanei.mmsi).then(async (associazioni)=>{
                    if (associazioni){
                       
                        let geofences = await Associazioni.getGeofences(associazioni);
                    
                        await Associazioni.checkPosizione(associazioni,geofences,datiIstantanei).then(async(eventi:any) =>{
                            for(const evento of eventi){
                                await EntrateUscite.EntrataUscita.create(evento);
                            }
                            /*
                            for (const segnalazione of eventi[1]){
                                await Segnalazioni.Segnalazione.create(segnalazione);
                            }
                            */
                            res.message = "Dati inviati";
                            res.status_code = 201;
                            res.status_message = "Created";
                            res.data = {dati};
                            next();
                        })
                    }    
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
                    res.status_message = "OK";
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
            res.data = {"Elenco_imbarcazioni": imbarcazioni};
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
            res.data = {"Elenco_users": users};
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
            res.data = {"Elenco_geofences": geofences};
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
            res.data = {"Elenco_associazioni": associazioni};
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
 export async function getEntrateUscite(req:any,res:any,next:any) {
    let errorResp:any;
    try{
            await EntrateUscite.EntrataUscita.findAll().then((eventi:any) =>{
            res.message = "Richiesta avvenuta con successo";
            res.status_code = 200;
            res.status_message = "OK";
            res.data = {"Elenco_entrate_uscite": eventi};
            next();
            });
        
        if(errorResp instanceof Error)
            next(errorResp) 
    }catch(error){
        next(error)
    }
};
/**
 * Funzione che restituisce lo stato di tutte le imbarcazioni associate alla geofence richiesta
 * @param req richiesta
 * @param res risposta
 * @param next successivo
 */
 export async function getStatoImbarcazioni(req:any,res:any,next:any) {
    try{
        await Associazioni.getStato(req.params.geofence).then((stato:any) =>{
            res.message = "Richiesta avvenuta con successo";
            res.status_code = 200;
            res.status_message = "OK";
            res.data = {"Stato_imbarcazioni_associate": stato};
            next();
        });     
    }catch(error){
        next(error)
    }
};
/**
 * Funzione che restituisce lo stato di tutte le imbarcazioni possedute dall'utente 
 * e associate alla geofence richiesta
 * @param req richiesta
 * @param res risposta
 * @param next successivo
 */
 export async function getStatoImbarcazioniUser(req:any,res:any,next:any) {
 
    let listaImbarcazioni: string[] = [];
    try{
        await Imbarcazioni.Imbarcazione.findAll({where:{proprietario:req.username},attributes:['mmsi']}).then((listaMmsi:any) =>{
            for(const element of listaMmsi){
                listaImbarcazioni.push(element.mmsi);
            }
            Associazioni.getStatoImbarcazioniUser(req.params.geofence,listaImbarcazioni).then((stato:any) =>{
                res.message = "Richiesta avvenuta con successo";
                res.status_code = 200;
                res.status_message = "OK";
                res.data = {"Elenco_associazioni_utente": stato};
                next();
                });
            });  
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
        await Imbarcazioni.Imbarcazione.findAll({where:{proprietario:req.username},attributes:['mmsi']}).then((listaMmsi:any) =>{
            for(const element of listaMmsi){
                listaImbarcazioni.push(element.mmsi);
            }
            Associazioni.Associazione.findAll({where:{mmsi_imbarcazione:listaImbarcazioni}}).then((associazioni:any) =>{
                res.message = "Richiesta avvenuta con successo";
                res.status_code = 200;
                res.status_message = "OK";
                res.data = {"Elenco_associazioni_utente": associazioni};
                next();
                });
            });  
        if(errorResp instanceof Error)
            next(errorResp) 
    }catch(error){
        next(error)
    }
};
/**
 * Funzione che controlla e valida i dati inseriti per ottenere le posizioni
 * @param req richiesta
 * @param res risposta
 * @param next successivo
 */
 export async function getPosizioni (req:any,res:any,next:any){
    let errorResp:any;
    try{
        req.params.dataInizio = new Date(req.params.dataInizio);
        req.params.mmsi = Number(req.params.mmsi);
        
        if (req.params.dataFine != undefined){
            req.params.dataFine = new Date(req.params.dataFine)
        }
        if(!typesValidator.validatorGetPosizioni(req.params)){
            errorResp = new Error("Inserire i dati della richiesta in un formato valido")
            res.status_code = 400;
            res.status_message = "Bad Request";
        }
        else{   
            errorResp = await Imbarcazioni.validatorMmsiPosizione(req.params);
            if(!(errorResp instanceof Error)){
                await DatiIstantanei.getPosizioniFiltrate(req.params).then((dati:any) =>{
                    res.message = "Richiesta avvenuta con successo";
                    res.status_code = 200;
                    res.status_message = "OK";
                    res.data = {"Elenco_posizioni_imbarcazione": dati};
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
 * Funzione che restituisce il credito dell'utente che fa la richiesta
 * @param req richiesta
 * @param res risposta
 * @param next successivo
 */
 export async function getCredito(req:any,res:any,next:any) {
 
    try{
        await Users.User.findByPk(req.username,{attributes:['credito']}).then((credito:any) =>{
                res.message = "Richiesta avvenuta con successo";
                res.status_code = 200;
                res.status_message = "OK";
                res.data = {"Credito_utente": Number(credito.credito)};
                next();
                });  
    }catch(error){
        next(error)
    }
};
/**
 * Funzione che restituisce lo stato di tutte le imbarcazioni associate alla geofence richiesta
 * @param req richiesta
 * @param res risposta
 * @param next successivo
 */
 export async function getSegnalazioni(req:any,res:any,next:any) {
    try{
        await Segnalazioni.Segnalazione.findAll().then((segnalazioni:any) =>{
            res.message = "Richiesta avvenuta con successo";
            res.status_code = 200;
            res.status_message = "OK";
            res.data = {"Stato_segnalazioni": segnalazioni};
            next();
        });     
    }catch(error){
        next(error)
    }
};