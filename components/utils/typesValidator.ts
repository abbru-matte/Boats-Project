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