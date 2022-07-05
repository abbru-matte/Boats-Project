import { DatabaseSingleton } from "./singleton/DatabaseSingleton";
import { DataTypes, Sequelize } from 'sequelize';
import * as Users from "./User";
import * as Geofences from "./Geofence";
import * as Imbarcazioni from "./Imbarcazione";
const sequelize: Sequelize = DatabaseSingleton.getInstance().getConnessione();

/**
 * Oggetto Geofence  per la tabella geofences del DB
 */
 
export const Associazione = sequelize.define('associazioni', {
    id_associazione: {
        type: DataTypes.INTEGER(),
        autoIncrement: true,
        primaryKey: true
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