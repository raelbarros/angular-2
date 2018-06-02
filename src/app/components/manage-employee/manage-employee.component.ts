import { Component, NgModule } from '@angular/core';
import { Router } from '@angular/router';

import { User } from '../../../models/user';
import { DaoService } from '../../services/dao/dao.service';
import { AuthService } from '../../services/auth/auth.service';
import { AppStrings } from '../../services/app-strings/app-strings.service';
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { Event } from '../../../models/event';

declare let $: any;

@Component({
  selector: 'app-manage-employee',
  templateUrl: './manage-employee.component.html',
  styleUrls: ['./manage-employee.component.css']
})
export class ManageEmployeeComponent implements OnInit {
  ROUTER_CREATE_EMPLOYEE = AppStrings.ROUTER_CREATE_EMPLOYEE;
  ROUTER_MANAGE_EMPLOYEE = AppStrings.ROUTER_MANAGE_EMPLOYEE;
  ROUTER_FAQ = AppStrings.ROUTER_FAQ;

  public loading = true;
  public employeeList: Array<User>;

  constructor(private router: Router, private dao: DaoService, private auth: AuthService) { }

  ngOnInit() {
  }

  openPage(page: string) {
    this.router.navigate([page]);
  }

  openModal() {
    const query = $('.modal');
    query.modal({
      dismissible: true, // Modal can be dismissed by clicking outside of the modal
      opacity: 0.82, // Opacity of modal background
      inDuration: 300, // Transition in duration
      outDuration: 200, // Transition out duration
      startingTop: '4%', // Starting top style attribute
      endingTop: '20.2%', // Ending top style attribute
    });
  }
  
}
