import { PlaceLocation } from './location.model';
import { AuthService } from './../auth/auth.service';
import { Place } from './place.model';
import { Injectable } from '@angular/core';
import { BehaviorSubject, of, pipe } from 'rxjs';
import { take, map, tap, delay, switchMap } from 'rxjs/Operators'
import { HttpClient } from '@angular/common/http';

interface PlaceData {
  availableFrom: Date;
  availableTo: Date;
  description: string;
  imageUrl: string;
  price: number;
  title: string;
  userId: string;
  location: PlaceLocation
}

@Injectable({
  providedIn: 'root'
})
export class PlacesService {
  // tslint:disable-next-line: variable-name
  private _places = new BehaviorSubject<Place[]>([]);
  
  constructor(private authService: AuthService, private http: HttpClient) { }

  fetchPlaces() {
    return this.http.get<{[key: string]: PlaceData}>('https://booking-app-44184.firebaseio.com/offered-places.json').pipe(
      map((resData) => {
        const places = [];
        for(const key in resData) {
          if (resData.hasOwnProperty(key)) {
            places.push(new Place(key, resData[key].description, 
              resData[key].title, resData[key].imageUrl, 
              resData[key].price, resData[key].availableFrom, 
              resData[key].availableTo, resData[key].userId, resData[key].location))
          }
        }
        return places;
      }),
      tap((places: Place[]) => {
        this._places.next(places);
      })
    );
  }

  get places() {
    return this._places.asObservable();
  }

  // getPlaces() {
  //   return [...this._places];
  // }

  getPlace(id: string) {
    return this.http.get(`https://booking-app-44184.firebaseio.com/offered-places/${id}.json`)
    .pipe(
      map((placeData: Place) => {
        return new Place(
          id,
          placeData.description,
          placeData.title,
          placeData.imageUrl,
          placeData.price,
          placeData.availableFrom,
          placeData.availableTo,
          placeData.userId,
          placeData.location
        );
      })
    );
  }

  addPlace(title: string, description: string, price: number, dateFrom: Date, dateTo: Date, location: PlaceLocation) {
    let generatedId: string;
    const newPlace = new Place(Math.random().toString(), title, description, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSt-RMUWeK4yWGtoYhy9BwCaX5zltoG2Bpecg&usqp=CAU', price, dateFrom, dateTo, this.authService.userId, location);
    return this.http.post<{name: string}>('https://booking-app-44184.firebaseio.com/offered-places.json', { ...newPlace, id: null })
    .pipe(
      switchMap((resData) => {
        generatedId = resData.name;
        return this.places;
      }),
      take(1),
      tap((places: Place[]) => {
        newPlace.id = generatedId;
        this._places.next(places.concat(newPlace));
      })
    );
    // return this.places
    // .pipe(
    //   take(1),
    //   tap((places: Place[]) => {
    //     setTimeout(() => {
    //       // this._places.next(places.concat(newPlace));
    //     }, 1000);
    //   }),
    //   delay(1000)
    // );
  }

  updateOffer(placeId: string, title: string, description: string) {
    let updatedPlacesElements: Place[];
    return this.places.pipe(
      take(1),
      switchMap(places => {
        if (!places || places.length <= 0) {
          return this.fetchPlaces();
        } else {
          return of(places);
        }
      }),
      switchMap((places) => {
        const updatedPlaceIndex = places.findIndex(pl => {
          return pl.id === placeId;
        });
        updatedPlacesElements = [...places];
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
          oldPlace.userId,
          oldPlace.location
        );
        return this.http.put(`https://booking-app-44184.firebaseio.com/offered-places/${placeId}.json`,
        {...updatedPlaces[updatedPlaceIndex]}
        );
      }),
      tap(() => {
        this._places.next(updatedPlacesElements);
      })
    );
  }

}
