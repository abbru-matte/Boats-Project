export const validatorDatiImbarcazione = (imbarcazione:any):boolean => {
 
    return (typeof imbarcazione.nome_imbarcazione == "string" &&
    typeof imbarcazione.proprietario == "string" &&
    (Number.isInteger(imbarcazione.mmsi) && imbarcazione.mmsi>0 ) &&
    (!isNaN(parseFloat(imbarcazione.lunghezza)) && imbarcazione.lunghezza>0 ) &&
    (!isNaN(parseFloat(imbarcazione.peso)) && imbarcazione.peso>0 ))
  
};

export const validatorDatiGeofence = (geofence:any):boolean => {
    if(typeof geofence.vel_max !== 'undefined'){
        return (typeof geofence.nome_area == "string" &&
        typeof geofence.geometria.type == "string" && 
        geofence.geometria.type === "Polygon" &&
        (Number.isInteger(geofence.vel_max) && geofence.vel_max>0 )) 
    } else {
        return (typeof geofence.nome_area == "string" &&
        typeof geofence.geometria.type == "string" && 
        geofence.geometria.type === "Polygon"  )
      }   
};

export const validatorDatiAssociazione = (associazione:any):boolean => {
 
    return (typeof associazione.nome_geofence == "string" &&
    (Number.isInteger(associazione.mmsi_imbarcazione) && associazione.mmsi_imbarcazione>0 ))
  
};

export const validatorDatiIstantanei = (dati:any):boolean => {
 
    return (typeof dati.stato == "string" && (dati.stato == "in navigazione" ||  dati.stato == "in pesca" ||  dati.stato == "stazionaria") &&
    (Number.isInteger(dati.mmsi) && dati.mmsi>0 && dati.mmsi.toString().length == 9) &&
    (!isNaN(parseFloat(dati.latitudine)) && dati.latitudine>-90 && dati.latitudine<90 ) &&
    (!isNaN(parseFloat(dati.longitudine)) && dati.longitudine>-180 && dati.longitudine<180 ) && 
    (!isNaN(parseFloat(dati.velocità)) && dati.velocità>0 ))
  
};

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