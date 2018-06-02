import { AfterViewChecked, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { Router } from '@angular/router';
import { AppStrings } from '../../../services/app-strings/app-strings.service';
import { User } from '../../../../models/user';

import { AuthService } from '../../../services/auth/auth.service';
import { DaoService } from '../../../services/dao/dao.service';
import { TypeUser } from '../../../services/type-user/type-user.service';



declare let $: any;

@Component({
  selector: 'app-new-adm',
  templateUrl: './new-adm.component.html',
  styleUrls: ['./new-adm.component.css']
})
export class NewAdmComponent implements OnInit {

  public formGroup: FormGroup;

  ROUTER_DASHBOARD = AppStrings.ROUTER_DASHBOARD;
  country = ['SuperGod', 'God', 'Cliente', 'Funcionario', 'Usuário'];

  passwordDefault = '123456';

  TYPE_SUPERGOD = TypeUser.SUPERGOD;
  TYPE_GOD = TypeUser.GOD;

  constructor(
    private router: Router,
    private auth: AuthService,
    private dao: DaoService
  ) { }

  ngOnInit() {
    this.formGroup = new FormGroup({
      name: new FormControl('', Validators.compose([Validators.required, Validators.maxLength(50)])),
      email: new FormControl('', Validators.compose([Validators.required, Validators.email, Validators.maxLength(40)])),
      password: new FormControl('', Validators.compose([Validators.required, Validators.minLength(6)])),
      description: new FormControl('', Validators.compose([Validators.maxLength(300)])),
      company: new FormControl(''),
      type: new FormControl('', Validators.required),
    });

    $(document).ready(function () {
      $('select').material_select();
    });
  }

  openPage(page: string) {
    this.router.navigate([page]);
  }

  createNewAccount(data) {
    data.type = $('#type').val();


    if (data.type != null) {
      const user = new User();
      user.name = data.name;
      user.email = data.email;
      user.description = data.description;
      user.password = data.password;
      user.company = data.company;
      user.type = parseInt(data.type);

      this.auth.registerUser(user.email, user.password, (newUser) => {
        user.uid = newUser.uid
        this.dao.createUser(user);
        alert("Conta criada sucesso!");
        this.openPage(AppStrings.ROUTER_DASHBOARD)
      });
    }
  }

}
