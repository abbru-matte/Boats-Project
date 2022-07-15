CREATE DATABASE boat_db;
\c boat_db
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE TABLE imbarcazioni (
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
  mail  varchar(320) NOT NULL UNIQUE
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
  ultimo_ingresso timestamp, 
  ultima_violazione_ingresso timestamp, 
  ultima_violazione_velocità timestamp, 
  ultima_uscita timestamp, 
   CONSTRAINT fk_nome_geofence
      FOREIGN KEY(nome_geofence) 
	  REFERENCES geofences(nome_area),
    CONSTRAINT fk_mmsi_imbarcazione
      FOREIGN KEY(mmsi_imbarcazione) 
	  REFERENCES imbarcazioni(mmsi)
  );

CREATE TABLE segnalazioni(
  id_segnalazione SERIAL PRIMARY KEY,
  data_inizio timestamp,
  data_fine timestamp,
  stato varchar(50) NOT NULL,
  id_associazione INT NOT NULL,
  mmsi INT NOT NULL,
  nome_geofence varchar(50) NOT NULL
  );

CREATE TABLE entrate_uscite(
  id_evento SERIAL PRIMARY KEY,
  evento varchar(50) NOT NULL,
  data_evento timestamp NOT NULL,
  id_associazione INT NOT NULL,
  mmsi INT NOT NULL,
  nome_geofence varchar(50) NOT NULL
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
	  REFERENCES imbarcazioni(mmsi)
  );
  

  
  
INSERT INTO users (username, credito, ruolo, mail) 
  VALUES 
  ('mario_rossi', 999.875, 'user','mario@rossi.com'), 
  ('luigi_bianchi', 999.95, 'user','luigi@bianchi.com'),
  ('dan_pallini', 1000, 'user','dan@pallini.com'),
  ('mat_abbruzzetti', 999.875, 'user','mat@abbruzzetti.com'),
  ('paolo_verdi', 999.95, 'user','paolo@verdi.com'),
  ('nic_mori', 1000, 'user','nic@mori.com'),
  ('luciano_zito', 1000, 'user','luc@zito.com'),
  ('federica_calabresi', 1000, 'user','fede@calabresi.com'),
  ('michele_colombo', 1000, 'user','mich@colombo.com'),
  ('admin', 0, 'admin','admin@admin.com'),
  ('admin2', 0, 'admin','admin2@admin.com'),
  ('admin3', 0, 'admin','admin3@admin.com');

