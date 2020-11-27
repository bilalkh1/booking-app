import { Place } from './../place.model';
import { PlacesService } from './../places.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-discover',
  templateUrl: './discover.page.html',
  styleUrls: ['./discover.page.scss'],
})
export class DiscoverPage implements OnInit {
  places: Place[];
  listedLoadedPlaces: Place[];
  constructor(private placesService: PlacesService) { }

  ngOnInit() {
    this.places = this.placesService.getPlaces();
    this.listedLoadedPlaces = this.places.slice(1);
  }


  onFilterUpdate(event: CustomEvent) {
    console.log(event.detail);
  }



}
