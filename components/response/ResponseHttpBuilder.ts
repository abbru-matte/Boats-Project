import { ResponseHttp} from './ResponseHttp';
/**
 * Classe che valorizza gli attributi della risposta HTTP e la costruisce
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
    //Status della risposta
    setStatus(status:string){
        this.status = status;
        return this;
    }
    //Messaggio della risposta
    setMessage(messaggio:string){
        this.messaggio = messaggio;
        return this;
    }
    //Si setta lo status code della risposta HTTP
    setStatusCode(status_code:number){
        this.status_code = status_code;
        return this;
    }
    //Ottiene lo status
    getStatus():string{
        return this.status;
    }
    //Ottiene lo status code della risposta
    getStatus_code():number{
        return this.status_code;
    }
    //Ottiene il messaggio della risposta
    getMessage():string{
        return this.messaggio;
    }
    //Ottiene i dati della risposta
    getData():any{
        return this.data;
    }
    //Costruisce la risposta HTTP
    build() {
        return new ResponseHttp(this);
    }
}