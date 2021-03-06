import { DatabaseSingleton } from "./singleton/DatabaseSingleton";
import { DataTypes, Sequelize } from 'sequelize';
import * as Users from "./User";
import * as Associazioni from "./Associazione";
import * as Imbarcazioni from "./Imbarcazione";
const sequelize: Sequelize = DatabaseSingleton.getInstance().getConnessione();

/**
 * Oggetto EntrataUscita  per la tabella entrate_uscite del DB
 */
 
export const EntrataUscita = sequelize.define('entrate_uscite', {
    id_evento: {
        type: DataTypes.INTEGER(),
        autoIncrement: true,
        primaryKey: true
    },
    evento:{
        type: DataTypes.STRING()
    },
    data_evento:{
        type: DataTypes.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP(3)')
    },
    mmsi:{
        type: DataTypes.INTEGER()
    },
    nome_geofence:{
        type: DataTypes.STRING()
    },
    id_associazione:{
        type: DataTypes.INTEGER()
    }
}, 
{
    modelName: 'entrate_uscite',
    timestamps: false,
    freezeTableName: true
});



