import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from '../../services/auth/auth.service';
import {DaoService} from '../../services/dao/dao.service';
import {AppStrings} from '../../services/app-strings/app-strings.service';
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';

declare let $: any;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit{
  ROUTER_PROFILE_EDIT = AppStrings.ROUTER_PROFILE_EDIT;
  
  nameHeader = ' ';
  infoHeader = ' ';
  userName = '';

  uid: string;

  constructor(private router: Router, private auth: AuthService, dao: DaoService, private appStrings: AppStrings) {
    this.updateTitle();
    auth.currentUserUid().subscribe((uid) => {
      dao.user(uid, (user) => {
        this.userName = user.name;
        this.uid = user.uid
      });
    });
  }

  /**
   * Logout current user
   */
  logout() {
    this.auth.logoutUser();
    this.router.navigate([AppStrings.ROUTER_LOGIN]);
  }

  ngOnInit() {
    // Dropdown Profile
    $('.dropdown-button').dropdown({
        constrainWidth: false,
        hover: false,
      }
    );
  }

  openPage(page: string) {
    this.router.navigate([page, {profileId: this.uid}]);
  }

  updateTitle() {
    let page = this.router.url.replace('/', '');
    const aux = page.split(';');
    page = aux[0];

    switch (page) {
      case AppStrings.ROUTER_ATTENDEES:
        this.nameHeader = this.appStrings.appTexts[AppStrings.ROUTER_ATTENDEES].page_title;
        this.infoHeader = this.appStrings.appTexts[AppStrings.ROUTER_ATTENDEES].page_description;
        break;
      case AppStrings.ROUTER_CREATE_ATTENDEE:
        this.nameHeader = this.appStrings.appTexts[AppStrings.ROUTER_CREATE_ATTENDEE].page_title;
        this.infoHeader = this.appStrings.appTexts[AppStrings.ROUTER_CREATE_ATTENDEE].page_description;
        break;
      case AppStrings.ROUTER_SPEAKERS:
        this.nameHeader = this.appStrings.appTexts[AppStrings.ROUTER_SPEAKERS].page_title;
        this.infoHeader = this.appStrings.appTexts[AppStrings.ROUTER_SPEAKERS].page_description;
        break;
      case AppStrings.ROUTER_CREATE_SPEAKER:
        this.nameHeader = this.appStrings.appTexts[AppStrings.ROUTER_CREATE_SPEAKER].page_title;
        this.infoHeader = this.appStrings.appTexts[AppStrings.ROUTER_CREATE_SPEAKER].page_description;
        break;
      case AppStrings.ROUTER_EVENT_SCHEDULE:
        this.nameHeader = this.appStrings.appTexts[AppStrings.ROUTER_EVENT_SCHEDULE].page_title;
        this.infoHeader = this.appStrings.appTexts[AppStrings.ROUTER_EVENT_SCHEDULE].page_description;
        break;
        case AppStrings.ROUTER_CREATE_SESSION:
        this.nameHeader = this.appStrings.appTexts[AppStrings.ROUTER_CREATE_SESSION].page_title;
        this.infoHeader = this.appStrings.appTexts[AppStrings.ROUTER_CREATE_SESSION].page_description;
        break;
      case AppStrings.ROUTER_SESSION_INFO:
        this.nameHeader = this.appStrings.appTexts[AppStrings.ROUTER_SESSION_INFO].page_title;
        this.infoHeader = this.appStrings.appTexts[AppStrings.ROUTER_SESSION_INFO].page_description;
        break;
      case AppStrings.ROUTER_EVENT_INFO:
        this.nameHeader = this.appStrings.appTexts[AppStrings.ROUTER_EVENT_INFO].page_title;
        this.infoHeader = this.appStrings.appTexts[AppStrings.ROUTER_EVENT_INFO].page_description;
        break;
      case AppStrings.ROUTER_DASHBOARD_CLIENT:
        this.nameHeader = this.appStrings.appTexts[AppStrings.ROUTER_DASHBOARD_CLIENT].page_title;
        this.infoHeader = this.appStrings.appTexts[AppStrings.ROUTER_DASHBOARD_CLIENT].page_description;
        break;
      case AppStrings.ROUTER_DASHBOARD:
        this.nameHeader = this.appStrings.appTexts[AppStrings.ROUTER_DASHBOARD].page_title;
        this.infoHeader = this.appStrings.appTexts[AppStrings.ROUTER_DASHBOARD].page_description;
        break;
        case AppStrings.ROUTER_PROFILE_EDIT:
        this.nameHeader = this.appStrings.appTexts[AppStrings.ROUTER_PROFILE_EDIT].page_title;
        this.infoHeader = this.appStrings.appTexts[AppStrings.ROUTER_PROFILE_EDIT].page_description;
        break;
      case AppStrings.ROUTER_NEW_ACCOUNT:
        this.nameHeader = this.appStrings.appTexts[AppStrings.ROUTER_NEW_ACCOUNT].page_title;
        this.infoHeader = this.appStrings.appTexts[AppStrings.ROUTER_NEW_ACCOUNT].page_description;
        break;
        case AppStrings.ROUTER_EDIT_ACCOUNT:
        this.nameHeader = this.appStrings.appTexts[AppStrings.ROUTER_EDIT_ACCOUNT].page_title;
        this.infoHeader = this.appStrings.appTexts[AppStrings.ROUTER_EDIT_ACCOUNT].page_description;
        break;
      case AppStrings.ROUTER_NEW_EVENT:
        this.nameHeader = this.appStrings.appTexts[AppStrings.ROUTER_NEW_EVENT].page_title;
        this.infoHeader = this.appStrings.appTexts[AppStrings.ROUTER_NEW_EVENT].page_description;
        break;
      default:
        break;
    }
  }
}
