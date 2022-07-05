import { DatabaseSingleton } from "./singleton/DatabaseSingleton";
import { DataTypes, Sequelize } from 'sequelize';
import * as User from "./User";


const sequelize: Sequelize = DatabaseSingleton.getInstance().getConnessione();

/**
 *  Oggetto Imbarcazione per la tabella imbarcazioni del DB
 */
export const Imbarcazione = sequelize.define('imbarcazione', 
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
 * Funzione asincrona che controlla l'esistenza del proprietario 
 * dell'imbarcazione specificato nella richiesta
 * @param imbarcazione contiene i dati dell'imbarcazione da validare
 * @returns True se la validazione è andata a buon fine, in caso contrario un oggetto Error
 * 
 */

export async function validatorBodyImbarcazione(imbarcazione:any):Promise<any>{
    const check = await User.findUser(imbarcazione.proprietario).then((user) => { 
        if(user) return user;
        else return false;
    });
    if(!check) return new Error("Il proprietario dell'imbarcazione deve essere un utente esistente");
    return true
}
