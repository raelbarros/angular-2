/**
 * Modules
 * 
 */
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { NgxEditorModule } from 'ngx-editor';

/**
 * Services
 * 
 */
import { CryptoService } from './services/crypto/crypto.service';
import { AuthService } from './services/auth/auth.service';
import { DaoService } from './services/dao/dao.service';
import { ApplicationProviderService } from './services/providers/application-provider.service';
import { AuthGuardService } from './services/auth-guard/auth-guard.service';
import { UserResolverService } from './services/resolvers/user-resolver.service';
import { RegexService } from './services/regex/regex.service';
import { GlobalVariablesService } from './services/global-variables/global-variables.service';
import { AppStrings } from './services/app-strings/app-strings.service';
import { TypeUser } from './services/type-user/type-user.service';
import { DateService } from './services/date/date.service'


/**
 * configuration file
 * 
 */
import { environment } from '../environments/environment.prod';
import { appRoutes } from '../router';


/**
 * Components
 */
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { DashboardComponent } from './components/adm-dashboard/dashboard/dashboard.component';
import { CreateEventComponent } from './components/create-event/create-event.component';
import { EventInfoComponent } from './components/event-pages/event-info/event-info.component';
import { SessionInfoComponent } from './components/event-pages/session-info/session-info.component';
import { EventScheduleComponent } from './components/event-pages/event-schedule/event-schedule.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { ClientDashboardComponent } from './components/client-dashboard/client-dashboard.component';
import { CreateSpeakerComponent } from './components/event-pages/create-speaker/create-speaker.component';
import { CreateAttendeeComponent } from './components/event-pages/create-attendee/create-attendee.component';
import { SpeakersComponent } from './components/event-pages/speakers/speakers.component';
import { AttendeesComponent } from './components/event-pages/attendees/attendees.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { HeaderComponent } from './components/header/header.component';
import { CreateSessionComponent } from './components/event-pages/create-session/create-session.component';
import { NewAccountComponent } from './components/adm-dashboard/new-account/new-account.component';
import { NewEventComponent } from './components/adm-dashboard/new-event/new-event.component';
import { EditAccountComponent } from './components/adm-dashboard/edit-account/edit-account.component';
import { NewAdmComponent } from './components/adm-dashboard/new-adm/new-adm.component';
import { ProfileEditComponent } from './components/profile-edit/profile-edit.component';
import { EditSpeakerComponent } from './components/event-pages/edit-speaker/edit-speaker.component';
import { EditAttendeeComponent } from './components/event-pages//edit-attendee/edit-attendee.component';
import { AddModulesComponent } from './components/event-pages/add-modules/add-modules.component';
import { ManageEmployeeComponent } from './components/manage-employee/manage-employee.component';
import { FaqComponent } from './components/faq/faq.component';
import { CreateEmployeeComponent } from './components/create-employee/create-employee.component';
import { InteractivityComponent } from './components/interactivity/interactivity.component';
import { AddSurveyComponent } from './components/add-survey/add-survey.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    DashboardComponent,
    CreateEventComponent,
    EventInfoComponent,
    SessionInfoComponent,
    SidebarComponent,
    ClientDashboardComponent,
    EventScheduleComponent,
    SidebarComponent,
    CreateSpeakerComponent,
    CreateAttendeeComponent,
    SpeakersComponent,
    PageNotFoundComponent,
    AttendeesComponent,
    HeaderComponent,
    CreateSessionComponent,
    NewAccountComponent,
    NewEventComponent,
    EditAccountComponent,
    NewAdmComponent,
    ProfileEditComponent,
    EditSpeakerComponent,
    EditAttendeeComponent,
    AddModulesComponent,
    ManageEmployeeComponent,
    FaqComponent,
    CreateEmployeeComponent,
    InteractivityComponent,
    AddSurveyComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(appRoutes),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    NgxEditorModule
  ],
  providers: [
    AuthService,
    DaoService,
    AuthGuardService,
    UserResolverService,
    ApplicationProviderService,
    AngularFireDatabase,
    AppStrings,
    GlobalVariablesService,
    CryptoService,
    RegexService,
    TypeUser,
    DateService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
