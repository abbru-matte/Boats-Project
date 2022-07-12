import { DatabaseSingleton } from "./singleton/DatabaseSingleton";
import { DataTypes, Sequelize } from 'sequelize';

const sequelize: Sequelize = DatabaseSingleton.getInstance().getConnessione();

/**
 * Oggetto Geofence  per la tabella geofences del DB
 */
 
export const Geofence = sequelize.define('geofences', {
    nome_area: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    geometria: {
        type: DataTypes.GEOMETRY()
    },
    vel_max: {
        type: DataTypes.INTEGER(),
        defaultValue: null
    }
}, 
{
    modelName: 'geofences',
    timestamps: false,
    freezeTableName: true
});
/**
 * Cerca la corrispondenza nella tabella geofences
 * @param nome_area nome della geofence da cercare
 * @returns  Ritorna il risultato della ricerca
 */
 export async function findGeofence(nome_area:string):Promise<any> {
    let result:any;
    try{
        result = await Geofence.findByPk(nome_area,{raw:true});
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
 export async function validatorBodyGeofence(dati:any):Promise<any>{
    const checkGeofence = await findGeofence(dati.nome_area).then((geofence) => { 
        if(geofence) return geofence;
        else return false;
    });

    if(checkGeofence) return new Error(`Esiste già una geofence con nome ${dati.nome_area}` );
    return "Post OK";
}