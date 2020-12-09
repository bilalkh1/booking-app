import { PlaceLocation } from './../../../places/location.model';
import { MapModalComponent } from './../../map-modal/map-modal.component';
import { ModalController } from '@ionic/angular';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import * as Leaflet from 'leaflet';

@Component({
  selector: 'app-location-picker',
  templateUrl: './location-picker.component.html',
  styleUrls: ['./location-picker.component.scss'],
})
export class LocationPickerComponent implements OnInit {
  @Output() locationPick = new EventEmitter<PlaceLocation>();
  map: Leaflet.Map;
  selectable = true;
  imageUrl: string;
  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {

  }

  onPickLocation() {
    this.modalCtrl.create({ component: MapModalComponent })
    .then((modalEl) => {
      modalEl.onDidDismiss().then(modalData => {
        this.locationPick.emit(modalData.data);
        this.imageUrl = `https://maps.geoapify.com/v1/staticmap?style=osm-carto&width=400&height=200&center=lonlat:${modalData.data.lon},${modalData.data.lat}&zoom=14&marker=lonlat:${modalData.data.lon},${modalData.data.lat};color:%23ff0000;size:large;text:A&apiKey=f5aa6802425f4079964f1d541b4d943d`;
      });
      modalEl.present();
    });
  }

}
