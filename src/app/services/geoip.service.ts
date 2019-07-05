import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';

const api_key = 'dd37c211a3794fcf802d4daba1171925';
const url = `https://api.ipgeolocation.io/ipgeo?apiKey=${api_key}&ip=`;

@Injectable({
  providedIn: 'root'
})
export class GeoipService {

  constructor(private http: HttpClient) {
    console.log('Running Service Right');
   }

  get(endpoint: string) {
    return this.http.get(`${url}${endpoint}`);
  }
}
