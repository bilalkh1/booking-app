import { MapModalComponent } from './../../map-modal/map-modal.component';
import { ModalController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import * as Leaflet from 'leaflet';

@Component({
  selector: 'app-location-picker',
  templateUrl: './location-picker.component.html',
  styleUrls: ['./location-picker.component.scss'],
})
export class LocationPickerComponent implements OnInit {
  map: Leaflet.Map;
  selectable = true;
  center: any = {};
  options = {};
  layers = [];
  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {

  }

  onPickLocation() {
    this.modalCtrl.create({ component: MapModalComponent })
    .then((modalEl) => {
      modalEl.onDidDismiss().then(modalData => {
        console.log(modalData.data);
        this.options = {
          layers: [
            Leaflet.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
              maxZoom: 18,
              attribution: 'AnoPlayer map',
            }),
          ],
          zoom: 12,
          center: this.center,
        };
        this.center.lat = modalData.data.lat;
        this.center.lng = modalData.data.lon;
      });
      modalEl.present();
    });
  }


  onMapReady(map: L.Map) {
    this.map = map;
    setTimeout(() => {
      map.invalidateSize(true);
      if (!this.selectable) {
      this.map.flyTo(this.center);
      // this.addMarker(this.center);
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

}
