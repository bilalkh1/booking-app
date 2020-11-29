import { AuthService } from './../../auth/auth.service';
import { Place } from './../place.model';
import { PlacesService } from './../places.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-discover',
  templateUrl: './discover.page.html',
  styleUrls: ['./discover.page.scss'],
})
export class DiscoverPage implements OnInit, OnDestroy {
  places: Place[];
  listedLoadedPlaces: Place[];
  private placesSub: Subscription;
  relevantPlaces: Place[];
  constructor(private placesService: PlacesService, private authService: AuthService) { }

  ngOnInit() {
    this.placesSub = this.placesService.places.subscribe((places: Place[]) => {
      this.places = places;
      this.relevantPlaces = this.places;
      this.listedLoadedPlaces = this.relevantPlaces.slice(1);
    });
  }


  onFilterUpdate(event: CustomEvent) {
    console.log(event.detail);
    if (event.detail.value === 'all') {
      this.relevantPlaces = this.places;
    }else {
      this.relevantPlaces = this.places.filter((place) => {
        return place.userId !== this.authService.userId;
      });
    }
  }

  ngOnDestroy() {
    if(this.placesSub) {
      this.placesSub.unsubscribe();
    }
  }

}
