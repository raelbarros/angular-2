import { AfterViewChecked, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { ActivatedRoute, Router } from '@angular/router';
import { AppStrings } from '../../services/app-strings/app-strings.service';

import { AuthService } from '../../services/auth/auth.service';
import { User } from '../../../models/user';
import { DaoService } from '../../services/dao/dao.service';
import { CryptoService } from '../../services/crypto/crypto.service';
import { PageNotFoundComponent } from '../page-not-found/page-not-found.component';
import { TypeUser } from '../../services/type-user/type-user.service'

@Component({
  selector: 'app-profile-edit',
  templateUrl: './profile-edit.component.html',
  styleUrls: ['./profile-edit.component.css']
})
export class ProfileEditComponent implements OnInit {

  ROUTER_DASHBOARD_CLIENT = AppStrings.ROUTER_DASHBOARD_CLIENT;
  ROUTER_DASHBOARD = AppStrings.ROUTER_DASHBOARD;

  profileId: string;
  public formGroup: FormGroup;
  public user = new User();
  public descryptpassword;

  constructor(private router: Router, private route: ActivatedRoute, private auth: AuthService, private dao: DaoService, private crypto: CryptoService) {
    // get uid by user in url
    this.profileId = route.params['value']['profileId'];
    console.log(this.profileId)

  }

  ngOnInit() {
    // starting formGroup
    this.formGroup = new FormGroup({
      name: new FormControl(''),
      email: new FormControl(''),
      company: new FormControl(''),
      password: new FormControl(''),
      description: new FormControl('')
    })

    // loanding info profile
    // case error redirects to page error
    if (this.profileId !== null && this.profileId !== 'undefined') {
      this.dao.user(this.profileId, (user) => {
        this.formGroup.patchValue({
          name: user.name,
          email: user.email,
          company: user.company,
          password: this.crypto.decrypt(user.password),
          description: user.description,
        })
      })
    } else {
      this.router.navigate([PageNotFoundComponent])
    }

  }

  updateInfoProfile(data) {
    //get user in database by uid for edition
    this.dao.user(this.profileId, (userEdit) => {


      if (typeof data.name !== 'undefined') {
        userEdit.name = data.name;
      }

      if (typeof data.company !== 'undefined') {
        userEdit.company = data.company;
      }

      if (typeof data.description !== 'undefined') {
        userEdit.description = data.description;
      }

      if (data.password !== this.crypto.decrypt(userEdit.password) && data.email !== userEdit.email) {
        this.auth.updateEmailAndPassword(data.email, data.password, userEdit)
        userEdit.email = data.email;
        userEdit.password = this.crypto.encrypt(data.password);
      } else if (data.email !== userEdit.email) {
        this.auth.updateEmail(data.email, userEdit)
        userEdit.email = data.email;
      } else if (data.password !== this.crypto.decrypt(userEdit.password)) {
        this.auth.updatePassword(data.password, userEdit)
        userEdit.password = this.crypto.encrypt(data.password);
      }

      this.dao.updateUser(userEdit);

      if(userEdit.type >= TypeUser.GOD){
        this.openPage(this.ROUTER_DASHBOARD);
      } else {
        this.openPage(this.ROUTER_DASHBOARD_CLIENT);
      }
      
    })
  }

  openPage(page: string) {
    this.router.navigate([page]);
  }


}
