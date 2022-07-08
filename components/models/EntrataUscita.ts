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
    //true = entrata, false = uscita
    evento:{
        type: DataTypes.BOOLEAN()
    },
    data_evento:{
        type: DataTypes.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP(3)')
    },
}, 
{
    modelName: 'entrate_uscite',
    timestamps: false,
    freezeTableName: true
});

EntrataUscita.belongsTo(Associazioni.Associazione,{
    foreignKey: "id_associazione"
  });

