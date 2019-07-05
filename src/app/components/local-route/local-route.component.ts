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
  trazaFinal = [];
  error: any;
  mapa: any;
  lat: number = 51.678418;
  lng: number = 7.809007;


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
      //console.log(this.texto_base);
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
        var tmp = {
          nSalto: this.preproceso[i][1],
          nombre: this.preproceso[i][3],
          ip: this.preproceso[i][4].substring(1, this.preproceso[i][4].length - 1),
          ms: this.preproceso[i][6],
        };

        this.trazaProcesada[i] = tmp;
      }
    }
    console.log(this.trazaProcesada);
    this.trazaProcesada = this.trazaProcesada.filter(data => data !== undefined);
    console.log(this.trazaProcesada);
    this.obtenerGeo();
  }

  exportarWindows(){
    for (let i = 0; i < this.preproceso.length; i++) {
      let NumSalto;
      if (this.preproceso[i].length > 12) {
        if (this.preproceso[i][2] !== '') {
          NumSalto = this.preproceso[i][2];
        } else {
          NumSalto = this.preproceso[i][1];
        }
        // console.log(this.preproceso[i]);
        if ( this.preproceso[i][ this.preproceso[ i ].length - 3 ] !== '' ) {
            if ( this.preproceso[i][ this.preproceso[ i ].length - 2 ].length > 6 ) {
              var tmp = {
                nsalto: NumSalto,
                nombre: this.preproceso[i][ this.preproceso[ i ].length - 3 ],
                ip: this.preproceso[i][ this.preproceso[ i ].length - 2 ]
                .substring(1, this.preproceso[i][ this.preproceso[i].length - 2 ].length - 1),
                ms: this.preproceso[i][ this.preproceso[ i ].length - 6 ],
              };
              this.trazaProcesada[i] = tmp;
            }
        } else {
          // console.log(`no hay nombre solo direccion`);
          if (this.preproceso[i][ this.preproceso[ i ].length - 2 ].length > 6 ) {
            var tmpnombre: any;
            var tmp = {
              nsalto: NumSalto,
              nombre: tmpnombre,
              ip: this.preproceso[i][ this.preproceso[ i ].length - 2 ],
              ms: this.preproceso[i][ this.preproceso[ i ].length - 5 ],
            };
            this.trazaProcesada[i] = tmp;
          }
        }
      }
    }
    console.log("trazaWindows");
    this.trazaProcesada = this.trazaProcesada.filter(data => data !== undefined);
    console.log(this.trazaProcesada);
    this.obtenerGeo();
  }

  obtenerGeo() {
    for (let i = 1; i < this.trazaProcesada.length; i++) {
      this.geoip.get(this.trazaProcesada[i]['ip']).subscribe( dato => {
        //console.log(dato);

        var tmp = {
          nSalto: this.trazaProcesada[i]['nSalto'],
          nombre: this.trazaProcesada[i]['nombre'],
          ip: this.trazaProcesada[i]['ip'],
          ms: this.trazaProcesada[i]['ms'],
          isp: dato['isp'],
          organizacion: dato['organization'],
          continente: dato['continent_name'],
          pais: dato['country_name'],
          ciudad: dato['city'],
          latitud: Number(dato['latitude']),
          longitud: Number(dato['longitude'])
        };
        this.guardarTrazaFinal(tmp);
        console.log("Salida GuardarTraza");

        this.trazaProcesada[i]['organizacion'] = dato['isp'];
        this.trazaProcesada[i]['organizacion'] = dato['organization'];
        this.trazaProcesada[i]['continente'] = dato['continent_name'];
        this.trazaProcesada[i]['pais'] = dato['country_name'];
        this.trazaProcesada[i]['ciudad'] = dato['city'];
        this.trazaProcesada[i]['latitud'] = dato['latitude'];
        this.trazaProcesada[i]['longitud'] = dato['longitude'];
    }, (error_service) => {
      // console.log(error_service);

      // var tmp = {
      //   nSalto: this.trazaProcesada[i]['nSalto'],
      //   nombre: this.trazaProcesada[i]['nombre'],
      //   ip: this.trazaProcesada[i]['ip'],
      //   ms: this.trazaProcesada[i]['ms'],
      //   isp: "***",
      //   organizacion: "***",
      //   continente: "***",
      //   pais: "***",
      //   ciudad: "***",
      //   latitud: "***",
      //   longitud: "***"
      // };
      //this.guardarTrazaFinal(tmp);

      // this.error = error_service;
      this.trazaProcesada[i]['isp'] = '***';
      this.trazaProcesada[i]['organizacion'] = '***';
      this.trazaProcesada[i]['continente'] = '***';
      this.trazaProcesada[i]['pais'] = '***';
      this.trazaProcesada[i]['ciudad'] = '***';
      this.trazaProcesada[i]['latitud'] = '***';
      this.trazaProcesada[i]['longitud'] = '***';
    });
    }
    this.textoCargado = true;
    // console.log(this.lat + ", " + this.lng)
  }

  guardarTrazaFinal(tmp){
    console.log(typeof tmp.latitud);
    if(tmp.isp !== "***"){
      this.trazaFinal.push(tmp);
    }
  }
}