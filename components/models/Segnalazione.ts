import { DatabaseSingleton } from "./singleton/DatabaseSingleton";
import { DataTypes, Sequelize } from 'sequelize';
import * as Users from "./User";
import * as Geofences from "./Geofence";
import * as Imbarcazioni from "./Imbarcazione";
import * as Associazioni from "./Associazione";
import * as d3 from 'd3-geo'
import * as EntrateUscite from "./EntrataUscita";
const sequelize: Sequelize = DatabaseSingleton.getInstance().getConnessione();

/**
 * Oggetto Segnalazione  per la tabella segnalazioni del DB
 */
 
export const Segnalazione = sequelize.define('segnalazioni', {
    id_segnalazione: {
        type: DataTypes.INTEGER(),
        autoIncrement: true,
        primaryKey: true
    },
    data_inizio:{
        type: DataTypes.DATE
    },
    data_fine:{
        type: DataTypes.DATE
    },
    stato: {
        type: DataTypes.STRING,
        validate:{
            isIn: [['IN CORSO', 'RIENTRATA']],
        }
    },
    id_associazione: {
        type: DataTypes.INTEGER
    }

}, 
{
    modelName: 'segnalazioni',
    timestamps: false,
    freezeTableName: true
});



