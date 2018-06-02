import {SessionInfoComponent} from './app/components/event-pages/session-info/session-info.component';
import {EventInfoComponent} from './app/components/event-pages/event-info/event-info.component';
import {AuthGuardService} from './app/services/auth-guard/auth-guard.service';
import {LoginComponent} from './app/components/login/login.component';
import {RegisterComponent} from './app/components/register/register.component';
import {DashboardComponent} from './app/components/adm-dashboard/dashboard/dashboard.component';
import {CreateEventComponent} from './app/components/create-event/create-event.component';
import {ClientDashboardComponent} from './app/components/client-dashboard/client-dashboard.component';
import {EventScheduleComponent} from './app/components/event-pages/event-schedule/event-schedule.component';
import {CreateSpeakerComponent} from './app/components/event-pages/create-speaker/create-speaker.component';
import {CreateAttendeeComponent} from './app/components/event-pages/create-attendee/create-attendee.component';
import {SpeakersComponent} from './app/components/event-pages/speakers/speakers.component';
import {AttendeesComponent} from './app/components/event-pages/attendees/attendees.component';
import {PageNotFoundComponent} from './app/components/page-not-found/page-not-found.component';
import {CreateSessionComponent} from './app/components/event-pages/create-session/create-session.component';
import {NewEventComponent} from './app/components/adm-dashboard/new-event/new-event.component';
import {NewAccountComponent} from './app/components/adm-dashboard/new-account/new-account.component';
import {NewAdmComponent} from './app/components/adm-dashboard/new-adm/new-adm.component';
import {AppStrings} from './app/services/app-strings/app-strings.service';
import {EditAccountComponent} from './app/components/adm-dashboard/edit-account/edit-account.component';
import {ProfileEditComponent} from './app/components/profile-edit/profile-edit.component';
import { EditSpeakerComponent } from './app/components/event-pages/edit-speaker/edit-speaker.component';
import { EditAttendeeComponent } from './app/components/event-pages/edit-attendee/edit-attendee.component';
import { AddModulesComponent } from './app/components/event-pages/add-modules/add-modules.component';
import { ManageEmployeeComponent } from './app/components/manage-employee/manage-employee.component';
import { FaqComponent } from './app/components/faq/faq.component';
import { CreateEmployeeComponent } from './app/components/create-employee/create-employee.component';
import { InteractivityComponent } from './app/components/interactivity/interactivity.component';
import { AddSurveyComponent } from './app/components/add-survey/add-survey.component';

export let appRoutes = [
  {path: AppStrings.ROUTER_ATTENDEES, component: AttendeesComponent},
  {path: AppStrings.ROUTER_CREATE_ATTENDEE, component: CreateAttendeeComponent},
  {path: AppStrings.ROUTER_CREATE_EVENT, component: CreateEventComponent, canActivate: [AuthGuardService]},
  {path: AppStrings.ROUTER_CREATE_SESSION, component: CreateSessionComponent},
  {path: AppStrings.ROUTER_CREATE_SPEAKER, component: CreateSpeakerComponent},
  {path: AppStrings.ROUTER_DASHBOARD, component: DashboardComponent, canActivate: [AuthGuardService]},
  {path: AppStrings.ROUTER_DASHBOARD_CLIENT, component: ClientDashboardComponent},
  {path: AppStrings.ROUTER_EVENT_INFO, component: EventInfoComponent},
  {path: AppStrings.ROUTER_EVENT_SCHEDULE, component: EventScheduleComponent},
  {path: AppStrings.ROUTER_LOGIN, component: LoginComponent},
  {path: AppStrings.ROUTER_REGISTER, component: RegisterComponent, canActivate: [AuthGuardService]},
  {path: AppStrings.ROUTER_SESSION_INFO, component: SessionInfoComponent},
  {path: AppStrings.ROUTER_SPEAKERS, component: SpeakersComponent},
  {path: AppStrings.ROUTER_NEW_EVENT, component: NewEventComponent},
  {path: AppStrings.ROUTER_NEW_ACCOUNT, component: NewAccountComponent},
  {path: AppStrings.ROUTER_NEW_ADM, component: NewAdmComponent},
  {path: AppStrings.ROUTER_EDIT_ACCOUNT, component: EditAccountComponent},
  {path: AppStrings.ROUTER_PROFILE_EDIT, component: ProfileEditComponent},
  {path: AppStrings.ROUTER_EDIT_SPEAKER, component: EditSpeakerComponent},
  {path: AppStrings.ROUTER_EDIT_ATTENDEE, component: EditAttendeeComponent},
  {path: AppStrings.ROUTER_ADD_MODULES, component: AddModulesComponent},
  {path: AppStrings.ROUTER_MANAGE_EMPLOYEE, component: ManageEmployeeComponent},
  {path: AppStrings.ROUTER_FAQ, component: FaqComponent},
  {path: AppStrings.ROUTER_CREATE_EMPLOYEE, component: CreateEmployeeComponent},
  {path: AppStrings.ROUTER_INTERACTIVITY, component: InteractivityComponent},
  {path: AppStrings.ROUTER_ADD_SURVEY, component: AddSurveyComponent},
  {path: '', component: LoginComponent},
  {path: '**', component: PageNotFoundComponent}
];