INSERT INTO imbarcazioni (mmsi, proprietario, nome_imbarcazione, lunghezza,peso,stato) 
  VALUES 
  
  (123456798, 'luigi_bianchi', 'Nina',30,100,'stazionaria'),
  (123456789, 'mario_rossi', 'Blue',20,100,'in navigazione'),
  (423426189, 'mat_abbruzzetti', 'Santa_Maria',12,60,'stazionaria'),
  (153456139, 'dan_pallini', 'Moby_Dick',40,150,'in pesca'),
  (223196184, 'nic_mori', 'Sea_Cloud',25,90,'in navigazione'),
  (113406772, 'paolo_verdi', 'Eos',22,90,'in pesca'),
  (103056280, 'federica_calabresi', 'Athena',15,80,'stazionaria'),
  (133426986, 'mario_rossi', 'Falcon',10,60,'in pesca'),
  (223456080, 'nic_mori', 'Vertigo',18,75,'in navigazione'),
  (527452789, 'luciano_zito', 'Meteor',100,450,'in pesca'),
  (103051787, 'luigi_bianchi', 'Silver',30,95,'in pesca'), 
  (122456725, 'paolo_verdi', 'Muscadet',25,90,'in navigazione'),
  (153453789, 'mat_abbruzzetti', 'Star',24,85,'in navigazione'),
  (173656789, 'federica_calabresi', 'South',14,70,'stazionaria'),
  (180496581, 'nic_mori', 'Gold',120,550,'stazionaria'),
  (199456781, 'paolo_verdi', 'Italia',20,80,'in navigazione'),
  (176756785, 'michele_colombo', 'Spirit',21,65,'stazionaria'),
  (722865089, 'dan_pallini', 'Dehler',20,75,'in pesca'),
  (927821787, 'mario_rossi', 'Grand_Soleil',80,380,'stazionaria'),
  (854124586, 'luciano_zito', 'Tofinou',32,100,'in pesca'),
  (754475510, 'michele_colombo', 'Brenta',28,95,'stazionaria'), 
  (788544118, 'luigi_bianchi', 'Farr',25,90,'in navigazione'),
  (841223325, 'mat_abbruzzetti', 'Marisa',8,40,'in pesca'),
  (121232228, 'luciano_zito', 'Swan',50,300,'stazionaria'),
  (147551142, 'dan_pallini', 'Solaris',9,50,'in pesca'),
  (745215214, 'mario_rossi', 'Balitc',14,80,'in navigazione'),
  (878441259, 'michele_colombo', 'Vismara',16,80,'in pesca'),
  (415289745, 'paolo_verdi', 'Sagittario',24,95,'stazionaria'),
  (127748778, 'nic_mori', 'Catana',12,50,'in navigazione'),
  (745214210, 'federica_calabresi', 'Fila',15,75,'stazionaria'),
  (042588741, 'luciano_zito', 'Octopus',18,90,'in navigazione'), 
  (454785210, 'luigi_bianchi', 'Azzurra',40,250,'in pesca');

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
  ('Derry','{"crs": {
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
('Atlantide', '{"crs": {
                        "type": "name",
                        "properties": {
                            "name": "EPSG:4326"
                        }
                    },
	        "type": "Polygon",
	                "coordinates": [
                [ [50.0, -20.0], [80.0, -20.0], [70.0, -40.0],
                  [50.0, -40.0], [50.0, -20.0] ]
                ]
}',40),
('Metropolis', '{"crs": {
                        "type": "name",
                        "properties": {
                            "name": "EPSG:4326"
                        }
                    },
	        "type": "Polygon",
	                "coordinates": [
                [ [-160.0, 40.0], [-158.45, 85.0], [-120.0, 80.7],
                  [-120.7, 38.22], [-135.85, 2.8], [-160.0, 40.0] ]
                ]
}', NULL),
('Springfield', '{"crs": {
                        "type": "name",
                        "properties": {
                            "name": "EPSG:4326"
                        }
                    },
	        "type": "Polygon",
	                "coordinates": [
                [ [70.0, 10.0], [120.0, 10.0], [120.9, -20.0],
                  [68.5, -21.0], [70.0, 10.0] ]
                ]
}', 100),
('Neptune', '{"crs": {
                        "type": "name",
                        "properties": {
                            "name": "EPSG:4326"
                        }
                    },
	        "type": "Polygon",
	                "coordinates": [
                [ [-20.0, 0.0], [10.0, -1.0], [12.45, -20.8],
                  [-24.78, -20.7], [-20.0, 0.0] ]
                ]
}', 50),
('Midway', '{"crs": {
                        "type": "name",
                        "properties": {
                            "name": "EPSG:4326"
                        }
                    },
	        "type": "Polygon",
	                "coordinates": [
                [ [-10.0, 5.0], [10.0, 5.0], [10.0, -5.0],
                  [-10.0, -5.0], [-10.0, 5.0] ]
                ]
}', 30),
('Westcoast', '{"crs": {
                        "type": "name",
                        "properties": {
                            "name": "EPSG:4326"
                        }
                    },
	        "type": "Polygon",
	                "coordinates": [
                [ [-179.8, 20.0], [-160.0, 20.0], [-157.74, 15.0], [-160.0, -15.0],
                  [-170.0, -10.0], [-179.0, 0.0], [-179.8, 20.0] ]
                ]
}', 50),
('Oltanis', '{"crs": {
                        "type": "name",
                        "properties": {
                            "name": "EPSG:4326"
                        }
                    },
	        "type": "Polygon",
	                "coordinates": [
                [ [120.0, -40.0], [150.0, -40.0], [150.8, -62.0],
                  [119.0, -59.5], [120.0, -40.0] ]
                ]
}', 80),
('Teledo', '{"crs": {
                        "type": "name",
                        "properties": {
                            "name": "EPSG:4326"
                        }
                    },
	        "type": "Polygon",
	                "coordinates": [
                [ [60.2, 80.41], [74.14, 79.23], [75.85, 65.41],
                  [61.04, 62.74], [60.2, 80.41] ]
                ]
}', 45),
('Venice', '{"crs": {
                        "type": "name",
                        "properties": {
                            "name": "EPSG:4326"
                        }
                    },
	        "type": "Polygon",
	                "coordinates": [
                [ [41.0, 7.0], [51.74, 7.07], [50.47, 0.4],
                  [39.88, -0.01], [41.0, 7.0] ]
                ]
}', 40),
('Koros', '{"crs": {
                        "type": "name",
                        "properties": {
                            "name": "EPSG:4326"
                        }
                    },
	        "type": "Polygon",
	                "coordinates": [
                [ [-15.7, -20.41], [-12.4, -20.78], [-12.7, -25.12],
                  [-15.1, -25.06], [-15.7, -20.41] ]
                ]
}', 15),
('Icewall', '{"crs": {
                        "type": "name",
                        "properties": {
                            "name": "EPSG:4326"
                        }
                    },
	        "type": "Polygon",
	                "coordinates": [
                [ [-14.7, 89.7], [15.3, 89.55], [14.99, 76.35],
                  [-14.44, 75.43], [-14.7, 89.7] ]
                ]
}', 35),
('Southland', '{"crs": {
                        "type": "name",
                        "properties": {
                            "name": "EPSG:4326"
                        }
                    },
	        "type": "Polygon",
	                "coordinates": [
                [ [-20.97, 88.98], [18.32, 89.5], [20.02, 72.47],
                  [-19.44, 70.55], [-20.97, 88.98] ]
                ]
}', 55),
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
INSERT INTO associazioni (nome_geofence,inside,mmsi_imbarcazione,violazioni_recenti,ultimo_ingresso,ultima_violazione_ingresso,ultima_violazione_velocità,ultima_uscita) 
  VALUES 
  ('Gotham', 'true', 123456789,6,'2022-07-13T15:24:35+00:00','2022-07-13T15:24:35+00:00','2022-07-13T15:24:35+00:00','2022-07-12T12:14:05+00:00'), 
  ('Marley', 'false',123456798,0,'2022-07-07T19:38:35+00:00','2022-07-07T19:38:35+00:00',NULL,'2022-07-08T15:24:35+00:00'),
  ('Atlantide', 'true',423426189,6,'2022-07-14T15:24:35+00:00','2022-07-14T15:24:35+00:00','2022-07-15T16:04:14+00:00','2022-07-13T11:24:35+00:00'),
  ('Smallville', 'false',153456139,0,NULL,NULL,NULL,NULL),
  ('Derry', 'false',223196184,0,NULL,NULL,NULL,NULL),
  ('Metropolis', 'false',113406772,0,'2022-07-10T15:24:35+00:00','2022-07-10T15:24:35+00:00',NULL,'2022-07-11T22:41:35+00:00'),
  ('Neptune', 'false',103056280,0,NULL,NULL,NULL,NULL),
  ('Venice', 'false',133426986,0,NULL,NULL,NULL,NULL),
  ('Springfield', 'false',223456080,0,NULL,NULL,NULL,NULL),
  ('Teledo', 'false',527452789,0,NULL,NULL,NULL,NULL),
  ('Oltanis', 'false',103051787,0,NULL,NULL,NULL,NULL),
  ('Koros', 'false',122456725,0,NULL,NULL,NULL,NULL),
  ('Westcoast', 'false',153453789,0,NULL,NULL,NULL,NULL),
  ('Icewall', 'true',173656789,0,NULL,NULL,NULL,NULL),
  ('Southland', 'false',180496581,0,NULL,NULL,NULL,NULL),
  ('Midway', 'false',199456781,0,NULL,NULL,NULL,NULL),
  ('Gotham', 'false',176756785,0,NULL,NULL,NULL,NULL),
  ('Smallville', 'false',722865089,0,NULL,NULL,NULL,NULL),
  ('Derry', 'false',927821787,0,NULL,NULL,NULL,NULL),
  ('Midway', 'false',854124586,0,NULL,NULL,NULL,NULL),
  ('Atlantide', 'false',754475510,0,NULL,NULL,NULL,NULL),
  ('Metropolis', 'false',788544118,0,NULL,NULL,NULL,NULL),
  ('Springfield', 'false',841223325,0,NULL,NULL,NULL,NULL),
  ('Neptune', 'false',121232228,0,NULL,NULL,NULL,NULL),
  ('Westcoast', 'false',147551142,0,NULL,NULL,NULL,NULL),
  ('Teledo', 'false',745215214,0,NULL,NULL,NULL,NULL),
  ('Venice', 'false',878441259,0,NULL,NULL,NULL,NULL),
  ('Koros', 'false',415289745,0,NULL,NULL,NULL,NULL),
  ('Icewall', 'false',127748778,0,NULL,NULL,NULL,NULL),
  ('Southland', 'false',745214210,0,NULL,NULL,NULL,NULL),
  ('Marley', 'false',042588741,0,NULL,NULL,NULL,NULL),
  ('Atlantide', 'false',454785210,0,NULL,NULL,NULL,NULL),
  ('Gotham', 'false',180496581,0,NULL,NULL,NULL,NULL),
  ('Metropolis', 'false',841223325,0,NULL,NULL,NULL,NULL),
  ('Metropolis', 'false',123456789,0,NULL,NULL,NULL,NULL),
  ('Smallville', 'false',123456798,0,NULL,NULL,NULL,NULL),
  ('Venice', 'false',127748778,0,NULL,NULL,NULL,NULL),
  ('Neptune', 'false',745215214,0,NULL,NULL,NULL,NULL),
  ('Smallville', 'false',223456080,0,NULL,NULL,NULL,NULL),
  ('Marley', 'false',788544118,0,NULL,NULL,NULL,NULL);
