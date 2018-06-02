import { Component, NgModule } from '@angular/core';
import { Router } from '@angular/router';

import { User } from '../../../../models/user';
import { DaoService } from '../../../services/dao/dao.service';
import { AuthService } from '../../../services/auth/auth.service';
import { AppStrings } from '../../../services/app-strings/app-strings.service';
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { Event } from '../../../../models/event';

declare let $: any;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})

export class DashboardComponent implements OnInit {
  ROUTER_NEW_ADM = AppStrings.ROUTER_NEW_ADM;
  ROUTER_NEW_ACCOUNT = AppStrings.ROUTER_NEW_ACCOUNT;
  ROUTER_NEW_EVENT = AppStrings.ROUTER_NEW_EVENT;
  ROUTER_EDIT_ACCOUNT = AppStrings.ROUTER_EDIT_ACCOUNT;

  // Used to inform view if it should display loading indicator
  public loading = true;

  public currentUserType = -1;

  // Recieves the information of all taken users
  public clientsList: Array<User>;
  public eventsList = [];
  public eventListB3App = [];
  public godList: Array<User>;

  public godRemove: User;
  public clientRemove: User;
  public eventRemove: Event;


  /**
   * Creates an instance of DashboardComponent and injects the services needed
   * @param {Router} router
   * @param {DaoService} dao
   * @param auth
   * @memberof DashboardComponent
   */
  constructor(private router: Router, private dao: DaoService, private auth: AuthService) {
    auth.currentUserUid().subscribe((uid) => {
      dao.user(uid, (user) => {
        this.currentUserType = user.type;

        if (this.currentUserType >= 2) {
          this.load('gods');
          this.load('clients');
          this.load('events');
          this.load('eventsB3App');
        } else if (this.currentUserType === 1) {
          this.router.navigate(["/error"]);
        }
        this.loading = false;
      });
    });
  }

  openModal() {
    $('.modal').modal({
      dismissible: true,
      opacity: 0,
      inDuration: 300,
      outDuration: 200,
      startingTop: '35%',
      endingTop: '25%',
    });
  }

  closeModal() {
    $('#modalInternaEvent').modal('close');
    $('#modalInternaEventB3App').modal('close');
    $('#modalInternaCliente').modal('close');
    $('#modalInternaGod').modal('close');
    $('#modalInternaGod').modal('close');

  }

  ngOnInit() {
    $('.dropdown-button').dropdown({
      inDuration: 300,
      outDuration: 225,
      constrainWidth: false, // Does not change width of dropdown to that of the activator
      hover: true, // Activate on hover
      gutter: 0, // Spacing from edge
      belowOrigin: false, // Displays dropdown below the button
      alignment: 'left', // Displays dropdown with edge aligned to the left of button
      stopPropagation: false // Stops event propagation
    });
  }

  load(whichData: string) {
    if (whichData === 'clients') {
      this.dao.clients(list => {
        this.clientsList = list;
      });
    } else if (whichData === 'gods') {
      this.dao.gods(list => {
        this.godList = list;
      });
    } else if(whichData === 'events'){
      this.dao.eventsClient(list => {
        this.eventsList = list;
      });
    }else{
      this.dao.eventsB3App(list => {
        this.eventListB3App = list;
      });
    }
  }

  openPage(page: string) {
    this.router.navigate([page]);
  }

  /*
   * Recieves the New App button click event and navigates to newApp page
   * @memberof DashboardComponent
   */
  createEvent() {
    // TODO: arrumar
    console.log('Em manutenção');
    // this.router.navigate(['createEvent']);
  }

  editEvent(event: Event) {
    this.router.navigate([AppStrings.ROUTER_EVENT_INFO, { eventId: event.uid }]);
  }

  editUser(user: User) {
    this.router.navigate([AppStrings.ROUTER_EDIT_ACCOUNT, { userId: user.uid }]);
  }

  removeEvent() {
    this.dao.removeEvent(this.eventRemove);
    this.load('events');
    this.closeModal();
  }


  removeEventB3App() {
    this.dao.removeEvent(this.eventRemove);
    this.load('eventsB3App');
    this.closeModal();
  }


  getEventRemove(event: Event) {
    this.eventRemove = event;
  }

  removeClient() {
    const uid = this.clientRemove.uid;
    this.auth.deleteUser(this.clientRemove);
    this.dao.removeClient(uid);
    this.load('clients');
    const eventsClient = [];
    // tslint:disable-next-line:forin
    for (const event in this.clientRemove.events) {
      eventsClient.push(event);
    }

    for (const event of eventsClient) {
      this.dao.removeEvent(event);
    }

    this.load('events');
    this.clientRemove = null;
    this.closeModal();
  }

  getClientRemove(client: User) {
    this.clientRemove = client;
  }

  removeGod() {
    const uid = this.godRemove.uid;
    this.auth.deleteUser(this.godRemove);
    this.dao.removeGod(uid);
    this.load('gods');
    this.godRemove = null;
    this.closeModal();
  }

  getGodRemove(god: User) {
    this.godRemove = god;
  }

  /**
   * Recieves the specific user click event and navigates to profile edit page
   * TODO: profile edit page
   * @param {User} user
   * @memberof DashboardComponent
   */

  /*editUser(user: User) {
    console.log('Editing: ' + user.name)
  }*/
}
