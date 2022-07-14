import { DatabaseSingleton } from "./singleton/DatabaseSingleton";
import { DataTypes, Sequelize } from 'sequelize';

const sequelize: Sequelize = DatabaseSingleton.getInstance().getConnessione();

/**
 *  Oggetto User per la tabella users del DB
 */
 
export const User = sequelize.define('users', {
    username: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    credito: {
        type: DataTypes.DECIMAL(3),
        allowNull:false
    },
    ruolo: {
        type: DataTypes.STRING,
        allowNull:false
    },
    mail: {
        type: DataTypes.STRING,
        allowNull:false,
        validate: {
            isEmail:true
        }
    }
}, 
{
    modelName: 'users',
    timestamps: false,
    freezeTableName: true
});

/**
 * Cerca la corrispondenza nella tabella users
 * @param username username dell'utente da cercare
 * @returns  Ritorna il risultato della ricerca
 */
export async function findUser(username:string):Promise<any> {
    let result:any;
    try{
        result = await User.findByPk(username,{raw:true});
    }catch(error){
        result.log(error);
    }
    return result;
};
/**
 * Scala i 0.025 token necessari all'invio dal credito dell'utente 
 * @param username username dell'utente da cercare
 * @returns  Ritorna il risultato della ricerca
 */
export async function scalaCredito(username:string):Promise<any> {
    try{
        await User.decrement('credito', { by: 0.025,where:{'username':username} })
    }catch(error){
        console.log(error);
    }
    return;
};

/**
 * Controlla l'esistenza dell'utente collegato alla mail specificata nella richiesta 
 * @param mail contiene la mail di cui cercare l'utente collegato
 * @returns Ritorna true se la ricerca è andata a buon fine, altrimenti l'errore relativo
 */
 export async function validatorRicaricaUtente(mail:any):Promise<any>{
    const checkutente = await findUserByMail(mail).then((utente) => { 
        if(utente) return utente;
        else return false;
    });

    if(!checkutente) return new Error("Non è stato trovato nessun utente collegato alla mail specificata nella richiesta");
    return true
}
/**
 * Ritorna l'utente corrispondente alla mail, se esiste
 * @param mail contiene la mail da cercare
 * @returns  Ritorna il risultato dell'operazione
 */
 export async function findUserByMail(mail:any):Promise<any> {
    let result:any;
    try{
        result = await User.findOne({where:{mail:mail}})
    }catch(error){
        result.log(error);
    }
    return result;
};

