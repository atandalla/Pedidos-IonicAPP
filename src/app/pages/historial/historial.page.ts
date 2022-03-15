import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { HistorialDetallePage } from '../historial-detalle/historial-detalle.page';

@Component({
  selector: 'app-historial',
  templateUrl: './historial.page.html',
  styleUrls: ['./historial.page.scss'],
})
export class HistorialPage implements OnInit {

  id_cliente: any;
  listaPedidos: any;
  listaDetallePedidos: any;

  constructor(private http: HttpClient,
    private storage: Storage,
    private modalCtrl: ModalController) { }

  async ngOnInit() {
    await this.storage.create();
    this.id_cliente = await this.storage.get('id_cliente');

    this.http
      .get('http://186.4.176.148:9203/api/pedidosCliente/' + this.id_cliente + '?api_key=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiZGV2QXBpUGVkaWRvczIwMjIifQ.lHVu0ROxFu3cekiDlA_rrWCXw5slw7X6bVSyg8IjLfE')
      .subscribe(data => {
        console.log(data)
        this.listaPedidos = data;
      }, error => {
        if (error.status == 404) {
          console.log(error.error);
        }

      });
  }

  async idHistorial(id) {
    console.log(id);

    this.http
      .get('http://186.4.176.148:9203/api/pedidosDetalleCliente/' + id + '?api_key=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiZGV2QXBpUGVkaWRvczIwMjIifQ.lHVu0ROxFu3cekiDlA_rrWCXw5slw7X6bVSyg8IjLfE')
      .subscribe(data => {
        console.log("datos historial:", data)
        this.listaDetallePedidos = data;
        this.Catalogo(this.listaDetallePedidos);
      }, error => {
        if (error.status == 404) {
          console.log(error.error);
        }
      });



  }



  async Catalogo(lista) {
    const modal = await this.modalCtrl.create({
      component: HistorialDetallePage,
      componentProps: {
        "historial": lista
      }
    });
    await modal.present();

  }


}
