/**
 * Funzione che ha il ruolo di handler del Proxy usato per la validazione dell'input
 */
export let validatorProxyHandler = {
    set(obj, prop, value) {
      switch(prop){
        case 'mail':
          if (typeof value != "string") {
            throw new TypeError('Il campo mail deve essere una stringa');
          }
          if (!validateEmail(value)) {
            throw new Error('Il formato della mail inserita non è valido');
          }
          break;
        case 'credito':
          if (isNaN(value)) {
            throw new TypeError('Inserire un valore numerico per il credito');
          }
          if (value <= 0) {
              throw new Error('Il credito deve essere maggiore di 0');
          }
          break;
        case 'stato':
          if (typeof value != "string") {
            throw new TypeError('Il campo stato deve essere una stringa');
          }
          if ((value != 'in navigazione' && value != 'in pesca' && value != 'stazionaria')) {
            throw new Error("Lo stato dell'imbarcazione può essere esclusivamente uno tra 'in navigazione','in pesca' e ' stazionaria'");
          }
          break;
        case 'nome_imbarcazione':
          if (typeof value != "string") {
            throw new TypeError("Il campo nome_imbarcazione deve essere una stringa");
          }
          break;
        case 'proprietario':
        if (typeof value != "string") {
          throw new TypeError("Il campo proprietario deve essere una stringa");
        }
        break;    
        case 'mmsi':
          if (!(Number.isInteger(value)) || value<=0 || value.toString().length != 9) {
            throw new TypeError("L'mmsi deve essere un numero intero positivo  di 9 cifre");
          }
          break;
        case 'lunghezza':
          if (isNaN(value)) {
            throw new TypeError('Inserire un valore numerico per la lunghezza');
          }
          if (value <= 0) {
              throw new Error('La lunghezza deve essere maggiore di 0');
          }
          break;
        case 'peso':
          if (isNaN(value)) {
            throw new TypeError('Inserire un valore numerico per il peso');
          }
          if (value <= 0) {
              throw new Error('Il peso deve essere maggiore di 0');
          }
          break;
        case 'nome_area':
          if (typeof value != "string") {
            throw new TypeError("Il campo nome_area deve essere una stringa");
          }
          break;
        case 'vel_max':
          if (!(Number.isInteger(value))) {
            throw new TypeError('Inserire un valore numerico intero per la velocità massima');
          }
          if (value <= 0) {
              throw new Error('La velocità deve essere maggiore di 0');
          }
          break;
        case 'nome_geofence':
          if (typeof value != "string") {
            throw new TypeError("Il campo nome_geofence deve essere una stringa");
          }
          break;
        case 'mmsi_imbarcazione':
          if (!(Number.isInteger(value)) || value<=0 || value.toString().length != 9) {
            throw new Error("L'mmsi deve essere un numero intero positivo  di 9 cifre");
          }
          break;
        case 'latitudine':
          if (isNaN(value)) {
            throw new TypeError('Inserire un valore numerico per la latitudine');
          }
          if (value < -90 || value > 90){
            throw new RangeError('La latitudine deve essere compresa tra -90 e 90');
          }
          break;      
        case 'longitudine':
          if (isNaN(value)) {
            throw new TypeError('Inserire un valore numerico per la longitudine');
          }
          if (value < -180 || value > 180){
            throw new RangeError('La longitudine deve essere compresa tra -180 e 180');
          }
          break;
        case 'velocità':
          if (isNaN(value)) {
            throw new TypeError('Inserire un valore numerico per la velocità');
          }
          if (value <= 0 || value >=1000) {
              throw new RangeError('La velocità deve essere maggiore di 0 e inferiore a 1000');
          }
          break;
        case 'coordinate':
          let coordinate = value[0];
          let count = 1;
          let start = 0;
          if (coordinate.length < 4){
              throw new TypeError('Inserire almeno 4 diverse coordinate per costruire il poligono');
          }
          for (const coordinata of coordinate){
              if (isNaN(coordinata[0]) || isNaN(coordinata[1])) {
                  throw new TypeError('Inserire un valore numerico per longitudine e latitudine');
                }
              if (coordinata[0] < -180 || coordinata[0] > 180){
                  throw new RangeError('La longitudine deve essere compresa tra -180 e 180')
              }
              if (coordinata[1] < -90 || coordinata[1] > 90){
                  throw new RangeError('La latitudine deve essere compresa tra -90 e 90')
              }
              if (count == 1){
                  start = coordinata;
              }
              if (count == coordinate.length){
                  if (start[0] != coordinata[0] || start[1] != coordinata[1])
                  throw new Error("La prima e l'ultima coordinata inserite devono essere uguali")
              }
              count++;
            }
          break;                 
      }
  
      // The default behavior to store the value
      obj[prop] = value;
  
      // Indicate success
      return true;
    }
  };
  /**
   * Funzione per controllare che la stringa inserita rispetti il formato email
   * @param email stringa da validare
   * @returns True se il formato corrisponde a un'email, false altrimenti
   */
function validateEmail(email) 
    {
        var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    /**
     * Funzione che verifica che i filtri temporali inseriti dall'utente siano validi
     * @param dati filtri
     * @returns True se la validazione va a buon fine, false altrimenti
     */
export const validatorGetPosizioni = (dati:any):boolean => {
  if (dati.dataFine != undefined){
      return (Number.isInteger(dati.mmsi) && dati.mmsi>0 && dati.mmsi.toString().length == 9 &&
      (dati.dataInizio instanceof Date && !isNaN(dati.dataInizio)) &&
      (dati.dataFine instanceof Date && !isNaN(dati.dataFine)) &&
      (dati.dataInizio.getTime() < dati.dataFine.getTime()) && 
      dati.dataFine.getTime() <= Date.now())
  } else {
      return (Number.isInteger(dati.mmsi) && dati.mmsi>0 && dati.mmsi.toString().length == 9 &&
      (dati.dataInizio instanceof Date && !isNaN(dati.dataInizio) && dati.dataInizio.getTime() <= Date.now()))
  }
};