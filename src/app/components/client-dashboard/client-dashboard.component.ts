import { Component, OnInit } from '@angular/core';

import { DaoService } from '../../services/dao/dao.service';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { AppStrings } from '../../services/app-strings/app-strings.service';
import { Event } from '../../../models/event';
import { DateService } from '../../services/date/date.service'

declare let $: any;

@Component({
  selector: 'app-client-dashboard',
  templateUrl: './client-dashboard.component.html',
  styleUrls: ['./client-dashboard.component.css']
})

export class ClientDashboardComponent implements OnInit {
  ROUTER_MANAGE_EMPLOYEE = AppStrings.ROUTER_MANAGE_EMPLOYEE;
  ROUTER_FAQ = AppStrings.ROUTER_FAQ;
  private eventIds: Array<string> = [];
  public eventsList: Array<Event> = [];
  public loading = true;

  // public menu: Array<String> = [
  //   'Eventos',
  //   'Gerenc. Funcionários',
  //   'Configurações',
  //   'Ajuda'
  // ];

  constructor(private dao: DaoService, private router: Router, private auth: AuthService, private date: DateService) {
    auth.currentUserUid().subscribe((uid) => {
      dao.client(uid, (user) => {
        for (let i in user.events) {
          this.eventIds.push(i);
        }
        this.eventsList = [];
        for (let id of this.eventIds) {
          dao.event(id, event => {
            event.uid = id;

            let sDate = this.date.getTimeStampOnlyDate(event.startDate, event.timezone);
            let eDate = this.date.getTimeStampOnlyDate(event.endDate, event.timezone);

            event.startDate = sDate;
            event.endDate = eDate;

            this.eventsList.push(event);
          })
        }
        this.loading = false;
      });
    });
  }

  ngOnInit() {
    // JQuery NavBar
    // Collapse SideBar
    $('.button-collapse').sideNav({
      menuWidth: 300,
      closeOnClick: true,
    }
    );
    $('.collapsible').collapsible();
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


  eventInfo(index: number) {
    this.router.navigate([AppStrings.ROUTER_EVENT_INFO, { eventId: this.eventIds[index] }]);
  }

}

