import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { AppStrings } from '../../services/app-strings/app-strings.service';
import { DaoService } from '../../services/dao/dao.service';
import { TypeUser } from '../../services/type-user/type-user.service';
declare let $: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})

export class LoginComponent {
  correntUserType = -1;
  loading = true;
  // Used to inform view of auth attempt
  loginFailed = false;

  /**
    * Creates an instance of LoginComponent and injects the services needed.
    * @param {AuthService} authService
    * @param {Router} router
    * @memberof LoginComponent
    */
  constructor(private authService: AuthService, private router: Router, private dao: DaoService) {
    authService.isAuthenticated().subscribe((state) => {
      if (state) {
        this.checkUser();
      } else {
        this.loading = false;
      }
    });
  }

  openModal() {
    $('.modal').modal({
      dismissible: true,
      opacity: 0.5,
      inDuration: 300,
      outDuration: 200,
      startingTop: '30%',
      endingTop: '20%',
    });
  }

  closeModal() {
    $('.modal').modal('close');
  }

  /**
   * Receives the login button click event and attempts user login.
   * @param {any} data User input taken from html form
   * @memberof LoginComponent
   */
  loginClick(data) {
    this.authService.loginUser(data.email, data.password, (successful) => {
      if (successful) {
        this.checkUser();
      } else {
        this.loginFailed = true;
      }
    });
  }

  checkUser() {
    this.authService.currentUserUid().subscribe((uid) => {
      this.dao.user(uid, (user) => {
        this.correntUserType = user.type;
        if (this.correntUserType >= TypeUser.GOD) {
          this.router.navigate([AppStrings.ROUTER_DASHBOARD]);
        } else {
          this.router.navigate([AppStrings.ROUTER_DASHBOARD_CLIENT]);
        }
      });
    });
  }

  resetPassword(data) {
    this.authService.emailIsRegistered(data.email, check => {
      if (check) {
        this.authService.recoveryPassword(data.email)
      } else {
        alert("E-mail não cadastrado!")
      }
    })
  }
}
