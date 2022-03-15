import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-catalogo',
  templateUrl: './catalogo.page.html',
  styleUrls: ['./catalogo.page.scss'],
})
export class CatalogoPage implements OnInit {

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {
  }

  submitProducto(producto){
    
    this.modalCtrl.dismiss({
      producto
    })
    //console.log(pro);
  }

  cerrarCatalogo(){
    this.modalCtrl.dismiss();
  }
}
