import { DatabaseSingleton } from "./singleton/DatabaseSingleton";
import { DataTypes, Sequelize } from 'sequelize';
import * as User from "./User";


const sequelize: Sequelize = DatabaseSingleton.getInstance().getConnessione();

/**
 *  Oggetto Imbarcazione per la tabella imbarcazioni del DB
 */
export const Imbarcazione = sequelize.define('imbarcazioni', 
{
    mmsi: {
        type: DataTypes.INTEGER(),
        primaryKey: true,
    },
    proprietario: {
        type: DataTypes.STRING(),
        allowNull: false 
    }, 
    nome_imbarcazione: {
        type: DataTypes.STRING(),
        allowNull: false 
    },
    stato: {
        type: DataTypes.STRING(),
        defaultValue: "stazionaria",
        allowNull: false
    },
    lunghezza: {
        type: DataTypes.DECIMAL(2),
        allowNull: false,
    },
    peso: {
        type: DataTypes.DECIMAL(2),
        allowNull: false
    },
},
{
    modelName: 'imbarcazione',
    timestamps: false,
    freezeTableName: true
});

/**
 * Controlla l'esistenza del proprietario dell'imbarcazione specificato nella richiesta
 * @param imbarcazione contiene i dati dell'imbarcazione da validare
 * @returns Ritorna true se la validazione è andata a buon fine, altrimenti l'errore relativo
 */

export async function validatorBodyImbarcazione(imbarcazione:any):Promise<any>{
    const checkUser = await User.findUser(imbarcazione.proprietario).then((user) => { 
        if(user) return user;
        else return false;
    });
    const checkImbarcazione = await findImbarcazione(imbarcazione.mmsi).then((imbarcazione) => { 
        if(imbarcazione) return imbarcazione;
        else return false;
    });
    if(!checkUser) return new Error("Il proprietario dell'imbarcazione deve essere un utente esistente");
    if (checkImbarcazione) return new Error(`Esiste già un'imbarcazione con mmsi ${imbarcazione.mmsi}`)
    return "Post OK";
}
/**
 * Controlla l'esistenza dell'imbarcazione specificata nella richiesta 
 * e verifica che sia posseduta dall'utente che invia i dati
 * @param dati contiene i dati istantanei da validare
 * @param proprietario è l'utente che fa la richiesta
 * @returns Ritorna true se la validazione è andata a buon fine, altrimenti l'errore relativo
 */
export async function validatorBodyDatiIstantanei(dati:any,proprietario:string):Promise<any>{
    const checkImbarcazione = await findImbarcazione(dati.mmsi).then((imbarcazione) => { 
        if(imbarcazione && imbarcazione.proprietario === proprietario) return imbarcazione;
        else return false;
    });

    if(!checkImbarcazione) return new Error("L'mmsi deve corrispondere ad una imbarcazione esistente e posseduta");
    return "Post OK";
}
/**
 * Controlla l'esistenza dell'imbarcazione specificata nella richiesta 
 * @param dati contiene i dati istantanei da validare
 * @param proprietario è l'utente che fa la richiesta
 * @returns Ritorna true se la validazione è andata a buon fine, altrimenti l'errore relativo
 */
 export async function validatorMmsiPosizione(dati:any):Promise<any>{
    const checkImbarcazione = await findImbarcazione(dati.mmsi).then((imbarcazione) => { 
        if(imbarcazione) return imbarcazione;
        else return false;
    });

    if(!checkImbarcazione) return new Error("L'mmsi deve corrispondere ad una imbarcazione esistente");
    return "Get OK";
}
/**
 * Cerca la corrispondenza dell'mmsi nella tabella imbarcazioni
 * @param mmsi mmsi dell'imbarcazione da cercare
 * @returns Ritorna il risultato della ricerca
 */
 export async function findImbarcazione(mmsi:string):Promise<any> {
    let result:any;
    try{
        result = await Imbarcazione.findByPk(mmsi,{raw:true});
    }catch(error){
        console.log(error);
    }
    return result;
};