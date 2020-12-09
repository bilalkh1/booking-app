import { Component, OnDestroy, OnInit } from '@angular/core';
import { IonItemSliding, LoadingController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Booking } from './booking.model';
import { BookingService } from './booking.service';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.page.html',
  styleUrls: ['./bookings.page.scss'],
})
export class BookingsPage implements OnInit, OnDestroy {
  isLoading = false;
  loadedBookings: Booking[];
  bookingSub: Subscription;
  constructor(private bookingsService: BookingService, private loadingCtrl: LoadingController) { }

  ngOnInit() {
    this.bookingSub = this.bookingsService.bookings.subscribe((bookings: Booking[]) => {
      this.loadedBookings = bookings;
    });
  }

  ionViewWillEnter(){
    this.isLoading = true;
    this.bookingsService.fetchBookings().subscribe(() => {
      this.isLoading = false;
    });
  }

  onCancelBooking(bookingId: string, slidingEl: IonItemSliding) {
    slidingEl.close();
    this.loadingCtrl.create({ message: "Canceling Booking..." })
    .then((loadingEl) => {
      loadingEl.present();
      this.bookingsService.cancelBooking(bookingId)
      .subscribe(() => {
        loadingEl.dismiss();
      });
    });
  }

  ngOnDestroy() {
    if (this.bookingSub) {
      this.bookingSub.unsubscribe();
    }
  }

}
