import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { data } from 'src/app/interfaces/interfaces';
import { ModalController, ToastController } from '@ionic/angular';
import { CatalogoPage } from '../catalogo/catalogo.page';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Storage } from '@ionic/storage-angular';
import { Router } from '@angular/router';
import { DetallePedidoPage } from '../detalle-pedido/detalle-pedido.page';
import { DatePipe } from '@angular/common'

@Component({
  selector: 'app-pedidos',
  templateUrl: './pedidos.page.html',
  styleUrls: ['./pedidos.page.scss'],
  providers: [DatePipe]
})
export class PedidosPage implements OnInit {

  public cantidadCorte = [];
  public producto = [];

  date = new Date();

  listPedidos = [{
    idempresa: '',
    idcliente: '',
    totalpagar: 0,
    fecha: ''
  }];

  categoriaProducto: any;

/*   checks = [
    {
      name: 'Lado Superior',
      cod: 'lsup',
      selected: 'no'
    },
    {
      name: 'Lado Inferior',
      cod: 'linf',
      selected: 'no'
    },
    {
      name: 'Lado Derecho',
      cod: 'lder',
      selected: 'no'
    },
    {
      name: 'Lado Izquierdo',
      cod: 'lizq',
      selected: 'no'
    }
  ]; */


  ///////////////////// FUNCIONA 

  registerForm: FormGroup;

  constructor(
    private router: Router,
    private http: HttpClient,
    private modalCtrl: ModalController,
    private formBuilder: FormBuilder,
    private storage: Storage,
    public datepipe: DatePipe,
    public toastController: ToastController) { }


  id_cliente: any;
  id_empresa: any;
  nombre_cliente: any;
  nombre_empresa: any;

  id_producto: any;
  total_pagar = 0;
  precio_producto = 0;
  ladoSuperior: any;
  ladoInferior: any;
  ladoDerecho: any;
  ladoIzquierdo: any;


  async ngOnInit() {

    this.registerForm = new FormGroup({
      idproducto: new FormControl(''),
      dimensiones: new FormArray([])
    })

    await this.storage.create();

    this.id_cliente = await this.storage.get('id_cliente');
    this.id_empresa = await this.storage.get('id_empresa');
    this.nombre_cliente = await this.storage.get('nombre_cliente');
    this.nombre_empresa = await this.storage.get('nombre_empresa');
    this.listPedidos[0].idcliente = this.id_cliente;
    this.listPedidos[0].idempresa = this.id_empresa;

  }

  //reciribir productos con get, al capturar el id del producto
  boolcontrol: boolean;

  ava1: any;
  ava2: any;
  ava3: any;
  ava4: any;

  avatar1(){
    this.ava1 = 'madera';
    this.onChangeCategoria(this.ava1);
  }
  avatar2(){
    this.ava2 = 'vidrio';
    this.onChangeCategoria(this.ava2);
  }
  avatar3(){
    this.ava3 = 'aluminio';
    this.onChangeCategoria(this.ava3);
  }
  avatar4(){
    this.ava4 = 'otro';
    this.onChangeCategoria(this.ava4);
  }

  onChangeCategoria(tipo) {
    console.log(tipo);

    let categoria = tipo;

    this.http
      .get('http://186.4.176.148:9203/api/productosCategoria/' + categoria + '?api_key=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiZGV2QXBpUGVkaWRvczIwMjIifQ.lHVu0ROxFu3cekiDlA_rrWCXw5slw7X6bVSyg8IjLfE')
      .subscribe(data => {
        this.categoriaProducto = data;
      }, error => {
        console.log(error);
      });

    if (tipo != 'otro'){
      this.boolcontrol = true;
    }else{
      this.boolcontrol = false;
    }

  }



  async Catalogo() {
    const modal = await this.modalCtrl.create({
      component: CatalogoPage,
      componentProps: {
        "categoriaProducto": this.categoriaProducto
      }
    });
    await modal.present();

    const { data } = await modal.onDidDismiss();
    console.log("data-catalogo: ", data);
    this.producto = data.producto;
    this.id_producto = await this.producto['id'];
    this.precio_producto = this.producto['precio'];

    //console.log("id-proeucto: ",this.registerForm.value.idproducto);
    //console.log(this.registerForm.value)
  }


  //// FORMULARIO DIMENSIONES ////
  get dimensiones() {
    return this.registerForm.get('dimensiones') as FormArray;
  }

  addDimensiones() {
    const dimensionesFormGroup = this.formBuilder.group({
      cantidad: '',
      ancho: '',
      largo: '',
      lsup: false,
      linf: false,
      lder: false,
      lizq: false,
      observacion: ''
    })
    console.log(dimensionesFormGroup);
    this.dimensiones.push(dimensionesFormGroup);
  }

  remover(indice: number) {
    this.dimensiones.removeAt(indice);
  }

  pedido: any;

  submitPedidos() {
    this.pedido = this.registerForm.value;
    console.log("this pedido: ", this.pedido);

    this.listPedidos.push(this.pedido);
    console.log("precio producto:", Number(this.precio_producto));
    this.total_pagar = Number(this.total_pagar) + Number(this.precio_producto);

  }

  async finalizarPedido() {

    let latest_date = this.datepipe.transform(this.date, 'dd-MM-yyyy');
    this.storage.set('pedidos', this.listPedidos);
    this.listPedidos[0].totalpagar = this.total_pagar;
    this.listPedidos[0].fecha = latest_date;

    //console.log(this.listPedidos.splice(0))
    const modal = await this.modalCtrl.create({
      component: DetallePedidoPage,
      componentProps: {
        "listaPedidos": this.listPedidos.splice(1),
        "encabezado": this.listPedidos[0],
      }
    });
    await modal.present();

    const { data } = await modal.onDidDismiss();
    /* console.log("data-pedido: ",data);
    console.log("lista pedidos despues del ondismiss", this.listPedidos) */

    data.listaProducto.forEach(list => {
      console.log("list")
      console.log(list);
      this.listPedidos.push(list)
    });
    /*   for (let i = 0; i < data.listaProducto; i++) {
        console.log("for producto:",data.listaProducto[i]);
        this.listPedidos.push(data.listaProducto[i]);
        
      } */
    console.log("final: ", this.listPedidos);

    //this.listPedidos = data.listaProducto;
  }

  guardarPedido(msg){
    this.pop('Producto añadido correctamente !')
  }

  async pop(msg: string) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000
    });
    toast.present();
  }

}



