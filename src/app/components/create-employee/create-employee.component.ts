import {AfterViewChecked, Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';

import { Router } from '@angular/router';
import { AppStrings } from '../../services/app-strings/app-strings.service';

import { AuthService } from '../../services/auth/auth.service';
import { User } from '../../../models/user';
import { DaoService } from '../../services/dao/dao.service';

declare let $: any;

@Component({
  selector: 'app-create-employee',
  templateUrl: './create-employee.component.html',
  styleUrls: ['./create-employee.component.css']
})
export class CreateEmployeeComponent implements OnInit {

  public formGroup : FormGroup;

  ROUTER_MANAGE_EMPLOYEE = AppStrings.ROUTER_MANAGE_EMPLOYEE;
  ROUTER_FAQ = AppStrings.ROUTER_FAQ;

  country = [ 'SuperGod', 'God', 'Cliente', 'Funcionario', 'Usuário'];

  //const type user
  public TYPE_SUPERGOD = 4;
  public TYPE_GOD = 3;
  public TYPE_CLIENT= 2;
  public TYPE_EMPLOYEE = 1;
  public TYPE_USER = 0;

  passwordDefault = '123456';

  constructor(private router: Router, private auth: AuthService, private dao: DaoService) {
    /**only supergod and god will have access to view*/
  }

  ngOnInit() {
    this.formGroup = new FormGroup({
      name: new FormControl('', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(50)])),
      email: new FormControl('', Validators.compose([Validators.required, Validators.email, Validators.maxLength(40)])),
      password: new FormControl('', Validators.compose([Validators.required, Validators.minLength(6)])),
      type: new FormControl('', Validators.required),
    });
    
    $(document).ready(function () {
      $('select').material_select();
    });
  }

  openPage(page: string) {
    this.router.navigate([page]);
  }

  createNewAccount(data){
    data.type = $('#type').val(); 
    
    const user = new User();
    user.email = data.email;
    user.name = data.name;
    user.password = data.password;
    user.type = this.TYPE_EMPLOYEE;
    
    this.auth.registerUser(user.email, user.password, (newUser) => {
        user.uid = newUser.uid
        this.dao.updateUser(user)
        
        alert("Conta criada sucesso!");
        this.openPage(AppStrings.ROUTER_MANAGE_EMPLOYEE)
    });
  }

}
