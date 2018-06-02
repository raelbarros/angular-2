import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from '../../../../models/user';
import { Session } from '../../../../models/session';
import { DaoService } from '../../../services/dao/dao.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AppStrings } from "../../../services/app-strings/app-strings.service";
import { GlobalVariablesService } from "../../../services/global-variables/global-variables.service";
import { DateService } from '../../../services/date/date.service';

declare let $: any;

@Component({
  selector: 'app-session-info',
  templateUrl: './session-info.component.html',
  styleUrls: ['./session-info.component.css']
})
export class SessionInfoComponent implements OnInit {

  ROUTER_EVENT_SCHEDULE = AppStrings.ROUTER_EVENT_SCHEDULE;

  cssDone = false;
  formGroup: FormGroup;
  saved = false;

  speakers: Array<User> = [];
  selected: Array<string> = [];
  alreadySelected = [];
  autoComplete = {}; // object JSON
  eventId: string = null;
  sessionId: string = null;

  constructor(private dao: DaoService, private router: Router, private route: ActivatedRoute, private date: DateService) {
    if (this.eventId === null || this.eventId === undefined) {
      // router.navigate([AppStrings.ROUTER_DASHBOARD_CLIENT]);
    }
  }

  ngOnInit() {

    let date;
    let sTime;
    let eTime;

    //                                                                                   INICIA FORM, DATEPICKER, TIMEPICKER
    this.initMaterializeCSS();
    this.formGroup = new FormGroup({
      topic: new FormControl('', Validators.required),
      description: new FormControl('', Validators.compose([Validators.maxLength(300)])),
      date: new FormControl(''),
      startTime: new FormControl(''),
      endTime: new FormControl('')
    });

    this.eventId = this.route.params['value']['eventId'];
    this.sessionId = this.route.params['value']['sessionId'];

    //                                                                                           PEGA OS DADOS DA SESSAO
    this.dao.session(this.eventId, this.sessionId, (session) => {
      this.dao.event(this.eventId, (event) => {
        date = this.date.getTimeStampOnlyDate(session.date, event.timezone);
        sTime = this.date.getTimeStampOnlyHours(session.startTime, event.timezone);
        eTime = this.date.getTimeStampOnlyHours(session.endTime, event.timezone);

        //                                                                          COLOCA OS DADOS RECEBIDOS NOS CAMPOS DO FORM
        this.formGroup.patchValue({
          topic: session.topic,
          description: session.description,
          date: date,
          startTime: sTime,
          endTime: eTime,
        });

        //                                                                                PEGA OS PAL. QUE JA ESTAO NESTA SESSAO
        for (const uid in session.speakers) {
          this.dao.user(uid, (user) => {
            this.alreadySelected.push(user.name);
          });
        }

        //                                                                                    PEGA TODOS OS PAL. DO EVENTO
        this.dao.speakers(this.eventId, (list) => {
          for (const uid of list) {
            this.dao.user(uid, (user) => {
              this.speakers.push(user);

              if (!this.alreadySelected.includes(user.name)) {
                this.autoComplete[user.name] = null;
              }

              if (list.length === this.speakers.length) {
                this.initChipsMaterialize(this.selected);
              }
            });
          }
        });
      });
    });
  }

  private initMaterializeCSS() {
    $('.datepicker').pickadate({
      selectMonths: true,
      selectYears: 15,
      today: 'Today',
      clear: 'Clear',
      close: 'Ok',
      closeOnSelect: false
    });

    $('.timepicker').pickatime({
      default: 'now',
      fromnow: 0,
      twelvehour: false,
      donetext: 'OK',
      cleartext: 'Clear',
      canceltext: 'Cancel',
      autoclose: false,
      ampmclickable: true,
      aftershow: function () {
      }
    });
  }

  updateSession(data) {
    const dateInput = $('#date').val();
    const TimeStampDateInput = new Date(dateInput);

    const startDateTime = new Date(dateInput);
    const startTimeInput = $('#start-time').val().split(':');
    startDateTime.setHours(startTimeInput[0], startTimeInput[1]);

    const endDateTime = new Date(dateInput);
    const endTimeInput = $('#end-time').val().split(':');
    endDateTime.setHours(endTimeInput[0], endTimeInput[1]);

    const session = new Session();

    session.id = this.sessionId;
    session.date = this.date.criateTimeStamp(TimeStampDateInput)
    session.startTime = this.date.criateTimeStamp(startDateTime)
    session.endTime = this.date.criateTimeStamp(endDateTime)

    session.topic = data.topic;
    session.description = data.description;

    session.speakers = {};
    for (const name of this.selected) {
      session.speakers[this.findIdFromName(name)] = true;
    }
    for (const name of this.alreadySelected) {
      session.speakers[this.findIdFromName(name)] = true;
    }

    this.saved = true;
    this.dao.updateSession(this.eventId, session);
  }

  private findIdFromName(name: string): string {
    for (const speaker of this.speakers) {
      if (name === speaker.name) {
        return speaker.uid;
      }
    }
  }

  private removeFromAlreadySelected(index: number) {
    this.autoComplete[this.alreadySelected[index]] = null;
    this.alreadySelected.splice(index, 1);
  }

  private initChipsMaterialize(selected) {
    const query = $('.chips');

    query.on('chip.add', function (e, chip) {
      selected.push(chip.tag);
    });

    query.on('chip.delete', function (e, chip) {
      const index = selected.indexOf(chip.tag);
      if (index > -1) {
        selected.splice(index, 1);
      }
    });

    $('.chips-autocomplete').material_chip({
      autocompleteOptions: {
        data: this.autoComplete,
        limit: Infinity,
        minLength: 0
      }
    });
  }

  removeSession() {
    this.dao.deleteSession(this.eventId, this.sessionId, error => {
      if (!error) {
        this.router.navigate([AppStrings.ROUTER_EVENT_SCHEDULE, { eventId: this.eventId }])
      } else {
        console.log(error)
      }
    });
  }

  openPage(page: string) {
    this.router.navigate([page, { eventId: this.eventId }]);
  }
}



