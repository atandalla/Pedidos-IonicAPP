import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  cliente = {
    cedula: '',
    codigo: ''
  };

  data = {
    res: 'Ingresa Correctamente'
  };


  constructor(private router: Router,
    private storage: Storage,
    private http: HttpClient,
    public toastController: ToastController) { }

  async ngOnInit() {
    await this.storage.create();
  }

  submitLogin() {
    console.log(this.cliente);

    let headers: HttpHeaders = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    let postData = {
      "cod_empresa": this.cliente.codigo,
      "cedula": this.cliente.cedula
    }

    this.http.post("http://186.4.176.148:9203/api/validarCliente?api_key=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiZGV2QXBpUGVkaWRvczIwMjIifQ.lHVu0ROxFu3cekiDlA_rrWCXw5slw7X6bVSyg8IjLfE", postData, { headers: headers })
      .subscribe(data => {

        this.storage.set('id_cliente', data['id_cliente']);
        this.storage.set('id_empresa', data['id_empresa']);
        this.storage.set('nombre_cliente', data['nombre_cliente']);
        this.storage.set('nombre_empresa', data['nombre_empresa']);
        
        this.router.navigate(['/tabs']);

        console.log(data);
      }, error => {

        if(error.status == 404){
          console.log(error.error)
          this.pop(error.error)
        }
      });
  }


  async pop(msg: string) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000
    });
    toast.present();
  }


}