INSERT INTO segnalazioni (data_inizio, data_fine, stato,id_associazione,mmsi,nome_geofence) 
  VALUES 
  ('2022-07-13T15:24:35+00:00', NULL, 'IN CORSO',1,123456789,'Gotham'),
  ('2022-07-15T16:04:14+00:00', NULL, 'IN CORSO',3,423426189,'Atlantide');
INSERT INTO entrate_uscite (evento, data_evento, id_associazione, mmsi, nome_geofence)
  VALUES
  ('Entrata','2022-07-07T19:38:35+00:00',2,123456798,'Marley'),
  ('Uscita','2022-07-08T15:24:35+00:00',2,123456798,'Marley'),
  ('Entrata','2022-07-09T10:38:35+00:00',3,423426189,'Atlantide'),
  ('Entrata','2022-07-10T15:24:35+00:00',6,113406772,'Metropolis'),
  ('Entrata','2022-07-11T15:24:35+00:00',1,123456789,'Gotham'),
  ('Uscita','2022-07-11T22:41:35+00:00',6,113406772,'Metropolis'),
  ('Uscita','2022-07-12T12:14:05+00:00',1,123456789,'Gotham'),
  ('Uscita','2022-07-13T11:24:35+00:00',3,423426189,'Atlantide'),
  ('Entrata','2022-07-13T15:24:35+00:00',1,123456789,'Gotham'),
  ('Entrata','2022-07-14T15:24:35+00:00',3,423426189,'Atlantide');
