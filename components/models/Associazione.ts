import { DatabaseSingleton } from "./singleton/DatabaseSingleton";
import { DataTypes, Sequelize } from 'sequelize';
import * as Users from "./User";
import * as Geofences from "./Geofence";
import * as Imbarcazioni from "./Imbarcazione";
import * as d3 from 'd3-geo'
import * as EntrateUscite from "./EntrataUscita";
import { Segnalazione } from "./Segnalazione";
const sequelize: Sequelize = DatabaseSingleton.getInstance().getConnessione();

/**
 * Oggetto Associazione  per la tabella associazioni del DB
 */
 
export const Associazione = sequelize.define('associazioni', {
    id_associazione: {
        type: DataTypes.INTEGER(),
        autoIncrement: true,
        primaryKey: true
    },
    inside:{
        type: DataTypes.BOOLEAN(),
        defaultValue: false
    },
    violazioni_recenti:{
        type: DataTypes.INTEGER(),
        defaultValue: 0
    },
    ultimo_ingresso:{
        type: DataTypes.DATE
    },
    ultima_violazione_ingresso:{
        type: DataTypes.DATE
    },
    ultima_violazione_velocità:{
        type: DataTypes.DATE
    },
    ultima_uscita:{
        type: DataTypes.DATE
    },
}, 
{
    modelName: 'associazioni',
    timestamps: false,
    freezeTableName: true
});

Associazione.belongsTo(Geofences.Geofence,{
    foreignKey: "nome_geofence"
  });
Associazione.belongsTo(Imbarcazioni.Imbarcazione,{
    foreignKey: "mmsi_imbarcazione"
  });
/**
 * Controlla l'esistenza della geofence e dell'imbarcazione 
 * specificate nella richiesta
 * @param associazione contiene i dati dell'associazione da validare
 * @returns Ritorna true se la validazione è andata a buon fine, altrimenti l'errore relativo
 */
export async function validatorBodyAssociazione(associazione:any):Promise<any>{
    const checkGeofence = await Geofences.findGeofence(associazione.nome_geofence).then((geofence) => { 
        if(geofence) return geofence;
        else return false;
    });
    const checkImbarcazione = await Imbarcazioni.findImbarcazione(associazione.mmsi_imbarcazione).then((imbarcazione) => { 
        if(imbarcazione) return imbarcazione;
        else return false;
    });
    const checkPostAssociazione = await findOneAssociazione(associazione.nome_geofence,associazione.mmsi_imbarcazione).then((associazione) => { 
        if(associazione) return associazione;
        else return false;
    });
    if(!checkGeofence) return new Error("Il nome dell'area deve essere una geofence esistente");
    if(!checkImbarcazione) return new Error("L'mmsi deve corrispondere ad una imbarcazione esistente");
    if(checkPostAssociazione) return new Error("L'associazione che si vuole creare è già esistente");
    return true
}
/**
 * Controlla l'esistenza della geofence e dell'imbarcazione 
 * specificate nella richiesta
 * @param associazione contiene i dati dell'associazione da validare
 * @returns Ritorna true se la validazione è andata a buon fine, altrimenti l'errore relativo
 */
 export async function validatorDeleteAssociazione(associazione:any):Promise<any>{
    const checkGeofence = await Geofences.findGeofence(associazione.nome_geofence).then((geofence) => { 
        if(geofence) return geofence;
        else return false;
    });
    const checkImbarcazione = await Imbarcazioni.findImbarcazione(associazione.mmsi_imbarcazione).then((imbarcazione) => { 
        if(imbarcazione) return imbarcazione;
        else return false;
    });
    const checkPostAssociazione = await findOneAssociazione(associazione.nome_geofence,associazione.mmsi_imbarcazione).then((associazione) => { 
        if(associazione) return associazione.id_associazione;
        else return false;
    });
    if(!checkGeofence) return new Error("Il nome dell'area deve essere una geofence esistente");
    if(!checkImbarcazione) return new Error("L'mmsi deve corrispondere ad una imbarcazione esistente");
    if(!checkPostAssociazione) return new Error("L'associazione che si vuole cancellare non esiste");
    return checkPostAssociazione
}
/**
 * Cerca se esiste già un'associazione con entrambi i parametri uguali a quelli del nuovo inserimento
 * @param nome_geofence mmsi dell'imbarcazione da cercare
 * @param mmsi_imbarcazione mmsi dell'imbarcazione da cercare
 * @returns Ritorna il risultato della ricerca
 */
 export async function findOneAssociazione(nome_geofence:string,mmsi_imbarcazione:number):Promise<any> {
    let result:any;
    try{
        result = await Associazione.findOne({ where: { 
                                            nome_geofence: nome_geofence,
                                            mmsi_imbarcazione:mmsi_imbarcazione },raw:true });
    }catch(error){
        console.log(error);
    }
    return result;
};
/**
 * Controlla l'esistenza dell'imbarcazione specificata nella richiesta 
 * e verifica che sia posseduta dall'utente che invia i dati
 * @param dati contiene i dati istantanei da validare
 * @param proprietario è l'utente che fa la richiesta
 * @returns Ritorna true se la validazione è andata a buon fine, altrimenti l'errore relativo
 */
 export async function checkAssociazioni(mmsi):Promise<any>{
    await findAllAssociazioni(mmsi).then((associazioni) => { 
        if(associazioni) {
            return associazioni;
        } else return false;
    });
}
/**
 * Controlla l'esistenza dell'imbarcazione specificata nella richiesta 
 * e verifica che sia posseduta dall'utente che invia i dati
 * @param dati contiene i dati istantanei da validare
 * @param proprietario è l'utente che fa la richiesta
 * @returns Ritorna true se la validazione è andata a buon fine, altrimenti l'errore relativo
 */
 export async function getGeofences(associazioni):Promise<any>{
    let geofences = [];
    for (const associazione of associazioni){
        let geofence = await Geofences.findGeofence(associazione.nome_geofence);
        geofences.push(geofence);
    }
    return geofences;    
}


