import { CommonModule } from '@angular/common';
import { MapModalComponent } from './map-modal/map-modal.component';
import { LocationPickerComponent } from './pickers/location-picker/location-picker.component';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { NativeGeocoder } from '@ionic-native/native-geocoder/ngx';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';

@NgModule({
    declarations: [LocationPickerComponent, MapModalComponent],
    imports: [CommonModule, IonicModule, LeafletModule],
    exports: [LocationPickerComponent, MapModalComponent],
    entryComponents: [MapModalComponent],
    providers: [NativeGeocoder]
})
export class SharedModule {}