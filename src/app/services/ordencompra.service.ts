import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Bodegas } from '../models/bodegas';
import { OrdenCompra } from '../models/ordencompra';
import { AlertasService } from './alertas.service';

@Injectable({
  providedIn: 'root'
})
export class OrdenCompraService {
ultimaOrdenCompra:OrdenCompra = null;
  constructor(
    private http: HttpClient,
    public alertasService:AlertasService
  ) { }


getURL(api){

let test : string = '';

if(!environment.prdMode){

test = environment.TestURL;

}

const URL = environment.preURL + test + environment.postURL + api;

return URL;
  
}
 
private getUltimaOrdenCompra(){
  const URL = this.getURL(environment.ultimaOrdenCompraURL);
  console.log('URL', URL)
  return this.http.get<OrdenCompra[]>(URL)


}

syncUltimaOrdenCompra(){

this.alertasService.presentaLoading('Cargando datos...')
  this.getUltimaOrdenCompra().subscribe(

    resp => {

this.ultimaOrdenCompra = resp[0];
console.log('this.ultimaOrdenCompra', this.ultimaOrdenCompra)

this.alertasService.loadingDissmiss();
    }, error =>{


      this.alertasService.loadingDissmiss();

    }
  )
}
}