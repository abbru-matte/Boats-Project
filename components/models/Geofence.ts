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