INSERT INTO dati_istantanei (posizione, stato, velocità, data_invio,mmsi)
  VALUES 
  ('{"crs": {
                        "type": "name",
                        "properties": {
                            "name": "EPSG:4326"
                        }
                    },
	"type": "Point",
	                "coordinates": [-40,-50]
}','in navigazione',40,'2022-07-07T19:38:35+00:00',123456798),
('{"crs": {
                        "type": "name",
                        "properties": {
                            "name": "EPSG:4326"
                        }
                    },
	"type": "Point",
	                "coordinates": [-20,0]
}','in navigazione',50,'2022-07-08T15:24:35+00:00',123456798),
('{"crs": {
                        "type": "name",
                        "properties": {
                            "name": "EPSG:4326"
                        }
                    },
	"type": "Point",
	                "coordinates": [60,-30]
}','in navigazione',50,'2022-07-09T10:38:35+00:00',423426189),
('{"crs": {
                        "type": "name",
                        "properties": {
                            "name": "EPSG:4326"
                        }
                    },
	"type": "Point",
	                "coordinates": [-140,60]
}','in navigazione',70,'2022-07-10T15:24:35+00:00',113406772),
('{"crs": {
                        "type": "name",
                        "properties": {
                            "name": "EPSG:4326"
                        }
                    },
	"type": "Point",
	                "coordinates": [60,-30]
}','in pesca',50,'2022-07-10T11:48:45+00:00',423426189),
('{"crs": {
                        "type": "name",
                        "properties": {
                            "name": "EPSG:4326"
                        }
                    },
	"type": "Point",
	                "coordinates": [10,10]
}','in navigazione',60,'2022-07-11T15:24:35+00:00',123456789),
('{"crs": {
                        "type": "name",
                        "properties": {
                            "name": "EPSG:4326"
                        }
                    },
	"type": "Point",
	                "coordinates": [10,10]
}','in navigazione',60,'2022-07-11T21:44:35+00:00',123456789),
('{"crs": {
                        "type": "name",
                        "properties": {
                            "name": "EPSG:4326"
                        }
                    },
	"type": "Point",
	                "coordinates": [0,85]
}','stazionario',0,'2022-07-11T22:41:35+00:00',113406772),
('{"crs": {
                        "type": "name",
                        "properties": {
                            "name": "EPSG:4326"
                        }
                    },
	"type": "Point",
	                "coordinates": [58,-30]
}','in pesca',50,'2022-07-11T22:48:37+00:00',423426189),
('{"crs": {
                        "type": "name",
                        "properties": {
                            "name": "EPSG:4326"
                        }
                    },
	"type": "Point",
	                "coordinates": [10,10]
}','in pesca',60,'2022-07-12T05:01:00+00:00',123456789),
('{"crs": {
                        "type": "name",
                        "properties": {
                            "name": "EPSG:4326"
                        }
                    },
	"type": "Point",
	                "coordinates": [30,10]
}','in navigazione',60,'2022-07-12T12:14:05+00:00',123456789),
('{"crs": {
                        "type": "name",
                        "properties": {
                            "name": "EPSG:4326"
                        }
                    },
	"type": "Point",
	                "coordinates": [85,-30]
}','in navigazione',50,'2022-07-13T11:24:35+00:00',423426189),
('{"crs": {
                        "type": "name",
                        "properties": {
                            "name": "EPSG:4326"
                        }
                    },
	"type": "Point",
	                "coordinates": [10,10]
}','in pesca',60,'2022-07-13T15:24:35+00:00',123456789),
('{"crs": {
                        "type": "name",
                        "properties": {
                            "name": "EPSG:4326"
                        }
                    },
	"type": "Point",
	                "coordinates": [55,-25]
}','in navigazione',50,'2022-07-14T15:24:35+00:00',423426189);
