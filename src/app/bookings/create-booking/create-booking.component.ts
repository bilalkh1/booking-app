import { NgForm } from '@angular/forms';
import { Place } from './../../places/place.model';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-create-booking',
  templateUrl: './create-booking.component.html',
  styleUrls: ['./create-booking.component.scss'],
})
export class CreateBookingComponent implements OnInit {
  @Input() selectedPlace: Place;
  @Input() selectedMode: 'select' | 'random';
  startDate: string;
  endDate: string;
  constructor(private modalController: ModalController) { }

  ngOnInit() {
    const availableFrom = new Date(this.selectedPlace.availableFrom);
    const availableTo = new Date(this.selectedPlace.availableTo);
    if (this.selectedMode === 'random') {
      this.startDate = new Date(availableFrom.getTime() + Math.random() *
      (availableTo.getTime() - 7*24*60*60*1000 - availableFrom.getTime())).toISOString();
      this.endDate = new Date(new Date(this.startDate).getTime() + Math.random() *
      (new Date(this.startDate).getTime() + 6 *24*60*60*1000 - new Date(this.startDate).getTime())).toString();
    }
  }

  onCancel() {
    this.modalController.dismiss(null, 'cancel');
  }

  onBookPlace(form: NgForm) {
    console.log(form.valid, this.datesValid());
    if (!form.valid || !this.datesValid()) {
      return;
    }
    this.modalController.dismiss({
      bookingData: {
        firstName: form.value['first-name'],
        lastName: form.value['last-name'],
        guestNumber: +form.value['guest-number'],
        startDate: new Date(form.value['date-from']),
        endDate: new Date(form.value['date-to'])
      }
    }, 'confirm');
  }

  datesValid() {
    // console.log(this.form);
    // const startDate = new Date(this.form.value['date-from']);
    // const endDate = new Date(this.form.value['date-to']);
    // return endDate > startDate;
    // return false;
    return true;
  }

}
