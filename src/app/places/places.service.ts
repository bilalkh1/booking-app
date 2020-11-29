import { AuthService } from './../auth/auth.service';
import { Place } from './place.model';
import { Injectable } from '@angular/core';
import { BehaviorSubject, pipe } from 'rxjs';
import { take, map, tap, delay } from 'rxjs/Operators'

@Injectable({
  providedIn: 'root'
})
export class PlacesService {
  // tslint:disable-next-line: variable-name
  private _places = new BehaviorSubject<Place[]>([
    new Place('p1', 'This is the best city in the world', 'Casablanca', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSt-RMUWeK4yWGtoYhy9BwCaX5zltoG2Bpecg&usqp=CAU', 200, new Date('2019-01-01'), new Date('2020-01-01'), 'abc'),
    new Place('p2', 'This is the best city in the world', 'Marrakech', 'https://media-cdn.tripadvisor.com/media/photo-s/1b/1f/8e/b4/marrakech.jpg', 300, new Date('2019-01-01'), new Date('2020-01-01'), 'bcd')
  ]);
  constructor(private authService: AuthService) { }

  get places() {
    return this._places.asObservable();
  }

  // getPlaces() {
  //   return [...this._places];
  // }

  getPlace(id: string) {
    return this.places
    .pipe(
      take(1),
      map((places: Place[]) => {
        return { ...places.find(p => p.id === id) };
      })
    );
  }

  addPlace(title: string, description: string, price: number, dateFrom: Date, dateTo: Date) {
    const newPlace = new Place(Math.random().toString(), title, description, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSt-RMUWeK4yWGtoYhy9BwCaX5zltoG2Bpecg&usqp=CAU', price, dateFrom, dateTo, this.authService.userId);
    return this.places
    .pipe(
      take(1),
      tap((places: Place[]) => {
        setTimeout(() => {
          this._places.next(places.concat(newPlace));
        }, 1000);
      }),
      delay(1000)
    );
  }

  updateOffer(placeId: string, title: string, description: string) {
    return this.places.pipe(
      take(1),
      delay(1000),
      tap(places => {
        const updatedPlaceIndex = places.findIndex(pl => {
          pl.id === placeId;
        });
        const updatedPlaces = [...places];
        const oldPlace = updatedPlaces[updatedPlaceIndex];
        updatedPlaces[updatedPlaceIndex] = new Place(
          oldPlace.id,
          description,
          title,
          oldPlace.imageUrl,
          oldPlace.price,
          oldPlace.availableFrom,
          oldPlace.availableTo,
          oldPlace.userId
        );
        this._places.next(updatedPlaces);
      })
    );
  }

}
