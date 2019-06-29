import { Component, OnInit } from '@angular/core';
import { GeoipService } from 'src/app/services/geoip.service';

@Component({
  selector: 'app-local-route',
  templateUrl: './local-route.component.html',
  styleUrls: ['./local-route.component.css']
})
export class LocalRouteComponent implements OnInit {

  entradas = ['Texto', 'Archivo'];
  sistemasOP = ['Linux', 'Windows'];
  tipoEntrada: string; 
  tipoSistOperativo: string;
  textoCargado: boolean;
  texto_base: any = '';
  preproceso = [];
  trazaProcesada = [];
  error: any;


  constructor(
    private geoip: GeoipService, 
  ) { 
    this.textoCargado = false;
  } 

  ngOnInit() {
  }

  archivoCargado(input: HTMLInputElement){
    this.textoCargado = false;
    const file: File = input.files[0];
    const reader = new FileReader();
    
    reader.readAsText(file);
    reader.onload = error => {
      this.texto_base = reader.result;
      console.log(this.texto_base);
      this.preprocesarTexto();
    }
  }

  //preprocesado de texto ingresado
  preprocesarTexto(){
    this.textoCargado = false;
    this.preproceso = [];
    this.trazaProcesada = [];

    this.preproceso = this.texto_base.split(/\n/);
    for (let i = 0; i < this.preproceso.length; i++) {
      this.preproceso[i] = this.preproceso[i].split(' ');
    }
    if(this.tipoSistOperativo === 'Linux'){
      this.exportarLinux();
    }
    if(this.tipoSistOperativo === 'Windows'){
      this.exportarWindows();
    }
  }

  exportarLinux(){
    for (let i = 1; i < this.preproceso.length; i++) {
      // console.log(this.separacion[i].length);
      if ( this.preproceso[i].length > 7 ) {
        this.trazaProcesada.push({
          nSalto: this.preproceso[i][1],
          nombre: this.preproceso[i][3],
          ip: this.preproceso[i][4].substring(1, this.preproceso[i][4].length - 1),
          ms: this.preproceso[i][6],
        });
      }
    }
    this.obtenerGeo();
  }

  exportarWindows(){
    for (let indice = 0; indice < this.preproceso.length; indice++) {
      let NumSalto;
      if (this.preproceso[indice].length > 12) {
        if (this.preproceso[indice][2] !== '') {
          NumSalto = this.preproceso[indice][2];
        } else {
          NumSalto = this.preproceso[indice][1];
        }
        // console.log(this.preproceso[indice]);
        if ( this.preproceso[indice][ this.preproceso[ indice ].length - 3 ] !== '' ) {
            // console.log(`el nombre del punto es ${this.preproceso[indice][ this.preproceso[ indice ].length - 3 ]}`);
            if ( this.preproceso[indice][ this.preproceso[ indice ].length - 2 ].length > 6 ) {
              this.trazaProcesada.push({
                salto: NumSalto,
                nombre: this.preproceso[indice][ this.preproceso[ indice ].length - 3 ],
                // ip: this.preproceso[indice][4].substring(1, this.separacion[indice][4].length - 1),
                ip: this.preproceso[indice][ this.preproceso[ indice ].length - 2 ]
                .substring(1, this.preproceso[indice][ this.preproceso[ indice ].length - 2 ].length - 1),
                ms: this.preproceso[indice][ this.preproceso[ indice ].length - 6 ],
              });
            }
        } else {
          // console.log(`no hay nombre solo direccion: ${this.preproceso[indice][ this.preproceso[ indice ].length - 2 ]}`);
          if (this.preproceso[indice][ this.preproceso[ indice ].length - 2 ].length > 6 ) {
            this.trazaProcesada.push({
              salto: NumSalto,
              nombre: '',
              // ip: this.preproceso[indice][4].substring(1, this.preproceso[indice][4].length - 1),
              ip: this.preproceso[indice][ this.preproceso[ indice ].length - 2 ],
              ms: this.preproceso[indice][ this.preproceso[ indice ].length - 5 ],
            });
          }
        }
      }
    }
    //console.log("trazaWindows");
    this.obtenerGeo();
  }

  obtenerGeo() {

    for (let i = 0; i < this.trazaProcesada.length; i++) {
      this.geoip.get(this.trazaProcesada[i]['ip']).subscribe( dato => {
        //console.log(dato);
        this.trazaProcesada[i]['isp'] = dato['isp'];
        this.trazaProcesada[i]['organizacion'] = dato['organization'];
        this.trazaProcesada[i]['continente'] = dato['continent_name'];
        this.trazaProcesada[i]['pais'] = dato['country_name'];
        this.trazaProcesada[i]['ciudad'] = dato['city'];
        if (i === ( this.trazaProcesada.length - 1 ) ) {
          //console.log(this.trazaProcesada);
          //this.crearPuntos();
        }
    }, (error_service) => {
      // console.log(error_service);
      this.error = error_service;
      // console.log(`la ip ${this.JsonTraza[i]['ip']} es privada`);
      this.trazaProcesada[i]['isp'] = '***';
        this.trazaProcesada[i]['organizacion'] = '***';
        this.trazaProcesada[i]['continente'] = '***';
        this.trazaProcesada[i]['pais'] = '***';
        this.trazaProcesada[i]['ciudad'] = '***';
    });
    }
    this.textoCargado = true;
    console.log(this.trazaProcesada)
    // console.log(this.markers);
  }
}