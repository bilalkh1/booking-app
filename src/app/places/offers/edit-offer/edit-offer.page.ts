import { Place } from './../../place.model';
import { ActivatedRoute, Router } from '@angular/router';
import { PlacesService } from './../../places.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavController, LoadingController, AlertController } from '@ionic/angular';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-edit-offer',
  templateUrl: './edit-offer.page.html',
  styleUrls: ['./edit-offer.page.scss'],
})
export class EditOfferPage implements OnInit, OnDestroy {
  place: Place;
  placeId: string;
  form: FormGroup;
  isLoading = false;
  placeSub: Subscription;
  constructor(private route: ActivatedRoute, private placeService: PlacesService, private navCtrl: NavController,
    private router: Router, private loadingCtrl: LoadingController, private alertController: AlertController) { }

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap) => {
      if (!paramMap.has('placeId')) {
        this.navCtrl.navigateBack('/places/tabs/offers');
        return;
      }
      this.placeId = paramMap.get('placeId');
      this.isLoading = true;
      // this.place = this.placeService.getPlace(paramMap.get('placeId'));
      this.placeSub = this.placeService.getPlace(paramMap.get('placeId')).subscribe((place: Place) => {
        this.place = place;
        this.form = new FormGroup({
          title: new FormControl(this.place.title, { updateOn: 'blur', validators: [Validators.required] }),
          description: new FormControl(this.place.description, { updateOn: 'blur',
          validators: [Validators.required, Validators.maxLength(180)] })
        });
        this.isLoading = false;
      });
    },
    (error) => {
      this.alertController.create({ 
        header: 'An error ocurred', 
        message: 'Place could not be fetched. Please try again later.', 
        buttons: [{ text: 'Okay', handler: () => {
          this.router.navigate(['/places/tabs/offers']);
        } }] 
      }).then((alertEl) => {
        alertEl.present();
      })
    });
  }

  onConfirmEditting() {
    if (!this.form.valid) {
      return;
    }
    this.loadingCtrl.create({
      message: 'Updating Place'
    }).then((loadingEl) => {
      loadingEl.present();
      this.placeService.updateOffer(this.place.id, this.form.value.title, this.form.value.description).subscribe(() => {
       loadingEl.dismiss();
       this.form.reset();
       this.router.navigateByUrl('/places/tabs/offers');
      });
    });
  }

  ngOnDestroy() {
    if (this.placeSub) {
      this.placeSub.unsubscribe();
    }
  }

}
