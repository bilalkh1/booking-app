import { PlaceLocation } from './../../places/location.model';
import { ModalController } from '@ionic/angular';
import { Component, Input, OnInit } from '@angular/core';
import {NativeGeocoder,NativeGeocoderOptions} from '@ionic-native/native-geocoder/ngx';
import * as Leaflet from 'leaflet';

export interface LocalisationUser {
  lat: number;
  lng: number;
}

@Component({
  selector: 'app-map-modal',
  templateUrl: './map-modal.component.html',
  styleUrls: ['./map-modal.component.scss'],
})
export class MapModalComponent implements OnInit {
  map: Leaflet.Map;
  marker: any;
  // map: any;
  userPosition;
  addressPicked;
  addressMap;
  @Input() selectable = true;
  @Input() center = {lat: 35.7808, lng: -5.8176};
  @Input() closeButtonText = 'Cancel';
  @Input() title = 'Pick Location';
  marckerImage = "https://www.nicepng.com/png/detail/95-954585_deals-promos-yellow-map-marker-png.png";
  address: string[];
  options = {
    layers: [
      Leaflet.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: 'AnoPlayer map',
      }),
    ],
    zoom: 12,
    center: this.center,
  };
  layers = [];
  smallIcon = new Leaflet.Icon({
    iconSize: [25, 41],
    iconAnchor: [13, 41],
    iconUrl: this.marckerImage,
    shadowUrl: ``,
    shadowSize: [29, 41],
  });
  constructor(private modalCtrl: ModalController, private geocoder: NativeGeocoder) { }

  ngOnInit() {}

  onCancel() {
    this.modalCtrl.dismiss();
  }

  onMapReady(map: L.Map) {
    this.map = map;
    setTimeout(() => {
      map.invalidateSize(true);
      if (!this.selectable) {
        this.map.flyTo(this.center);
        this.addMarker(this.center);
      }
    }, 100);
    // this.map.flyTo({ lat: 35.7808, lng: -5.8176 });
    // this.authService.getUserLocalisation().subscribe((data) => {
    //   const center: LocalisationUser = { lat: data.latitude, lng: data.longitude };
    //   this.map.flyTo(center, 14);
    //   this.addMarker(center);
    // }, (error) => {
    //   console.log(error);
    //   this.map.flyTo({ lat: 35.7808, lng: -5.8176 });
    // });
  }

  onClickMap(latlng: LocalisationUser) {
    if (this.selectable) {
      this.addMarker(latlng);
    }
  }

  addMarker(center: LocalisationUser) {
    if (this.marker) {
      this.map.removeLayer(this.marker);
    }
    const marker = Leaflet.marker([center.lat, center.lng], {icon: this.smallIcon});
    marker.addTo(this.map);
    this.marker = marker;
    if (this.selectable) {
    this.userPosition = {...center };
    fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${center.lat}&lon=${center.lng}`)
    .then(data => {
      return data.json();
    })
    .then((json) => {
      this.addressPicked = json.display_name;
      this.addressMap = json;
      this.addressMap.img = `https://maps.geoapify.com/v1/staticmap?style=osm-carto&width=400&height=200&center=lonlat:${this.addressMap.lon},${this.addressMap.lat}&zoom=14&marker=lonlat:${this.addressMap.lon},${this.addressMap.lat};color:%23ff0000;size:large;text:A&apiKey=f5aa6802425f4079964f1d541b4d943d`
      // console.log(this.addressMap);
      this.modalCtrl.dismiss(this.addressMap);
    });
    }
  }

}
