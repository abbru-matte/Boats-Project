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

  /**
 * Restituisce le posizioni dell'imbarcazione richiesta che rispettano i filtri temporali
 * @param filtri contiene i filtri temporali e l'mmsi dell'imbarcazione
 * @returns Ritorna l'elenco delle posizioni dell'imbarcazione che rispettano i filtri temporali
 */
 export async function getPosizioniFiltrate(filtri):Promise<any>{
    let datiIstantanei = [];

    datiIstantanei = await DatoIstantaneo.findAll({where:{mmsi:Number(filtri.mmsi)},attributes:['posizione','stato','velocità','data_invio','mmsi']});
    let dataInizio = filtri.dataInizio.getTime();
    if (filtri.dataFine != undefined){
        let dataFine = filtri.dataFine.getTime() + (86400 * 1000); // per considerare le posizioni fino alle 23:59
        datiIstantanei = datiIstantanei.filter(dato => (dato.data_invio.getTime() >= dataInizio
        && dato.data_invio.getTime() <= dataFine))
    } else {
        datiIstantanei = datiIstantanei.filter(dato => (dato.data_invio.getTime() >= dataInizio))
    }
    return datiIstantanei;    
}