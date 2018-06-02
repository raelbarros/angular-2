import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppStrings } from '../../services/app-strings/app-strings.service';
import {DaoService} from '../../services/dao/dao.service';
import {AuthService} from '../../services/auth/auth.service';
import {User} from '../../../models/user';
import { database } from 'firebase/app';
import { ActivatedRoute } from '@angular/router/src/router_state';

declare let $: any;

@Component({
  selector: 'app-interactivity',
  templateUrl: './interactivity.component.html',
  styleUrls: ['./interactivity.component.css']
})

export class InteractivityComponent implements OnInit {
  ROUTER_ADD_SURVEY = AppStrings.ROUTER_ADD_SURVEY;

  constructor(private dao: DaoService, private router: Router, private auth: AuthService) { }

  ngOnInit() {

  }

  openPage(page: string) {
    this.router.navigate([page]);
  }


}
