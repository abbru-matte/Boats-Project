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
        type: DataTypes.GEOMETRY(),
        primaryKey: true,
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
