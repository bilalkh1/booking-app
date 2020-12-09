import { AuthService } from './../../../auth/auth.service';
import { BookingService } from './../../../bookings/booking.service';
import { ActivatedRoute, Router } from '@angular/router';
import { PlacesService } from './../../places.service';
import { Place } from './../../place.model';
import { CreateBookingComponent } from './../../../bookings/create-booking/create-booking.component';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActionSheetController, ModalController, NavController, LoadingController, AlertController } from '@ionic/angular';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-place-detail',
  templateUrl: './place-detail.page.html',
  styleUrls: ['./place-detail.page.scss'],
})
export class PlaceDetailPage implements OnInit, OnDestroy {
  place: Place;
  isLoading = false;
  private placeSub: Subscription;
  isBookable = false;
  constructor(
    private modalController: ModalController,
    private placesService: PlacesService,
    private route: ActivatedRoute,
    private actionSheetCtrl: ActionSheetController,
    private bookingService: BookingService,
    private loadingCtrl: LoadingController,
    private authService: AuthService,
    private alertCtrl: AlertController,
    private router: Router
    ) { }

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap) => {
      if (!paramMap.has('placeId')) {
        return;
      }
      this.isLoading = true;
      this.placeSub = this.placesService.getPlace(paramMap.get('placeId'))
      .subscribe((place: Place) => {
        this.place = place;
        this.isBookable = place.userId !== this.authService.userId;
        this.isLoading = false;
      }, (err) => {
        this.alertCtrl.create({ header: 'An Error Ocurred', message: 'Could not load place', buttons: [{text: 'Okay', handler: () => {
          this.router.navigate(['/places/tabs/discover']);
        }}]
        })
        .then((alertEl) => {
          alertEl.present();
        });
      });
    });
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
      console.log(actionSheetEl);
      actionSheetEl.present();
    });
  }

  openBookingModal(mode: 'select' | 'random') {
    console.log(mode);
    this.modalController.create({ component: CreateBookingComponent, componentProps: {selectedPlace: this.place, selectedMode: mode} }).then((modalEl) => {
      modalEl.present();
      console.log('hello');
      return modalEl.onDidDismiss();
    })
    .then((resultData) => {
      console.log('Hello');
      console.log(resultData.data, resultData.role);
      if (resultData.role === 'confirm') {
        this.loadingCtrl.create({message: 'Booking Place...'}).then((loadingEl) => {
          loadingEl.present();
          const data = resultData.data.bookingData;
          this.bookingService.addBooking(
            this.place.id,
            this.place.title,
            this.place.imageUrl,
            data.firstName,
            data.lastName,
            data.guestNumber,
            data.startDate,
            data.endDate
            ).subscribe(() => {
              loadingEl.dismiss();
            });
          });
        }
    });
  }

  ngOnDestroy() {
    if (this.placeSub) {
      this.placeSub.unsubscribe();
    }
  }

}
