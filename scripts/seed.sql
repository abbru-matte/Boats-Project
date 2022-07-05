CREATE DATABASE boat_db;
\c boat_db
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE TABLE imbarcazione (
  mmsi INT NOT NULL,
  proprietario varchar(50) NOT NULL, 
  nome_imbarcazione varchar(50) NOT NULL,
  lunghezza decimal(5,2) NOT NULL,
  peso decimal(5,2) NOT NULL,
  stato varchar(20) NOT NULL
);

CREATE TABLE users(
  username varchar(50) NOT NULL,
  credito INT NOT NULL,
  ruolo varchar(50) NOT NULL,
  mail  varchar(320) NOT NULL
);

CREATE TABLE geofences(
  nome_area varchar(50) NOT NULL,
  geometria geometry,
  vel_max INT
);

ALTER TABLE imbarcazione
  ADD PRIMARY KEY (mmsi);

ALTER TABLE users
  ADD PRIMARY KEY (username);

ALTER TABLE geofences
  ADD PRIMARY KEY (nome_area);

CREATE TABLE associazioni(
  id_associazione SERIAL,
  nome_geofence varchar(50) NOT NULL,
  mmsi_imbarcazione INT NOT NULL,
   CONSTRAINT fk_nome_geofence
      FOREIGN KEY(nome_geofence) 
	  REFERENCES geofences(nome_area),
    CONSTRAINT fk_mmsi_imbarcazione
      FOREIGN KEY(mmsi_imbarcazione) 
	  REFERENCES imbarcazione(mmsi)
  );

  ALTER TABLE associazioni
  ADD PRIMARY KEY (id_associazione);
  
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
	        "type": "Point",
	        "coordinates": [-76.984722, 39.807222]
}', 50), 
  ('Smallville', '{"crs": {
                        "type": "name",
                        "properties": {
                            "name": "EPSG:4326"
                        }
                    },
	"type": "Point",
	"coordinates": [-76.984722, 39.807222]
}', 30),
  ('Paradis','{"crs": {
                        "type": "name",
                        "properties": {
                            "name": "EPSG:4326"
                        }
                    },
	"type": "Point",
	"coordinates": [-76.984722, 39.807222]
}',40),
  ('Marley','{"crs": {
                        "type": "name",
                        "properties": {
                            "name": "EPSG:4326"
                        }
                    },
	"type": "Point",
	"coordinates": [-76.984722, 39.807222]
}',20);
INSERT INTO associazioni (nome_geofence,mmsi_imbarcazione) 
  VALUES 
  ('Gotham', 123456789), 
  ('Marley', 123456798);
