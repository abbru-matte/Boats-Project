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
        allowNull:false
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
 * Recupera il credito dell'utente che fa la richiesta e scala i 0.025 token necessari all'invio
 * @param username username dell'utente da cercare
 * @returns  Ritorna il risultato della ricerca
 */
export async function scalaCredito(username:string):Promise<any> {
    let result:any;
    try{
        result = await User.findByPk(username,{raw:true});
        result.credito = result.credito - 0.025;
        await User.update(result, {where: { username: username }})
    }catch(error){
        result.log(error);
    }
    return result;
};

