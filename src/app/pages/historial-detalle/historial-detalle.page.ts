import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-historial-detalle',
  templateUrl: './historial-detalle.page.html',
  styleUrls: ['./historial-detalle.page.scss'],
})
export class HistorialDetallePage implements OnInit {

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {
  }

  salirHistorial(){
    this.modalCtrl.dismiss();
  }

}
