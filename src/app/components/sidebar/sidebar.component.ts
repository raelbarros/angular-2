import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AppStrings} from '../../services/app-strings/app-strings.service';
import {GlobalVariablesService} from "../../services/global-variables/global-variables.service";

declare let $: any;

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  ROUTER_EVENT_SCHEDULE = AppStrings.ROUTER_EVENT_SCHEDULE;
  ROUTER_SPEAKERS = AppStrings.ROUTER_SPEAKERS;
  ROUTER_ATTENDEES = AppStrings.ROUTER_ATTENDEES;
  ROUTER_EVENT_INFO = AppStrings.ROUTER_EVENT_INFO;
  ROUTER_DASHBOARD_CLIENT = AppStrings.ROUTER_DASHBOARD_CLIENT;
  ROUTER_ADD_MODULES = AppStrings.ROUTER_ADD_MODULES;
  ROUTER_INTERACTIVITY = AppStrings.ROUTER_INTERACTIVITY;

  constructor(private router: Router, private global: GlobalVariablesService) {}

  ngOnInit() {
    // JQuery Collapse SideBar
    $('.button-collapse').sideNav({
        menuWidth: 300,
        closeOnClick: true,
      }
    );
    $('.collapsible').collapsible();
  }

  openPage(page: string) {
    this.router.navigate([page, {eventId: this.global.eventId}]);
  }

}
