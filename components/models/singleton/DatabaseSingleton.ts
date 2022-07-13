
require('dotenv').config();
import { Sequelize } from 'sequelize';

/**
 * Permette di assicurarsi di avere una sola connessione al Database
 */
export class DatabaseSingleton {
    private static instance: DatabaseSingleton;
    
    private connessione: Sequelize;

    private constructor() {
		this.connessione = new Sequelize(process.env.PGDATABASE, process.env.PGUSER, process.env.PGPASSWORD, {
			host: process.env.PGHOST,
			port: Number(process.env.PGPORT),
			dialect: 'postgres',
            dialectOptions: {
                dateStrings: true,
                typeCast: true,
                timezone: "+2:00"
              },
            logging:false,
            timezone: "+2:00"
		});
	}

    public static getInstance(): DatabaseSingleton {
        if (!DatabaseSingleton.instance) {
            DatabaseSingleton.instance = new DatabaseSingleton();
        }

        return DatabaseSingleton.instance;
    }
    public getConnessione(){
        return this.connessione;
    }
}