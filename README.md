# Boats-Project
## Rotte
Di seguito l'elenco delle rotte. Qualsiasi rotta non implementata restituisce l'error 404 NOT FOUND

|Tipo|Rotta|Ruolo|
|:---:|:---:|:---:|
|POST|[/creaImbarcazione](#inserimento-di-una-nuova-imbarcazione-creaimbarcazione)|Admin|
|POST|[/creaGeofence](#inserimento-di-una-nuova-geofence-creageofence)|Admin|
|POST|[/creaAssociazione](#inserimento-di-una-nuova-associazione-creaassociazione)|Admin|
|POST|[/inviaDati](#invio-di-dati-istantanei-inviadati)|User|
|PUT|[/ricaricaUtente](#ricarica-di-un-utente-ricaricautente)|Admin|
|DELETE|[/deleteAssociazione](#rimozione-di-unassociazione-deleteassociazione)|Admin|
|GET|[/getAllImbarcazioni](#visualizzazione-di-tutte-le-imbarcazioni-getallimbarcazioni)|Admin|
|GET|[/getAllGeofences](#visualizzazione-di-tutte-le-geofences-getallgeofences)|Admin|
|GET|[/getAllUsers](#visualizzazione-di-tutte-gli-utenti-getallusers)|Admin|
|GET|[/getAllAssociazioni](#visualizzazione-di-tutte-le-associazioni-getallassociazioni)|Admin|
|GET|[/getEntrateUscite](#visualizzazione-di-tutte-le-entrate-e-uscite-getentrateuscite)|Admin|
|GET|[/getStatoImbarcazioni/:geofence](#visualizzazione-dello-stato-di-tutte-le-imbarcazioni-associate-a-una-geofence-getstatoimbarcazionigeofence)|Admin|
|GET|[/getPosizioni/:mmsi/:dataInizio/:dataFine ](#visualizzazione-delle-posizioni-di-una-imbarcazione-in-un-intervallo-temporale-getposizionimmsidatainiziodatafine)|Admin|
|GET|[/getSegnalazioni](#visualizzazione-di-tutte-le-segnalazioni-getsegnalazioni)|Admin|
|GET|[/getStatoImbarcazioniUser/:geofence ](#visualizzazione-dello-stato-di-tutte-le-imbarcazioni-associate-a-una-geofence-di-un-utente-getstatoimbarcazioniusergeofence)|User|
|GET|[/getAssociazioni](#visualizzazione-di-tutte-le-associazioni-di-imbarcazioni-possedute-da-un-utente-getassociazioni)|User|
|GET|[/getCredito](#visualizzazione-del-credito-di-un-utente-getcredito)|User|

 ### Autenticazione tramite JWT
 Tutte le rotte implementate richiedono che l'utente specifichi un token JWT valido nella richiesta. I token JWT possono essere generati tramite il seguente sito:
[JWT.IO](https://jwt.io/), tramite la chiave *mysupersecretkeyboat*.

Il payload del JWT deve contenere i campi "username" e "ruolo". Questi valori vengono confrontati e validati se corrispondono a quelli presenti nel Database.

Di seguito un JWT valido per l'utente con username admin e ruolo admin
~~~
{
    "username":"admin",
    "ruolo":"admin"
}
~~~
Per quanto riguarda il ruolo "user", un JWT valido sarà del tipo:
~~~
{
    "username":"mario_rossi",
    "ruolo":"user"
}
~~~
 ### Rotte Admin
 Per avere l'autorizzazione a chiamare le rotte admin, c'è bisogno di utilizzare un JWT che abbia specificato come ruolo 'admin'.
 Di seguito verranno descritte in dettaglio tutte le rotte previste per questo ruolo. Verrà dato per scontato il fatto di aver inserito nella richiesta un JWT valido.
 
#### Inserimento di una nuova imbarcazione (/creaImbarcazione)
Questa rotta permette di inserire una nuova imbarcazione.

I dati dell'imbarcazione devono essere inseriti nel body della richiesta in formato JSON con la seguente struttura:

* "mmsi": Identificativo univoco dell'imbarcazione. È costituito da 9 cifre.
* "proprietario": Username del proprietario dell'imbarcazione. Deve esistere nella tabella users.
* "nome_imbarcazione": Nome dell'imbarcazione da inserire.
* "lunghezza": Lunghezza in metri dell'imbarcazione da inserire
* "peso": Peso in kg dell'imbarcazione da inserire

Di seguito un esempio di body della richiesta valido:
~~~
{
    "mmsi": 123456987,
    "proprietario": "mario_rossi",
    "nome_imbarcazione": "Nina",
    "lunghezza": 20,
    "peso": 1000
}
~~~

#### Inserimento di una nuova Geofence (/creaGeofence)
Questa rotta permette di inserire una nuova Geofence Area.

I dati della Geofence devono essere inseriti nel body della richiesta in formato JSON con la seguente struttura:

* "nome_area": Identificativo univoco della Geofence.
* "coordinate": Coordinate della geofence in formato [longitudine,latitudine]. Devono costituire un poligono chiuso. Per questo motivo, la prima coppia di coordinate deve essere uguale all'ultima e devono essere inserite almeno 4 coppie. Il tutto deve essere racchiuso tra parentesi quadre, per rispettare il formato GeoJSON. Nell'inserimento delle coordinate va seguito il verso orario.
* "vel_max": Parametro opzionale che, se specificato, imposta il limite di velocità all'interno della nuova Geofence.

Di seguito un esempio di body della richiesta valido:
~~~
{
    "nome_area": "Magnolia",
    "coordinate": [
                    [ [90.0, 0.0], [90.0, 20.0], [120.0, 20.0],
                    [120.0, 0.0], [90.0, 0.0] ]
                ],
    "vel_max": 50
}
~~~

#### Inserimento di una nuova Associazione (/creaAssociazione)
Questa rotta, di tipo POST, permette di inserire una nuova Associazione tra una Geofence e un'imbarcazione.

I dati della nuova Associazione devono essere inseriti nel body della richiesta in formato JSON con la seguente struttura:

* "nome_geofence": Identificativo univoco della Geofence. Deve esistere nel Database.
* "mmsi_imbarcazione": mmsi: Identificativo univoco dell'imbarcazione. È costituito da 9 cifre. Deve esistere nel Database.

Di seguito un esempio di body della richiesta valido:
~~~
{
    "nome_geofence": "Gotham",
    "mmsi_imbarcazione": 123456798
}
~~~

#### Ricarica di un utente (/ricaricaUtente)
Questa rotta, di tipo PUT, permette di impostare il nuovo credito di un utente identificato tramite mail.

I dati della ricarica devono essere inseriti nel body della richiesta in formato JSON con la seguente struttura:

* "mail": Mail dell'utente a cui ricaricare il credito. Deve corrispondere a un utente esistente.
* "credito": Nuovo credito dell'utente in token.

Di seguito un esempio di body della richiesta valido:
~~~
{
    "mail": "mario@rossi.com",
    "credito": 1100
}
~~~

#### Rimozione di un'associazione (/deleteAssociazione)
Questa rotta, di tipo DELETE, permette di rimuovere un'associazione esistente tra una imbarcazione e una geofence.

I dati della ricarica devono essere inseriti nel body della richiesta in formato JSON con la seguente struttura:

* "nome_geofence": Identificativo univoco della Geofence. Deve esistere nel Database.
* "mmsi_imbarcazione": mmsi: Identificativo univoco dell'imbarcazione. È costituito da 9 cifre. Deve esistere nel Database.

Di seguito un esempio di body della richiesta valido:
~~~
{
    "nome_geofence": "Gotham",
    "mmsi_imbarcazione": 123456789
}
~~~

#### Visualizzazione di tutte le imbarcazioni (/getAllImbarcazioni)
Questa rotta, di tipo GET, permette di visualizzare i metadati di tutte le imbarcazioni presenti nel Database.

### Visualizzazione di tutte le Geofences (/getAllGeofences)
Rotta di tipo GET che permette ad un utente di ruolo admin di visualizzare tutte le geofences presenti nel Database.

### Visualizzazione di tutti gli utenti (/getAllUsers)
Rotta di tipo GET che permette ad un utente di ruolo admin di visualizzare tutti gli utenti presenti nel Database con i loro usernames, ruoli, mail e crediti.

### Visualizzazione di tutte le associazioni (/getAllAssociazioni)
Rotta di tipo GET che permette ad un utente di ruolo admin di visualizzare tutti le associazioni di imbarcazioni e Geofences presenti nel Database.

### Visualizzazione di tutte le entrate e uscite (/getAllEntrateUscite)
Rotta di tipo GET che permette ad un utente di ruolo admin di visualizzare tutti gli eventi di entrata e uscita di ogni associazione registrati nel Database attraverso l'invio di dati istantanei degli utenti.

### Visualizzazione dello stato di tutte le imbarcazioni associate a una Geofence (/getStatoImbarcazioni/:geofence)
Rotta di tipo GET che permette ad un utente di ruolo admin di visualizzare lo stato  di tutte le imbarcazioni in una Geofence prestabilita. Si deve inserire il parametro Geofence. Un esempio di rotta valida è: /getStatoImbarcazioni/gotham

### Visualizzazione delle posizioni di una imbarcazione in un intervallo temporale (/getPosizioni/:mmsi/:dataInizio/:dataFine)
Rotta di tipo GET che permette ad un utente di ruolo admin di visualizzare

### Visualizzazione (/getSegnalazioni)
Rotta di tipo GET che permette ad un utente di ruolo admin di visualizzare

### Visualizzazione (/getStatoImbarcazioniUser/:geofence)

### Visualizzazione (/getAssociazioni)

### Visualizzazione (/getCredito)


## Diagrammi UML

### Diagramma dei casi d'uso

### Diagrammi delle sequenze

### get All Imbarcazioni

```mermaid
sequenceDiagram
autonumber
Client ->> App : /getAllImbarcazioni
App ->> Chain of Responsibility : JWT
Chain of Responsibility ->> Middleware Auth : checkHeader()
Middleware Auth ->> Chain of Responsibility : next()
Chain of Responsibility ->> Middleware Auth : checkToken()
Middleware Auth ->> Chain of Responsibility : next()
Chain of Responsibility ->> Middleware Auth : verifyAndAuthenticate()
Middleware Auth ->> Chain of Responsibility : next()
Chain of Responsibility ->> Middleware Auth : checkRoleAdmin()
Middleware Auth ->> Chain of Responsibility : next()
Chain of Responsibility ->> Middleware Validation : checkAdminJWT()
Middleware Validation ->> Model : findUser()
Model ->> Database : getConnessione()
Database ->> Model : DatabaseSingleton.instance
Model ->> Database : findUser()
Database ->> Model : User
Model ->> Middleware Validation : User
Middleware Validation ->> Chain of Responsibility : next()
Chain of Responsibility ->> Middleware Validation : getAllImbarcazioni()
Middleware Validation ->> Model : Imbarcazione.findAll()
Model ->> Database : Imbarcazione.findAll()
Database ->> Model : imbarcazioni
Model ->> Middleware Validation : imbarcazioni
Middleware Validation ->> Chain of Responsibility : next()
Chain of Responsibility ->> App : response
App ->> ResponseHTTP : successResponseGET(response)
ResponseHTTP ->> Client : res.send(JSONresponse)
```

### post Invio Dati Istantanei

```mermaid
sequenceDiagram
autonumber
Client ->> App : /inviaDati
App ->> Chain of Responsibility : JWT
Chain of Responsibility ->> Middleware Auth : checkHeader()
Middleware Auth ->> Chain of Responsibility : next()
Chain of Responsibility ->> Middleware Auth : checkToken()
Middleware Auth ->> Chain of Responsibility : next()
Chain of Responsibility ->> Middleware Auth : verifyAndAuthenticate()
Middleware Auth ->> Chain of Responsibility : next()
Chain of Responsibility ->> Middleware Auth : checkRoleUser()
Middleware Auth ->> Chain of Responsibility : next()
Chain of Responsibility ->> Middleware Validation : checkUserJWT()
Middleware Validation ->> Model : findUser()
Model ->> Database : getConnessione()
Database ->> Model : DatabaseSingleton.instance
Model ->> Database : findUser()
Database ->> Model : User
Model ->> Middleware Validation : User
Middleware Validation ->> Chain of Responsibility : next()
Chain of Responsibility ->> Middleware Validation : checkCredito()
Middleware Validation ->> Middleware Validation : checkCredito(User)
Middleware Validation ->> Chain of Responsibility : next()
Chain of Responsibility ->> Middleware Validation : checkPostInvioDati()
Middleware Validation ->> Proxy : validaDati()
Proxy ->> Middleware Validation : Dati validati
Middleware Validation ->> Model : validatorBodyDatiIstantanei()
Model ->> Middleware Validation : OK
Middleware Validation ->> Model : DatoIstantaneo.create(Dati validati)
Model ->> Database : create(Dati validati)
Database ->> Model : DatoIstantaneo
Model ->> Middleware Validation : DatoIstantaneo
Middleware Validation ->> Model : scalaCredito()
Model ->> Database : decrement()
Database ->> Model : OK
Model ->> Middleware Validation : OK
Middleware Validation ->> Model : findAllAssociazioni()
Model ->> Database : Associazione.findAll()
Database ->> Model : associazioni
Model ->> Middleware Validation : associazioni
Middleware Validation ->> Model : getGeofences()
Model ->> Database : Geofences.findGeofence
Database ->> Model : geofence
Model ->> Middleware Validation : geofence
Middleware Validation ->> Model : checkPosizione()
Model ->> Model : d3.geoContains()
Model ->> Database : if (entrato): Associazione.update(entrato)
Database ->> Model : OK
Model ->> Database : if (entrato.violazioni_recenti>5 && !exists): Segnalazione.create(segnalazione)
Database ->> Model : Segnalazione
Model ->> Database : if (uscito): Associazione.update(uscito)
Database ->> Model : OK
Model ->> Model : setTimeOut(2 giorni)
Model ->> Middleware Validation : eventi
Middleware Validation ->> Model : EntrataUscita.create(eventi)
Model ->> Database : create(eventi)
Database ->> Model : EntrataUscita
Model ->> Middleware Validation : EntrataUscita
Middleware Validation ->> Chain of Responsibility : next()
Chain of Responsibility ->> App : response
App ->> ResponseHTTP : successResponsePOST(response)
ResponseHTTP ->> Client : res.send(JSONresponse)
```

### put Ricarica Utente

```mermaid
sequenceDiagram
autonumber
Client ->> App : /ricaricaUtente
App ->> Chain of Responsibility : JWT
Chain of Responsibility ->> Middleware Auth : checkHeader()
Middleware Auth ->> Chain of Responsibility : next()
Chain of Responsibility ->> Middleware Auth : checkToken()
Middleware Auth ->> Chain of Responsibility : next()
Chain of Responsibility ->> Middleware Auth : verifyAndAuthenticate()
Middleware Auth ->> Chain of Responsibility : next()
Chain of Responsibility ->> Middleware Auth : checkRoleAdmin()
Middleware Auth ->> Chain of Responsibility : next()
Chain of Responsibility ->> Middleware Validation : checkAdminJWT()
Middleware Validation ->> Model : findUser()
Model ->> Database : getConnessione()
Database ->> Model : DatabaseSingleton.instance
Model ->> Database : findUser()
Database ->> Model : User
Model ->> Middleware Validation : User
Middleware Validation ->> Chain of Responsibility : next()
Chain of Responsibility ->> Middleware Validation : checkRicaricaUtente()
Middleware Validation ->> Proxy : validaDati()
Proxy ->> Middleware Validation : Dati validati
Middleware Validation ->> Model : validatorRicaricaUtente()
Model ->> Database : findUserByMail()
Database ->> Model : utente
Model ->> Middleware Validation : utente
Middleware Validation ->> Model : User.update(credito)
Model ->> Database : update(credito)
Database ->> Model : OK
Model ->> Middleware Validation : OK
Middleware Validation ->> Chain of Responsibility : next()
Chain of Responsibility ->> App : response
App ->> ResponseHTTP : successResponse(response)
ResponseHTTP ->> Client : res.send(JSONresponse)
```

### delete Associazione

```mermaid
sequenceDiagram
autonumber
Client ->> App : /ricaricaUtente
App ->> Chain of Responsibility : JWT
Chain of Responsibility ->> Middleware Auth : checkHeader()
Middleware Auth ->> Chain of Responsibility : next()
Chain of Responsibility ->> Middleware Auth : checkToken()
Middleware Auth ->> Chain of Responsibility : next()
Chain of Responsibility ->> Middleware Auth : verifyAndAuthenticate()
Middleware Auth ->> Chain of Responsibility : next()
Chain of Responsibility ->> Middleware Auth : checkRoleAdmin()
Middleware Auth ->> Chain of Responsibility : next()
Chain of Responsibility ->> Middleware Validation : checkAdminJWT()
Middleware Validation ->> Model : findUser()
Model ->> Database : getConnessione()
Database ->> Model : DatabaseSingleton.instance
Model ->> Database : findUser()
Database ->> Model : User
Model ->> Middleware Validation : User
Middleware Validation ->> Chain of Responsibility : next()
Chain of Responsibility ->> Middleware Validation : checkDeleteAssociazione()
Middleware Validation ->> Proxy : validaDati()
Proxy ->> Middleware Validation : Dati validati
Middleware Validation ->> Model : validatorDeleteAssociazione()
Model ->> Database : Geofences.findGeofence()
Database ->> Model : geofence
Model ->> Database : Imbarcazioni.findImbarcazione()
Database ->> Model : imbarcazione
Model ->> Database : findOneAssociazione()
Database ->> Model : associazione.id_associazione
Model ->> Middleware Validation : id_associazione
Middleware Validation ->> Model : Associazione.destroy(id_associazione)
Model ->> Database : destroy(id_associazione)
Database ->> Model : OK
Model ->> Middleware Validation : OK
Middleware Validation ->> Chain of Responsibility : next()
Chain of Responsibility ->> App : response
App ->> ResponseHTTP : successResponse(response)
ResponseHTTP ->> Client : res.send(JSONresponse)
```
