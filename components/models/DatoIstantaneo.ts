import { DatabaseSingleton } from "./singleton/DatabaseSingleton";
import { DataTypes, Sequelize } from 'sequelize';
import * as Imbarcazioni from "./Imbarcazione";

const sequelize: Sequelize = DatabaseSingleton.getInstance().getConnessione();

/**
 * Oggetto Geofence  per la tabella geofences del DB
 */
 
export const DatoIstantaneo = sequelize.define('dati_istantanei', {
    id_invio: {
        type: DataTypes.INTEGER(),
        autoIncrement: true,
        primaryKey: true
    },
    posizione: {
        type: DataTypes.GEOMETRY()
    },
    stato: {
        type: DataTypes.STRING()
    },
    velocità: {
        type: DataTypes.DECIMAL(2)
    },
    data_invio:{
        type: DataTypes.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP(3)')
    },
}, 
{
    modelName: 'dati_istantanei',
    timestamps: false,
    freezeTableName: true
});
DatoIstantaneo.belongsTo(Imbarcazioni.Imbarcazione,{
    foreignKey: "mmsi"
  });