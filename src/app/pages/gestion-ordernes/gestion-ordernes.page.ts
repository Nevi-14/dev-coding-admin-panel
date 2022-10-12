import {  ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {  MenuController, ModalController, PopoverController, AlertController } from '@ionic/angular';
import { Proveedores } from 'src/app/models/proveedores';
import { ArticulosService } from 'src/app/services/articulos.service';
import { ProveedoresService } from 'src/app/services/proveedores.service';
import { ListaProveedoresPage } from '../lista-proveedores/lista-proveedores.page';
import { ListaArticulosPage } from '../lista-articulos/lista-articulos.page';
import { Articulos } from 'src/app/models/articulos';
import { ListaBodegasPage } from '../lista-bodegas/lista-bodegas.page';
import { OrdenCompraService } from '../../services/ordencompra.service';
import { OrdenCompra } from 'src/app/models/ordencompra';
import { Bodegas } from 'src/app/models/bodegas';
import { Lineas } from 'src/app/models/lineas';
import { AlertasService } from 'src/app/services/alertas.service';
import { CalendarioPopoverPage } from '../calendario-popover/calendario-popover.page';
import { LineasService } from 'src/app/services/lineas.service';
import { OrdenesDeCompraPage } from '../ordenes-de-compra/ordenes-de-compra.page';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { BodegasService } from 'src/app/services/bodegas.service';
import { ONEOCAprob } from 'src/app/models/ONEOCAprob';
import { PdfService } from 'src/app/services/pdf.service';
import { LocalizacionService } from '../../services/localizacion.service';
import { EmailService } from 'src/app/services/email.service';
import { GestionOrdenesService } from '../../services/gestion-ordenes.service';
import { GestorArchivosPage } from '../gestor-archivos/gestor-archivos.page';
import { GestorArchivosService } from 'src/app/services/gestor-archivos.service';

@Component({
  selector: 'app-gestion-ordernes',
  templateUrl: './gestion-ordernes.page.html',
  styleUrls: ['./gestion-ordernes.page.scss'],
})
export class GestionOrdernesPage implements OnInit {

  actualizar = false;

  fecha: Date = new Date();
  date = this.fecha.getDate();
  month = this.fecha.getMonth();
  year = this.fecha.getFullYear();
  formatoFecha = new Date().toJSON().slice(0, 10).replace(/[/]/g,'-')+'T00:00:00';
  image = '../assets/islena.png';
  box = '../assets/supply-chain.svg';
  textoBuscar = '';
  articulos:Articulos[]=[];
  modeOn = false;
  aprobadoresActuales:ONEOCAprob[]=[]
  
    constructor(
      public modalCtrl: ModalController,
      public proveedoresService:ProveedoresService,
      public articulosService: ArticulosService,
      public route: Router,
      public ordenCompraService: OrdenCompraService,
      public alertasService: AlertasService,
      public popOverCtrl: PopoverController,
      public lineasService: LineasService,
      public usuariosService:UsuariosService,
      public menu: MenuController,
      public bodegasService: BodegasService,
      public alertCTrl: AlertController,
      public pdfSErvice:PdfService,
      public localizationService: LocalizacionService,
      public emailService:EmailService,
      public gestionOrdenesService: GestionOrdenesService,
      private cd: ChangeDetectorRef,
      public gestorArchivosService: GestorArchivosService
    ) { }
  
    ngOnInit() {


  //alert(this.gestionOrdenesService.ordenCompra.ESTADO == 'A')
    }
    openCustom() {
      this.menu.enable(true, 'custom');
      this.menu.open('custom');
    }
    ionViewWillEnter(){
      this.limpiarDatos();
    }
  
    limpiarDatos(){
      this.usuariosService.syncGetONEUserAprob();
this.gestorArchivosService.archivos = [];
this.cd.detectChanges();
      this.gestionOrdenesService.limpiarDatos();
    }
    onSearchChange(event){
      this.textoBuscar = event.detail.value;
    }
  
    generatePDF(){

     //this.pdfSErvice.generateFormat();
    this.pdfSErvice.generatePDF(this.gestionOrdenesService.proveedor, this.gestionOrdenesService.ordenCompra,this.gestionOrdenesService.articulos)
    }
   
  
    async  listaProveedores(){
      let modal = await  this.modalCtrl.create({
        component:ListaProveedoresPage,
        cssClass: 'large-modal',
      });
  
      await modal.present();
      const { data } = await modal.onWillDismiss();
      if(data != undefined){

     
        this.gestionOrdenesService.proveedor = data.proveedor;


        let i = this.gestionOrdenesService.monedas.findIndex(moneda => moneda.value == this.gestionOrdenesService.proveedor.MONEDA);

   if(i >=0){
    this.gestionOrdenesService.moneda = this.gestionOrdenesService.monedas[i].display;
   }
        this.articulosService.articulosProveedor = [];
        this.gestionOrdenesService.rellenarOrdenCompra(data.proveedor);
        this.articulosService.syncGetArticulos(this.gestionOrdenesService.proveedor.ID)
      }
    }
  
    async columnas() {

      let inputs = [];
      let columnas = [
                { value:'articulo', display:'Articulo' },
        { value:'procentajeDescuento', display:'% Descuento' },
      
        { value:'procentajeImpuesto', display:'% Impuesto' }
      
      
      ]
      for(let i = 0;  i < columnas.length; i++){
        inputs.push( {
          label: columnas[i].display ,
          type: 'checkbox',
          value: columnas[i].value,
          checked:false
        })
  
  
      }
        const alert = await this.alertCTrl.create({
          header: 'DiOne',
          subHeader:'Mostrar Columnas',
          cssClass:'custom-alert',
          buttons: [
            {
              text: 'Cancelar',
              role: 'cancel',
              handler: () => {
          
              },
            },
            {
              text: 'Continuar',
              role: 'confirm',
              handler: (data) => {

       
              },
            },
          ],
          inputs:inputs,
        });
    
        await alert.present();
      }


      async approvers(estado) {
     

        let inputs = [];
        let approvers:ONEOCAprob[] = [];
        for(let i = 0;  i < this.usuariosService.approvers.length; i++){
          let a =  this.usuariosService.ocAppData.findIndex(aprob => aprob.Usuario == this.usuariosService.approvers[i].Usuario  &&  aprob.ORDEN_COMPRA == this.gestionOrdenesService.ordenCompra.ORDEN_COMPRA );
          if(a < 0 ){
            inputs.push( {
              label: this.usuariosService.approvers[i].Nombre ,
              type: 'checkbox',
              value: this.usuariosService.approvers[i].Usuario,
              checked:false
            })
  
          }
  
    
    
        }
          const alert = await this.alertCTrl.create({
            header: 'Aprobador OC',
            subHeader:'Orden de compra ' +this.gestionOrdenesService.ordenCompra.ORDEN_COMPRA,
            cssClass:'custom-alert',
            buttons: [
              {
                text: 'Cancelar',
                role: 'cancel',
                handler: () => {
            
                },
              },
              {
                text: 'Continuar',
                role: 'confirm',
                handler: (data) => {
  
                  if(data.length == 0){
                    this.alertasService.message('DIONE','Debes seleccionar 1 aprobador como minimo')
                     return;
                  }
                  this.gestionOrdenesService.ordenCompra.ESTADO = estado;
  
              
                  data.forEach(user => {
                    approvers.push({
      ORDEN_COMPRA: this.gestionOrdenesService.ordenCompra.ORDEN_COMPRA,
       Usuario: user,
       Estatus: this.gestionOrdenesService.ordenCompra.ESTADO,
       Fecha: new Date().toISOString()
                    })
                  });
                
                  this.ordenCompraService.syncPutOrdenCompraToPromise(this.gestionOrdenesService.ordenCompra).then(resp =>{
                    console.log('orden de compra',[this.gestionOrdenesService.ordenCompra]);
                    this.alertasService.message('DIONE', 'El estado se actualizo con exito')
                    this.usuariosService.syncPostONEOCAprobToPromise(approvers).then(resp =>{
                      console.log(resp, 'test')
            
                 
                      });
                    this.limpiarDatos();
                  }, error =>{
                    console.log(error)
                    this.alertasService.message('DIONE', 'Error Actualizando el estado de la orden')
                  });
               console.log('approvers',approvers)
             
  
         
                },
              },
            ],
            inputs:inputs,
          });
      
          await alert.present();
        }
  

 
async actualizarEstado() {

  let inputs = [];
for(let i = 0;  i < this.gestionOrdenesService.estados.length; i++){

  if(this.gestionOrdenesService.ordenCompra.ESTADO == this.gestionOrdenesService.estados[i].value ){
    this.gestionOrdenesService.estados[i].checked = true
  }

  switch(this.gestionOrdenesService.ordenCompra.ESTADO){
    case 'A':
      if(this.gestionOrdenesService.estados[i].value  == 'B'  || this.gestionOrdenesService.estados[i].value  == 'X' ){
        inputs.push( {
          label: '(' +this.gestionOrdenesService.estados[i].value + ') '+this.gestionOrdenesService.estados[i].label ,
          type: 'radio',
          value: this.gestionOrdenesService.estados[i].value,
          checked:this.gestionOrdenesService.estados[i].checked
        })
       }

      break;
    case 'B':
      if(this.gestionOrdenesService.estados[i].value  == 'C'  || this.gestionOrdenesService.estados[i].value  == 'E' ){
        inputs.push( {
          label: '(' +this.gestionOrdenesService.estados[i].value + ') '+this.gestionOrdenesService.estados[i].label ,
          type: 'radio',
          value: this.gestionOrdenesService.estados[i].value,
          checked:this.gestionOrdenesService.estados[i].checked
        })
       }
      break;

      case 'E':
        if(this.gestionOrdenesService.estados[i].value  == 'D' ){
          inputs.push( {
            label: '(' +this.gestionOrdenesService.estados[i].value + ') '+this.gestionOrdenesService.estados[i].label ,
            type: 'radio',
            value: this.gestionOrdenesService.estados[i].value,
            checked:this.gestionOrdenesService.estados[i].checked
          })
         }
        break;

        case 'D':
          if(this.gestionOrdenesService.estados[i].value  == 'L' ){
            inputs.push( {
              label: '(' +this.gestionOrdenesService.estados[i].value + ') '+this.gestionOrdenesService.estados[i].label ,
              type: 'radio',
              value: this.gestionOrdenesService.estados[i].value,
              checked:this.gestionOrdenesService.estados[i].checked
            })
           }
        break;
    default:
      
  };



}
    const alert = await this.alertCTrl.create({
      header: 'Actualizar Estado',
      subHeader:'Orden de compra ' +this.gestionOrdenesService.ordenCompra.ORDEN_COMPRA,
      buttons: [
        {
          text: 'Cancelelar',
          role: 'cancel',
          handler: () => {
      
          },
        },
        {
          text: 'Continuar',
          role: 'confirm',
          handler: (data) => {
         console.log('data',data)
      
         if(this.gestionOrdenesService.ordenCompra.ESTADO == 'A' && data == 'B'){
          this.approvers(data);

          return
         }else{
          this.gestionOrdenesService.ordenCompra.ESTADO = this.gestionOrdenesService.estado;
          this.gestionOrdenesService.ordenCompraService.syncPutOrdenCompraToPromise(this.gestionOrdenesService.ordenCompra).then(resp =>{
            this.gestionOrdenesService.estado = data;

            console.log('orden de compra',[this.gestionOrdenesService.ordenCompra]);
            this.alertasService.message('DIONE', 'El estado se actualizo con exito')
         
            this.limpiarDatos();
          }, error =>{
            console.log(error)
            this.alertasService.message('DIONE', 'Error Actualizando el estado de la orden')
          });
         }

         
        
   
          },
        },
      ],
      inputs:inputs,
    });

    await alert.present();
  }


    async  listaBodegas(){
      if(!this.gestionOrdenesService.proveedor){
        this.alertasService.message('ISLEÑA','Seleccionar Proveedor')
              return
            }
      let modal = await  this.modalCtrl.create({
     component:ListaBodegasPage,
     cssClass: 'large-modal',
     
         });
         await modal.present();
         const { data } = await modal.onWillDismiss();
     if(data != undefined){
      console.log('bodega', data.bodega)
       this.gestionOrdenesService.bodega = data.bodega;
       this.gestionOrdenesService.ordenCompra.BODEGA = this.gestionOrdenesService.bodega.BODEGA;
     
     }
         
       }

       async consultarOrdenesEstado() {
  
        if(localStorage.getItem('proveedores')){
          this.proveedoresService.proveedores = JSON.parse(localStorage.getItem('proveedores'));
        }
        this.proveedoresService.syncGetProvedorestoPromise('').then(resp =>{
          this.proveedoresService.proveedores = resp.slice(0);
        })
      
        let inputs = [];

      for(let i = 0;  i < this.gestionOrdenesService.estados.length; i++){
  
      if(this.usuariosService.usuario.Rol == 'U' && this.gestionOrdenesService.estados[i].value != 'D' && this.gestionOrdenesService.estados[i].value != 'L' && this.gestionOrdenesService.estados[i].value != 'X'){

        inputs.push( {
          label: '(' +this.gestionOrdenesService.estados[i].value + ') '+this.gestionOrdenesService.estados[i].label ,
          type: 'radio',
          value: this.gestionOrdenesService.estados[i].value,
          checked:false
        })
      }else if (this.usuariosService.usuario.Rol == 'C'){
        inputs.push( {
          label: '(' +this.gestionOrdenesService.estados[i].value + ') '+this.gestionOrdenesService.estados[i].label ,
          type: 'radio',
          value: this.gestionOrdenesService.estados[i].value,
          checked:false
        })

        
      }
      }
          const alert = await this.alertCTrl.create({
            header: 'Consultar OC - Estado',
            buttons: [
              {
                text: 'Cancelar',
                role: 'cancel',
                handler: () => {
              
                },
              },
              {
                text: 'Continuar',
                role: 'confirm',
                handler: (data) => {
                  
                  this.gestionOrdenesService.estado = data;
                  this.ordenesDeCompra(data)
                
               console.log('data',data)

            
                },
              },
            ],
            inputs:inputs,
          });
      
          await alert.present();
        }

       async  ordenesDeCompra(estado){
       
        let modal = await  this.modalCtrl.create({
       component:OrdenesDeCompraPage,
       cssClass: 'large-modal',
       componentProps:{
        estado:estado
       }
       
           });
           await modal.present();
           const { data } = await modal.onWillDismiss();
       if(data != undefined){
        this.gestionOrdenesService.ordenCompra = data.orden;
        this.gestionOrdenesService.ordenCompra.ESTADO = estado;
        this.gestionOrdenesService.estadoOrden();
        if(this.gestionOrdenesService.ordenCompra.FECHA){
          let fecha_orden = this.gestionOrdenesService.ordenCompra.FECHA;
this.fecha = new Date(this.gestionOrdenesService.ordenCompra.FECHA);
this.date =  new Date(fecha_orden).getDate();
this.month =  new Date(fecha_orden).getMonth()+1;
this.year =  new Date(fecha_orden).getFullYear();
        }
        this.actualizar = true;
   this.sincronizarOrdenDeEntregaExistente();
        
       }
           
         }


         

  async aprobadores(inputs){
    console.log('aprobers', this.aprobadoresActuales)
    const alert = await this.alertCTrl.create({
      header: 'Aprobación Pendiente '+this.gestionOrdenesService.ordenCompra.ORDEN_COMPRA,
      cssClass:'custom-alert',
      mode: 'ios',
      buttons: ['OK'],
      inputs:inputs,
    });
      
    await alert.present();
  }

  async   consultarAprobadores(){
    let inputs = [];
    let etiqueta = '';

    this.usuariosService.syncGetONEOCAprobToPromise(this.gestionOrdenesService.ordenCompra.ORDEN_COMPRA, "").then((data) => {
      if(data.length == 0){
        this.alertasService.message('DIONE', 'No hay datos que mostrar.')
      }
          
      for(let i =0; i < data.length; i++){
        console.log('this.usuariosService.approvers',this.usuariosService.approvers)
        console.log('data[i].Usuario',data[i].Usuario)
        let a = this.usuariosService.approvers.findIndex(aprobador => aprobador.Usuario == data[i].Usuario );

        if (data[i].Estatus === 'B'){
          etiqueta = '(Por Aprobar) - ';
        } else if (data[i].Estatus === 'E'){ 
          etiqueta = '(Aprobada) - ';
        } else if (data[i].Estatus === 'C'){ 
          etiqueta = '(NO Aprobada) - ';
        }
        if(a >=0){
          
          inputs.push( {
            label: this.usuariosService.approvers[a].Nombre ,
            type: 'text',
            value: `${etiqueta}${this.usuariosService.approvers[a].Nombre}`,
            disabled:true
          })
        }
        if(i == data.length -1){
          this.aprobadores(inputs);
        }
      } 
    }).catch((err) => {});
  }
  
  
  



         sincronizarOrdenDeEntregaExistente(){
          this.alertasService.presentaLoading('Cargando datos...')
    
          this.gestionOrdenesService.ordenCompra.FECHA = null;
          this.gestionOrdenesService.ordenCompra.USUARIO = this.usuariosService.usuario.UsuarioExactus;
          this.proveedoresService.proveedores = []
          this.proveedoresService.syncGetProvedorestoPromise(this.gestionOrdenesService.ordenCompra.PROVEEDOR).then(resp =>{
            this.proveedoresService.proveedores = resp;
    
            let p =    this.proveedoresService.proveedores.findIndex(proveedor => proveedor.ID == this.gestionOrdenesService.ordenCompra.PROVEEDOR);
            if(p >=0){
              this.gestionOrdenesService.proveedor = this.proveedoresService.proveedores[p];
            }

            let i = this.gestionOrdenesService.monedas.findIndex(moneda => moneda.value == this.gestionOrdenesService.proveedor.MONEDA);

            if(i >=0){
             this.gestionOrdenesService.moneda = this.gestionOrdenesService.monedas[i].display;
            }
            console.log('res', resp)
            this.bodegasService.bodegas = [];
            this.bodegasService.syncGetBodegasToPromise().then(bodegas =>{
           this.bodegasService.bodegas = bodegas;
              let b =  this.bodegasService.bodegas.findIndex(bodega => bodega.BODEGA == this.gestionOrdenesService.ordenCompra.BODEGA);
              this.gestionOrdenesService.bodega = this.bodegasService.bodegas[b];
              this.gestionOrdenesService.actualizar = true;
              this.articulosService.articulosPostArray = [];
              this.articulosService.articulos = [];
              this.articulos =[];
              this.articulosService.syncGetArticulosToPromise(this.gestionOrdenesService.ordenCompra.PROVEEDOR).then(articulos =>{
      this.articulosService.articulos = articulos;
                this.articulos = articulos;
                console.log('this.articulos', this.articulos)
                this.lineasService.syncConsultarLineasOrdenCompra(this.gestionOrdenesService.ordenCompra.ORDEN_COMPRA).then(lineas =>{
                  console.log('lineas', lineas)
                  this.rellenarLineas(lineas);
                  this.alertasService.dismissAllLoaders();
                              });
              })
  
  
            })
    
          });
  
  
         }
  
         async  GestorArchivos(){
          let modal = await  this.modalCtrl.create({
            component:GestorArchivosPage,
            cssClass: 'large-modal',
          });
      
          await modal.present();
          const { data } = await modal.onWillDismiss();
          if(data != undefined){
    
          }
     
         }

         cargarArchivos(){
          this.gestorArchivosService.archivos = [];
          this.gestorArchivosService.syncGetArchivosToPromise(this.gestionOrdenesService.ordenCompra.ORDEN_COMPRA).then(resp => {
           console.log('archivos get resp' , resp)
        
            if(resp.length > 0){
      
      this.gestorArchivosService.archivos = resp;
      this.cd.detectChanges();
            }
          }, error =>{
      
           console.log(error, 'error')
          
          });
        }
         rellenarLineas(lineas:Lineas[]){
          this.gestionOrdenesService.articulos = [];

          for(let i =0; i < lineas.length; i++){
            let articulo =  {
              articulo  : {
                ORDEN_COMPRA: lineas[i].ORDEN_COMPRA,
                ORDEN_COMPRA_LINEA: lineas[i].ORDEN_COMPRA_LINEA,
                ARTICULO: lineas[i].ARTICULO,
                BODEGA: lineas[i].BODEGA,
                DESCRIPCION: lineas[i].DESCRIPCION,
                CANTIDAD_ORDENADA: lineas[i].CANTIDAD_ORDENADA,
                CANTIDAD_EMBARCADA: lineas[i].CANTIDAD_EMBARCADA,
                CANTIDAD_RECIBIDA: lineas[i].CANTIDAD_RECIBIDA,
                CANTIDAD_RECHAZADA: lineas[i].CANTIDAD_RECHAZADA,
                PRECIO_UNITARIO: lineas[i].PRECIO_UNITARIO,
                IMPUESTO1: lineas[i].IMPUESTO1,
                IMPUESTO2: lineas[i].IMPUESTO2,
                PORC_DESCUENTO: lineas[i].PORC_DESCUENTO,
                MONTO_DESCUENTO: lineas[i].MONTO_DESCUENTO,
                FACTOR_CONVERSION: lineas[i].FACTOR_CONVERSION,
                CENTRO_COSTO:lineas[i].CENTRO_COSTO,
                CUENTA_CONTABLE: lineas[i].CUENTA_CONTABLE,
                TIPO_IMPUESTO1: lineas[i].TIPO_IMPUESTO1,
                TIPO_TARIFA1: lineas[i].TIPO_TARIFA1,
                LOTE :lineas[i].LOTE
            },
            nombre:lineas[i].DESCRIPCION,
            cajas:0,
            totalDescuento: 0,
            totalImpuesto:0,
            montoSubTotal:lineas[i].PRECIO_UNITARIO*lineas[i].CANTIDAD_ORDENADA,
            montoTotal:lineas[i].PRECIO_UNITARIO*lineas[i].CANTIDAD_ORDENADA,
              accion:'M',
              selected:false
          
          }
          this.gestionOrdenesService.articulos.push(articulo)

            if(i == lineas.length -1){

              this.gestionOrdenesService.sumarTotales();
              this.cargarArchivos();
            }
          }
     
         }
    async  listaArticulos(articulo?){
  
      if(!this.gestionOrdenesService.bodega){
      this.alertasService.message('ISLEÑA','Seleccionar Bodega')
        return
      }
      let modal = await  this.modalCtrl.create({
        component:ListaArticulosPage,
        cssClass: 'items-modal',
        componentProps:{
          articulo:articulo
        }
     
      });
  
      await modal.present();
      const { data } = await modal.onWillDismiss();
      this.gestionOrdenesService.sumarTotales();
    
  
      
    }
    

  
  async fechaOrdenCompra(ordenCompra:OrdenCompra, property:string) {

  if(this.gestionOrdenesService.ordenCompra.ESTADO != 'A' && this.actualizar){
    return
  }
    console.log('ordenCompra[property]', ordenCompra[property], property)
    const popover = await this.popOverCtrl.create({
      component: CalendarioPopoverPage,
      cssClass: 'my-custom-class',
      translucent: true,
      componentProps : {
        fecha:ordenCompra[property] == null ?  this.formatoFecha : ordenCompra[property]
      }
    });
    await popover.present();
  
    const { data } = await popover.onDidDismiss();
  
    if(data != undefined){
     
      let fecha= new Date(data.fecha).toLocaleDateString('Es', {
        year: 'numeric',
        month: '2-digit',
        weekday: 'short',
        day: 'numeric',
      });
      
      this.gestionOrdenesService.ordenCompra[property] = data.fecha;
  
    }
  }
  
  formatDate(date:Date){
  
  return date.toLocaleDateString()
  }
  
  
    onInputChange(event: string) {
      return Number.parseFloat(event).toFixed(2);
    }
  
   
    async currency(){
      let inputs = [];
      for(let i =0; i < this.gestionOrdenesService.monedas.length; i++){
      
        if(this.gestionOrdenesService.moneda == this.gestionOrdenesService.monedas[i].value ){
          inputs.push( {
            label: this.gestionOrdenesService.monedas[i].value ,
            type: 'radio',
            value: `${this.gestionOrdenesService.monedas[i].value}`,
            checked:true
          })

        }else{
          inputs.push( {
            label: this.gestionOrdenesService.monedas[i].display ,
            type: 'radio',
            value: {value:this.gestionOrdenesService.monedas[i].value,display:this.gestionOrdenesService.monedas[i].display},
            checked:false
          })


        }
   

        if(i == this.gestionOrdenesService.monedas.length -1){
        
          const alert = await this.alertCTrl.create({
            header: 'Tipo de Moneda',
            mode: 'ios',
            buttons: [
              {
                text: 'Cancelar',
                role: 'cancel',
                handler: () => {
              
                },
              },
              {
                text: 'Continuar',
                role: 'confirm',
                handler: (data) => {
    
               console.log('data',data)
               this.gestionOrdenesService.moneda = data.display;
               this.gestionOrdenesService.ordenCompra.MONEDA = data.value;
            
                },
              }
              ],
            inputs:inputs,
          });
            
          await alert.present();


        }
      }
    
 


      console.log(this.gestionOrdenesService.moneda)
    }
  
    generarPost(){
      this.gestionOrdenesService.generarPost();
    }
  

}
