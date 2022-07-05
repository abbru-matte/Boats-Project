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
        type: DataTypes.INTEGER(),
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
 * Verifica l'esistenza dell'user
 * @param username identificatore del giocatore
 * @returns  il risultato 
 */
export async function findUser(username:string):Promise<any> {
    let check:any;
    try{
        check = await User.findByPk(username,{raw:true});
    }catch(error){
        console.log(error);
    }
    return check;
};

