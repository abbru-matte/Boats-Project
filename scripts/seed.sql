CREATE DATABASE boat_db;
\c boat_db
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE TABLE imbarcazione (
  mmsi INT NOT NULL PRIMARY KEY,
  proprietario varchar(50) NOT NULL, 
  nome_imbarcazione varchar(50) NOT NULL,
  lunghezza decimal(7,2) NOT NULL,
  peso decimal(7,2) NOT NULL,
  stato varchar(20) NOT NULL
);

CREATE TABLE users(
  username varchar(50) NOT NULL PRIMARY KEY,
  credito decimal(7,3) NOT NULL,
  ruolo varchar(50) NOT NULL,
  mail  varchar(320) NOT NULL
);

CREATE TABLE geofences(
  nome_area varchar(50) NOT NULL PRIMARY KEY,
  geometria geometry,
  vel_max INT
);

CREATE TABLE associazioni(
  id_associazione SERIAL PRIMARY KEY,
  nome_geofence varchar(50) NOT NULL,
  mmsi_imbarcazione INT NOT NULL,
  inside boolean,
  violazioni_recenti INT NOT NULL,
  last_update timestamp, 
   CONSTRAINT fk_nome_geofence
      FOREIGN KEY(nome_geofence) 
	  REFERENCES geofences(nome_area),
    CONSTRAINT fk_mmsi_imbarcazione
      FOREIGN KEY(mmsi_imbarcazione) 
	  REFERENCES imbarcazione(mmsi)
  );

CREATE TABLE entrate_uscite(
  id_evento SERIAL PRIMARY KEY,
  evento varchar(50) NOT NULL,
  data_evento timestamp NOT NULL,
  id_associazione INT NOT NULL,
   CONSTRAINT fk_id_associazione
      FOREIGN KEY(id_associazione) 
	  REFERENCES associazioni(id_associazione)
  );

CREATE TABLE dati_istantanei(
  id_invio SERIAL PRIMARY KEY,
  posizione geometry,
  stato varchar(50) NOT NULL,
  velocità decimal(5,2) NOT NULL,
  data_invio timestamp NOT NULL,
  mmsi INT NOT NULL,
   CONSTRAINT fk_mmsi
      FOREIGN KEY(mmsi) 
	  REFERENCES imbarcazione(mmsi)
  );
  

  
  
INSERT INTO users (username, credito, ruolo, mail) 
  VALUES 
  ('mario_rossi', 1000, 'user','mario@rossi.com'), 
  ('luigi_bianchi', 1000, 'user','luigi@bianchi.com'),
  ('dan_pallini', 1000, 'user','dan@pallini.com'),
  ('mat_abbruzzetti', 1000, 'user','mat@abbruzzetti.com'),
  ('paolo_verdi', 1000, 'user','paolo@verdi.com'),
  ('nic_mori', 1000, 'user','nic@mori.com'),
  ('admin', 0, 'admin','admin@admin.com');

INSERT INTO imbarcazione (mmsi, proprietario, nome_imbarcazione, lunghezza,peso,stato) 
  VALUES 
  (123456789, 'mario_rossi', 'Pinta',20,100,'stazionaria'), 
  (123456798, 'luigi_bianchi', 'Nina',30,100,'stazionaria');

  INSERT INTO geofences (nome_area, geometria, vel_max) 
  VALUES 
  ('Gotham', '{"crs": {
                        "type": "name",
                        "properties": {
                            "name": "EPSG:4326"
                        }
                    },
	        "type": "Polygon",
	                "coordinates": [
                [ [0.0, 0.0], [0.0, 20.0], [20.0, 20.0],
                  [20.0, 0.0], [0.0, 0.0] ]
                ]
}', 50), 
  ('Smallville', '{"crs": {
                        "type": "name",
                        "properties": {
                            "name": "EPSG:4326"
                        }
                    },
	"type": "Polygon",
	                "coordinates": [
                [ [50.0, 50.0], [50.0, 80.0], [80.0, 80.0],
                  [80.0, 80.0], [50.0, 50.0] ]
                ]
}', 30),
  ('Paradis','{"crs": {
                        "type": "name",
                        "properties": {
                            "name": "EPSG:4326"
                        }
                    },
	"type": "Polygon",
	                "coordinates": [
                [ [100.0, 0.0], [100.0, 20.0], [120.0, 20.0],
                  [120.0, 0.0], [100.0, 0.0] ]
                ]
}',40),
  ('Marley','{"crs": {
                        "type": "name",
                        "properties": {
                            "name": "EPSG:4326"
                        }
                    },
	"type": "Polygon",
	                "coordinates": [
                [ [-30.0, -30.0], [-30.0, -60.0], [-60.0, -60.0],
                  [-60.0, -30.0], [-30.0, -30.0] ]
                ]
}',20);
INSERT INTO associazioni (nome_geofence,inside,mmsi_imbarcazione,violazioni_recenti,last_update) 
  VALUES 
  ('Gotham', 'true', 123456789,0,'2022-07-05T15:24:35+00:00'), 
  ('Marley', 'false',123456798,0,'2022-07-07T17:35:35+00:00'),
  ('Paradis', 'true',123456789,0,'2022-07-08T15:24:35+00:00'),
  ('Smallville', 'false',123456789,0,'2022-07-04T11:24:35+00:00'),
  ('Marley', 'false',123456789,0,'2022-07-05T13:24:35+00:00');
