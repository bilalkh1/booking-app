import { ActivatedRoute } from '@angular/router';
import { PlacesService } from './../../places.service';
import { Place } from './../../place.model';
import { CreateBookingComponent } from './../../../bookings/create-booking/create-booking.component';
import { Component, OnInit } from '@angular/core';
import { ActionSheetController, ModalController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-place-detail',
  templateUrl: './place-detail.page.html',
  styleUrls: ['./place-detail.page.scss'],
})
export class PlaceDetailPage implements OnInit {
  place: Place;
  constructor(private navCtrl: NavController, private modalController: ModalController, private placesService: PlacesService, private route: ActivatedRoute, private actionSheetCtrl: ActionSheetController) { }

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap) => {
      this.place = this.placesService.getPlace(paramMap.get('placeId'));
    })
  }

  onBookPlace() {
    // this.navCtrl.navigateBack('/places/tabs/discover');
    this.actionSheetCtrl.create({
      header: 'Choose an Action',
      buttons: [
        {
          text: 'Select Date',
          handler: () => {
            this.openBookingModal('select')
          }
        },
        {
          text: 'Random Date',
          handler: () => {
            this.openBookingModal('random');
          }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    }).then((actionSheetEl) => {
      actionSheetEl.present();
    })
  }

  openBookingModal(mode: 'select' | 'random') {
    console.log(mode);
    this.modalController.create({ component: CreateBookingComponent, componentProps: {selectedPlace: this.place} }).then((modalEl) => {
      modalEl.present();
      return modalEl.onDidDismiss();
    })
    .then((resultData) => {
      console.log(resultData.data, resultData.role);
      if (resultData.role === 'confirm') {
        console.log('BOOKED!...');
      }
    })
  }

}