/**
 * Ritorna tutte le associazioni relative all'imbarcazione passata come parametro
 * @param mmsi_imbarcazione mmsi dell'imbarcazione da cercare
 * @returns Ritorna il risultato della ricerca
 */
 export async function findAllAssociazioni(mmsi_imbarcazione:number):Promise<any> {
    let result:any;
    try{
        result = await Associazione.findAll({ where: { mmsi_imbarcazione:mmsi_imbarcazione } });
    }catch(error){
        console.log(error);
    }
    return result;
};
/**
 * Controlla se l'imbarcazione è entrata o uscita da tutte le geofence associate,
 * in caso positivo registra l'ingresso nella/l'uscita dalla corrispondente geofence
 * @param associazioni associazioni relative all'imbarcazione
 * @param geofences geofences associate all'imbarcazione
 * @param datiIstantanei dati inviati dall'utente
 * @returns Ritorna il risultato della ricerca
 */
 export async function checkPosizione(associazioni:any,geofences:any,datiIstantanei:any):Promise<any> {
    let associazioniAttive = associazioni.filter(associazione => associazione.inside === true);
    let associazioniNonAttive = associazioni.filter(associazione => associazione.inside === false);
    let uscito = {
        inside:false,
        ultima_uscita:Sequelize.literal('CURRENT_TIMESTAMP(3)')
    }
    let entrato = {
        inside:true,
        ultima_violazione_ingresso:Sequelize.literal('CURRENT_TIMESTAMP(3)'),
        ultimo_ingresso:Sequelize.literal('CURRENT_TIMESTAMP(3)'),
        violazioni_recenti:0
    }
    let violazioneVelocità = {
        inside:true,
        ultima_violazione_velocità:Sequelize.literal('CURRENT_TIMESTAMP(3)'),
        violazioni_recenti:0
    }

    let eventi = [];
    let segnalazioni = [];
    for(const associazione of associazioniAttive){
        let geo = geofences.filter(element => element.nome_area === associazione.nome_geofence);
        let check = d3.geoContains(geo[0].geometria,datiIstantanei.posizione.coordinates)
    

        //Se check è false si è usciti dalla geofence
        if (check == false){
            await Associazione.update(uscito, {where: { id_associazione: associazione.id_associazione }});
            const data = {
                evento:"Uscita",
                id_associazione:associazione.id_associazione
            }
            
            let updated:any = await Associazione.findOne({where:{ id_associazione: associazione.id_associazione }})
            let tempo = updated.ultima_uscita.getTime();
                console.log("Data uscita per subject "+tempo);
                setTimeout(async () => {
                    await Associazione.findOne({where:{"id_associazione": updated.id_associazione} }).then(async(associazione:any)=>{
                        console.log("Ultima uscita "+ associazione.ultima_uscita.getTime())
                        if (associazione != null){
                            if (associazione.inside == false && (associazione.ultima_uscita.getTime() == tempo)){
                                let result:any =  await Segnalazione.findOne({where:{"id_associazione": updated.id_associazione,"stato":"IN CORSO"} })
                                if (result){
                                    const segnalazione = {
                                        stato: "RIENTRATA",
                                        data_fine: Sequelize.literal('CURRENT_TIMESTAMP(3)')
                                    }
                                    console.log("Sto aggiornando la segnalazione")
                                    Segnalazione.update(segnalazione,{where:{"id_segnalazione": result.id_segnalazione} });
                                }
                                Associazione.update({violazioni_recenti: 0},{where:{"id_associazione": updated.id_associazione} })
                            }
                        }
                    });
                }, 1000*20);
            eventi.push(data);
        } else {
            //Si è all'interno della geofence, si è superato il limite di velocità
            //ed è passata più di 1h(in ms) dall'ultima volta, aumenta di 1 il numero di violazioni
            if (geo[0].vel_max != null){
                if (Number(datiIstantanei.velocità) >= geo[0].vel_max){
                    if(associazione.ultima_violazione_velocità == null || ((Date.now() + 7200000 - associazione.ultima_violazione_velocità.getTime()) > 0)){
                        violazioneVelocità.violazioni_recenti = associazione.violazioni_recenti + 1;
                    } else {
                        delete(violazioneVelocità.ultima_violazione_velocità);
                        entrato.violazioni_recenti = associazione.violazioni_recenti;
                    }
                    await Associazione.update(violazioneVelocità, {where: { id_associazione: associazione.id_associazione }});
                    if (violazioneVelocità.violazioni_recenti > 5){
                        let exists = await Segnalazione.findOne({where:{'stato':'IN CORSO','id_associazione':associazione.id_associazione}});
                        if (exists == null){
                            const segnalazione = {
                                data_inizio: Sequelize.literal('CURRENT_TIMESTAMP(3)'),
                                stato:"IN CORSO",
                                id_associazione:associazione.id_associazione,
                                mmsi: associazione.mmsi_imbarcazione,
                                nome_geofence: associazione.nome_geofence
                            }
                            await Segnalazione.create(segnalazione);
                        }
                    }
                }
            }
        }
    }
    for(const associazione of associazioniNonAttive){
        
        let geo = geofences.filter(element => element.nome_area === associazione.nome_geofence)
        let check = d3.geoContains(geo[0].geometria,datiIstantanei.posizione.coordinates)
        //Se check è true si è entrati nella geofence
        if (check == true){
            //La violazione conta solo se è passata più di un'ora dalla precedente violazione della stessa geofence
            if(associazione.ultima_violazione_ingresso == null || ((Date.now() + 7200000 - associazione.ultima_violazione_ingresso.getTime()) > 3600000)){
                entrato.violazioni_recenti = associazione.violazioni_recenti + 1;
            } else {
                delete(entrato.ultima_violazione_ingresso);
                entrato.violazioni_recenti = associazione.violazioni_recenti;
            }
            //Se si supera la velocità max della geofence il numero di violazioni aumenta di 
            if (geo[0].vel_max != null){
                if (Number(datiIstantanei.velocità) >= geo[0].vel_max){
                    entrato.violazioni_recenti++;
                }
            }
            await Associazione.update(entrato, {where: { id_associazione: associazione.id_associazione }});
            const data = {
                evento:"Entrata",
                id_associazione:associazione.id_associazione
            }
            if (entrato.violazioni_recenti > 5){
                let exists = await Segnalazione.findOne({where:{'stato':'IN CORSO','id_associazione':associazione.id_associazione}});
                if (exists == null){
                    const segnalazione = {
                        data_inizio: Sequelize.literal('CURRENT_TIMESTAMP(3)'),
                        stato:"IN CORSO",
                        id_associazione:associazione.id_associazione,
                        mmsi: associazione.mmsi_imbarcazione,
                        nome_geofence: associazione.nome_geofence
                    }
                    await Segnalazione.create(segnalazione);
                }
            }
            
            eventi.push(data);
        }
        
    }
    return eventi;
};
/**
 * Restituisce lo stato di tutte le imbarcazioni associate alla geofence
 * @param geofence contiene il nome della geofence di cui restituire lo stato delle imbarcazioni associate
 * @returns Ritorna l'elenco delle imbarcazioni con relativo stato
 */
 export async function getStato(geofence):Promise<any>{
    let associazioni = [];
    let stato = [];
    associazioni = await Associazione.findAll({where:{nome_geofence:geofence}});
    for (let associazione of associazioni){
        if(associazione.inside == true){
            let tempo = (Date.now() + 7200000 - associazione.ultimo_ingresso.getTime());
            let minuti = (tempo / 60000).toFixed(0); 
            associazione.setDataValue('tempo_permanenza_minuti',Number(minuti))
        }
        stato.push(associazione)
    }
    return stato;    
}
/**
 * Restituisce lo stato di tutte le imbarcazioni possedute dall'utente e associate alla geofence.
 * Per le imbarcazioni all'interno si calcola anche il tempo di permanenza in minuti
 * @param geofence contiene il nome della geofence di cui restituire lo stato delle imbarcazioni associate
 * @param listaImbarcazioni contiene le imbarcazioni di cui restituire lo stato
 * @returns Ritorna l'elenco delle imbarcazioni con relativo stato
 */
 export async function getStatoImbarcazioniUser(geofence,listaImbarcazioni):Promise<any>{
    let associazioni = [];
    let stato = [];
    
    associazioni = await Associazione.findAll({where:{mmsi_imbarcazione:listaImbarcazioni,nome_geofence:geofence}});
    for (let associazione of associazioni){
        if(associazione.inside == true){
            let tempo = (Date.now() + 7200000 - associazione.ultimo_ingresso.getTime());
            let minuti = (tempo / 60000).toFixed(0); 
            associazione.setDataValue('tempo_permanenza_minuti',Number(minuti))
        }
        stato.push(associazione)
    }
    return stato;    
}