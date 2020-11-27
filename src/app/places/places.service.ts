import { Place } from './place.model';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PlacesService {
  // tslint:disable-next-line: variable-name
  private _places: Place[] = [
    new Place('p1', 'This is the best city in the world', 'Casablanca', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSt-RMUWeK4yWGtoYhy9BwCaX5zltoG2Bpecg&usqp=CAU', 200, new Date('2019-01-01'), new Date('2020-01-01')),
    new Place('p2', 'This is the best city in the world', 'Marrakech', 'https://media-cdn.tripadvisor.com/media/photo-s/1b/1f/8e/b4/marrakech.jpg', 300, new Date('2019-01-01'), new Date('2020-01-01'))
  ];
  constructor() { }

  get places() {
    return [...this._places];
  }

  getPlaces() {
    return [...this._places];
  }

  getPlace(id: string) {
    return {...this._places.find(p => {
      return p.id === id;
    })};
  }

}
