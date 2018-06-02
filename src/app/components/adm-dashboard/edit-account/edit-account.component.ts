import {AfterViewChecked, Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import { AppStrings } from '../../../services/app-strings/app-strings.service';

import { AuthService } from '../../../services/auth/auth.service';
import { User } from '../../../../models/user';
import { DaoService } from '../../../services/dao/dao.service';
import { CryptoService } from '../../../services/crypto/crypto.service';

@Component({
  selector: 'app-edit-account',
  templateUrl: './edit-account.component.html',
  styleUrls: ['./edit-account.component.css']
})

export class EditAccountComponent implements OnInit {
  ROUTER_DASHBOARD = AppStrings.ROUTER_DASHBOARD;
  userEdit : User;
  public formGroup: FormGroup;

  
  constructor(private router: Router, private route: ActivatedRoute, private auth: AuthService, private dao: DaoService, private crypto: CryptoService) { }

    ngOnInit() {
      this.userEdit = new User();
      const userId = this.route.params['value']['userId'];

      this.formGroup = new FormGroup({
        name: new FormControl('', Validators.required),
        email: new FormControl(''),
        company: new FormControl(''),
        password: new FormControl(''),
        description: new FormControl('')
      });
    
    
    if(userId !== null && userId !== undefined){
      this.dao.user(userId, user => {
        this.userEdit = user;
        const descryptpassword = this.crypto.decrypt(this.userEdit.password);

        this.formGroup.patchValue({
          email: this.userEdit.email,
          name: this.userEdit.name,
          password: descryptpassword,
          company: this.userEdit.company,    
          description: this.userEdit.description
        });   
      });   
    }
  }

 
  updateUser(data){
    if(this.userEdit.email !== data.email && this.userEdit.password !== data.password){
      this.auth.updateEmailAndPassword(data.email, data.password, this.userEdit);  
    }else if(this.userEdit.email !== data.email){
      this.auth.updateEmail(data.email, this.userEdit);
    }else if(this.userEdit.password !== data.password){
      this.auth.updatePassword(data.password, this.userEdit);
    }
    
    const passwordCripto = this.crypto.encrypt(data.password); //criptografia.

    this.userEdit.name = data.name;
    this.userEdit.company = data.company;
    this.userEdit.description = data.description;
    this.userEdit.email = data.email;
    this.userEdit.password = passwordCripto;
    this.dao.updateUser(this.userEdit);
    this.openPage(this.ROUTER_DASHBOARD);
  }

  openPage(page: string) {
    this.router.navigate([page]);
  }
}
