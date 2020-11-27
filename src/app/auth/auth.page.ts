import { AuthService } from './auth.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {
  isLoading = false;
  isLogin: boolean = true;
  constructor(private authService: AuthService, private router: Router, private loadingCtrl: LoadingController) { }

  ngOnInit() {
  }

  onLogin() {
    this.isLoading = true;
    this.loadingCtrl.create({ keyboardClose: true, message: 'Logging In' }).then((loadingEl) => {
      loadingEl.present();
      this.authService.login();
      setTimeout(() => {
        this.router.navigateByUrl('/places/tabs/discover');
        this.isLoading = false;
        loadingEl.dismiss();
      }, 1500);
    });
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }
    const email = form.value.email;
    const password = form.value.password;
    console.log(email, password);
    if (this.isLogin) {
      // Send request to login servers
    } else {
      // Send request to sign up servers
    }
  }

  onSwitchAccount() {
    this.isLogin = !this.isLogin;
  }

}
