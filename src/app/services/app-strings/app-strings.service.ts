import {Injectable} from '@angular/core';
import * as pt_br from '../../../translations/pt_br';

@Injectable()
export class AppStrings {
  static ROUTER_ATTENDEES = 'attendees';
  static ROUTER_CREATE_ATTENDEE = 'create_attendee';
  static ROUTER_CREATE_EVENT = 'create_event';
  static ROUTER_CREATE_SESSION = 'create_session';
  static ROUTER_CREATE_SPEAKER = 'create_speaker';
  static ROUTER_DASHBOARD = 'dashboard';
  static ROUTER_DASHBOARD_CLIENT = 'dashboard_client';
  static ROUTER_EVENT_INFO = 'event_info';
  static ROUTER_EVENT_SCHEDULE = 'event_schedule';
  static ROUTER_LOGIN = 'login';
  static ROUTER_REGISTER = 'register';
  static ROUTER_SESSION_INFO = 'session_info';
  static ROUTER_SPEAKERS = 'speakers';
  static ROUTER_NEW_EVENT = 'new_event';
  static ROUTER_NEW_ACCOUNT = 'new_account';
  static ROUTER_EDIT_ACCOUNT = 'edit_account';
  static ROUTER_NEW_ADM = 'new_adm';
  static ROUTER_PROFILE_EDIT = 'profile_edit';
  static ROUTER_EDIT_SPEAKER = 'edit_speaker';
  static ROUTER_EDIT_ATTENDEE = 'edit_attendee';
  static ROUTER_ADD_MODULES = 'add_modules';
  static ROUTER_MANAGE_EMPLOYEE = 'manage_employee';
  static ROUTER_FAQ = 'faq';
  static ROUTER_CREATE_EMPLOYEE = 'create_employee';
  static ROUTER_INTERACTIVITY = 'interactivity';
  static ROUTER_ADD_SURVEY = 'add_survey';

  appTexts: {};

  constructor() {
    this.appTexts = pt_br.texts;
  }

}
