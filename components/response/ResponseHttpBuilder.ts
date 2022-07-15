import { ResponseHttp} from './ResponseHttp';
/**
 * Classe che va a valorizzare gli attributi della risposta HTTP e a costruirla
 */
export class ResponseHttpBuilder{
    private status:string;
    private status_code:number;
    private messaggio:string;
    private data:any;

    constructor(){}
    //Dati da inserire nella risposta
    setData(data:any){
        this.data = data;
        return this;
    }
    //Imposta lo status della risposta
    setStatus(status:string){
        this.status = status;
        return this;
    }
    //Imposta il messaggio della risposta
    setMessage(messaggio:string){
        this.messaggio = messaggio;
        return this;
    }
    //Imposta lo Status code della risposta HTTP
    setStatusCode(status_code:number){
        this.status_code = status_code;
        return this;
    }
    //Restituisce lo status
    getStatus():string{
        return this.status;
    }
    //Restituisce lo status code della risposta
    getStatus_code():number{
        return this.status_code;
    }
    //Restituisce il messaggio della risposta
    getMessage():string{
        return this.messaggio;
    }
    //Restituisce i dati della risposta
    getData():any{
        return this.data;
    }
    //Costruisce la risposta HTTP
    build() {
        return new ResponseHttp(this);
    }
}