import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { ModalController, NavController } from '@ionic/angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-detalle-pedido',
  templateUrl: './detalle-pedido.page.html',
  styleUrls: ['./detalle-pedido.page.scss'],
})
export class DetallePedidoPage implements OnInit {

  listPedidos: any;
  idEncabezado: any;
  idPedidos: any;

  constructor(private modalCtrl: ModalController,
    private storage: Storage,
    private navCtrl: NavController,
    private httpClient: HttpClient) { }

  async ngOnInit() {
    await this.storage.create();
    this.listPedidos = await this.storage.get('pedidos');
    console.log(this.listPedidos);
  }

  regresarPedidos(listaProducto) {
    this.modalCtrl.dismiss({
      listaProducto
    })
  }

  pagarListado(listaPedidos, encabezado) {
    let idEncabezado;

    console.log("Encabezado");
    console.log(encabezado);

    console.log("lista pedidos");
    console.log(listaPedidos);

    let headers: HttpHeaders = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    let postData = {
      encabezado
    }

    this.httpClient.post("http://186.4.176.148:9203/api/encabezados?api_key=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiZGV2QXBpUGVkaWRvczIwMjIifQ.lHVu0ROxFu3cekiDlA_rrWCXw5slw7X6bVSyg8IjLfE", postData, { headers: headers })
      .subscribe(data => {
        console.log(data);
        idEncabezado = data;

        let headers2: HttpHeaders = new HttpHeaders();
        headers2.append('Content-Type', 'application/json');
        let postData2 = {
          listaPedidos,
          idEncabezado
        }

        this.httpClient.post("http://186.4.176.148:9203/api/pedidos?api_key=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiZGV2QXBpUGVkaWRvczIwMjIifQ.lHVu0ROxFu3cekiDlA_rrWCXw5slw7X6bVSyg8IjLfE", postData2, { headers: headers2 })
          .subscribe(data => {
            console.log(data);

          }, error => {
            console.log(error);
          });

      }, error => {
        console.log(error);
      });





  }




}
