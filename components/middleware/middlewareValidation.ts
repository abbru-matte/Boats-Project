
import * as Imbarcazioni from "../models/Imbarcazione";
import * as Users from "../models/User";
import * as Geofences from "../models/Geofence";
import * as Associazioni from "../models/Associazione";
import * as DatiIstantanei from "../models/DatoIstantaneo";
import * as validatorProxy from "../utils/validatorProxy"
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
 * Funzione che verifica che l'username specificato nel payload del token JWT
 * sia presente nel DB con ruolo admin o user
 * @param req richiesta
 * @param res risposta
 * @param next successivo
 */
 export async function checkAdminUserJWT(req,res,next) {
    try{ 
        const check = await Users.findUser(req.username).then((user) => { 
            if(user) return user;
            else return false;
        });
        if (!check || (check.ruolo !== "admin" && check.ruolo!== "user")){
            let error = new Error(`Non è stato trovato nessun utente con username ${req.username} e ruolo admin o user`);
            next(error)
        } else {
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
        let dati = validaDati(req.body);
        //Controlla se sono presenti tutti i dati richiesti, altrimenti lancia un errore
        if (dati.mmsi == undefined || dati.proprietario == undefined || dati.nome_imbarcazione == undefined || 
            dati.lunghezza == undefined || dati.peso == undefined)
        {
            throw new Error("Inserire nella richiesta tutti i campi necessari")
        }
            errorResp = await Imbarcazioni.validatorBodyImbarcazione(dati);
            if(!(errorResp instanceof Error)){
                await Imbarcazioni.Imbarcazione.create(dati).then((imbarcazione:any) =>{
                    res.message = "Imbarcazione creata";
                    res.status_code = 201;
                    res.status_message = "Created";
                    res.data = {"mmsi":imbarcazione.mmsi};
                    let now = new Date().toLocaleString("it-IT", {timeZone: "Europe/Rome"})
                    console.log(`${now}: L'imbarcazione ${imbarcazione.mmsi} è stata aggiunta con successo`)
                    next();
                });
            }
        
    }catch(error){
        res.status_code = 400;
        res.status_message = "Bad Request";
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
        let dati = validaDati(req.body);
         //Controlla se sono presenti tutti i dati richiesti, altrimenti lancia un errore
         if (dati.nome_area == undefined || dati.coordinate == undefined)
        {
            throw new Error("Inserire nella richiesta tutti i campi necessari")
        }
        dati.geometria = {};
        dati.geometria.coordinates = dati.coordinate
        dati.geometria.type = "Polygon";
        
        errorResp = await Geofences.validatorBodyGeofence(dati);
        if(!(errorResp instanceof Error)){
            await Geofences.Geofence.create(dati).then(async(geofence:any) =>{
                res.message = "Geofence creata";
                res.status_code = 201;
                res.status_message = "Created";
                res.data = {"nome_area":geofence.nome_area};
                let now = new Date().toLocaleString("it-IT", {timeZone: "Europe/Rome"})
                console.log(`${now}: La geofence ${geofence.nome_area} è stata aggiunta con successo`)
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
        let dati = validaDati(req.body);
        //Controlla se sono presenti tutti i dati richiesti, altrimenti lancia un errore
        if (dati.nome_geofence == undefined || dati.mmsi_imbarcazione == undefined)
        {
            throw new Error("Inserire nella richiesta tutti i campi necessari")
        }
            errorResp = await Associazioni.validatorBodyAssociazione(dati);
            if(!(errorResp instanceof Error)){
                await Associazioni.Associazione.create(dati).then((associazione:any) =>{
                    res.message = "Associazione creata";
                    res.status_code = 201;
                    res.status_message = "Created";
                    res.data = {"id_associazione":associazione.id_associazione,
                                "nome_geofence": associazione.nome_geofence, 
                                "mmsi_imbarcazione": associazione.mmsi_imbarcazione};
                    let now = new Date().toLocaleString("it-IT", {timeZone: "Europe/Rome"})
                    console.log(`${now}: L'associazione tra la Geofence ${associazione.nome_geofence} `+ 
                                `e l'imbarcazione ${associazione.mmsi_imbarcazione} è stata aggiunta con successo`)
                    next();
                });
            }
    }catch(error){
        res.status_code = 400;
        res.status_message = "Bad Request";
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
        let dati = validaDati(req.body);
        //Controlla se sono presenti tutti i dati richiesti, altrimenti lancia un errore
        if (dati.credito == undefined || dati.mail == undefined){
            throw new Error("Inserire nella richiesta tutti i campi necessari")
        }
        errorResp = await Users.validatorRicaricaUtente(dati.mail);
        if(!(errorResp instanceof Error)){  
            const user = {
                credito: dati.credito,
            }
            await Users.User.update(user, {where: { mail:req.body.mail }}).then(()=>{
                res.message = "Credito aggiornato";
                res.status_code = 200;
                res.status_message = "OK";
                let now = new Date().toLocaleString("it-IT", {timeZone: "Europe/Rome"})
                console.log(`${now}: Il credito dell'utente con mail ${dati.mail} è stato aggiornato a ${dati.credito} con successo`)
                next();
            })           
                
        }
    
    }catch(error){
        res.status_code = 400;
        res.status_message = "Bad Request";
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
    let response:any;
    try{
        let datiIstantanei = validaDati(req.body);
        response = await Imbarcazioni.validatorBodyDatiIstantanei(datiIstantanei,req.username);
        if(!(response instanceof Error)){

            datiIstantanei.posizione = {};
            datiIstantanei.posizione.type = "Point";
            datiIstantanei.posizione.coordinates = [datiIstantanei.longitudine,datiIstantanei.latitudine];
            delete datiIstantanei['latitudine'];
            delete datiIstantanei['longitudine'];

            let dati:any = await DatiIstantanei.DatoIstantaneo.create(datiIstantanei);
            await Users.scalaCredito(req.username);
            await Associazioni.findAllAssociazioni(datiIstantanei.mmsi).then(async (associazioni)=>{
                if (associazioni){
                    let geofences = await Associazioni.getGeofences(associazioni);
                
                    await Associazioni.checkPosizione(associazioni,geofences,datiIstantanei).then(async(eventi:any) =>{
                        for(const evento of eventi){
                            await EntrateUscite.EntrataUscita.create(evento);
                        }
                        dati.velocità = Number(dati.velocità)
                        res.message = "Dati inviati";
                        res.status_code = 201;
                        res.status_message = "Created";
                        res.data = {dati};
                        let now = new Date().toLocaleString("it-IT", {timeZone: "Europe/Rome"})
                        console.log(`${now}: I dati dell'imbarcazione ${datiIstantanei.mmsi} sono stati inviati con successo`)
                        next();
                    })
                }    
            });            
        }
    }catch(error){
        res.status_code = 400;
        res.status_message = "Bad Request";
        next(error)
    }
    next(response);
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
        let dati = validaDati(req.body);
        response = await Associazioni.validatorDeleteAssociazione(dati);
        if(!(response instanceof Error)){
            await Associazioni.Associazione.destroy({ where: { id_associazione: response } }).then(() =>{
                res.message = "Associazione rimossa";
                res.status_code = 200;
                res.status_message = "OK";
                
                let now = new Date().toLocaleString("it-IT", {timeZone: "Europe/Rome"})
                console.log(`${now}: L'associazione tra la Geofence ${dati.nome_geofence} `+ 
                            `e l'imbarcazione ${dati.mmsi_imbarcazione} è stata rimossa con successo`)
                res.data = {"id_associazione":response};
                next();
            });
        }
    }catch(error){
        res.status_code = 400;
        res.status_message = "Bad Request";
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
    try{
            await Imbarcazioni.Imbarcazione.findAll().then((imbarcazioni:any) =>{
            for(const imbarcazione of imbarcazioni){
                imbarcazione.lunghezza = Number(imbarcazione.lunghezza);
                imbarcazione.peso = Number(imbarcazione.peso);
            }
            res.message = "Richiesta avvenuta con successo";
            res.status_code = 200;
            res.status_message = "OK";
            res.data = {"Elenco_imbarcazioni": imbarcazioni};
            next();
            }); 
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
    try{
            await Users.User.findAll().then((users:any) =>{
            res.message = "Richiesta avvenuta con successo";
            res.status_code = 200;
            res.status_message = "OK";
            res.data = {"Elenco_users": users};
            next();
            });
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
    try{
            await Geofences.Geofence.findAll().then((geofences:any) =>{
            res.message = "Richiesta avvenuta con successo";
            res.status_code = 200;
            res.status_message = "OK";
            res.data = {"Elenco_geofences": geofences};
            next();
            });
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
    try{
            await Associazioni.Associazione.findAll().then((associazioni:any) =>{
            res.message = "Richiesta avvenuta con successo";
            res.status_code = 200;
            res.status_message = "OK";
            res.data = {"Elenco_associazioni": associazioni};
            next();
            });
    }catch(error){
        next(error)
    }
};
/**
 * Funzione che restituisce tutte le entrate e le uscite registrate presenti nel DB
 * @param req richiesta
 * @param res risposta
 * @param next successivo
 */
 export async function getEntrateUscite(req:any,res:any,next:any) {
    try{
            await EntrateUscite.EntrataUscita.findAll({attributes:['id_evento','evento','data_evento','mmsi','nome_geofence']})
            .then((eventi:any) =>{
            res.message = "Richiesta avvenuta con successo";
            res.status_code = 200;
            res.status_message = "OK";
            res.data = {"Elenco_entrate_uscite": eventi};
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
    let response:any;
    try{
        req.params.dataInizio = new Date(req.params.dataInizio);
        req.params.mmsi = Number(req.params.mmsi);
        
        if (req.params.dataFine != undefined){
            req.params.dataFine = new Date(req.params.dataFine)
        }
        if(!validatorProxy.validatorGetPosizioni(req.params)){
            response = new Error("Inserire i dati della richiesta in un formato valido")
            res.status_code = 400;
            res.status_message = "Bad Request";
        }
        else{   
            response = await Imbarcazioni.validatorMmsiPosizione(req.params);
            if(!(response instanceof Error)){
                await DatiIstantanei.getPosizioniFiltrate(req.params).then((dati:any) =>{
                    for (const dato of dati){
                        dato.velocità = Number(dato.velocità);
                    }
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
    next(response);
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
        await Segnalazioni.Segnalazione.findAll({attributes:['id_segnalazione','data_inizio','data_fine','stato','mmsi','nome_geofence']})
        .then((segnalazioni:any) =>{
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
/**
 * Funzione che usa un Proxy per validare i parametri inseriti dall'utente in POST
 * @param body contiene il body della richiesta POST da validare
 * @returns 
 */
function validaDati(body:any){
    let dati = new Proxy({}, validatorProxy.validatorProxyHandler);
    for (const key of Object.keys(body)){
        dati[key] = body[key];
    }
    return dati;
}