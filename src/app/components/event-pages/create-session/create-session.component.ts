import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from '../../../../models/user';
import { Session } from '../../../../models/session';
import { DaoService } from '../../../services/dao/dao.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AppStrings } from "../../../services/app-strings/app-strings.service";
import { GlobalVariablesService } from '../../../services/global-variables/global-variables.service';
import { DateService } from '../../../services/date/date.service';

declare let $: any;

@Component({
  selector: 'app-create-session',
  templateUrl: './create-session.component.html',
  styleUrls: ['./create-session.component.css']
})
export class CreateSessionComponent implements OnInit {
  cssDone = false;
  formGroup: FormGroup;
  saved = false;

  speakers: Array<User> = [];
  selected: Array<string> = [];
  alreadySelected = [];
  autoComplete = {}; // object JSON
  eventId: string = null;

  constructor(private dao: DaoService, private router: Router, private route: ActivatedRoute, private date: DateService) {
  }

  ngOnInit() {
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

    if (this.eventId === null || this.eventId === undefined) {
      this.router.navigate([AppStrings.ROUTER_DASHBOARD_CLIENT]);
    }

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
  }

  private initMaterializeCSS() {
    $('.datepicker').pickadate({
      selectMonths: true,
      selectYears: 15,
      today: 'Hoje',
      clear: 'Limpar',
      close: 'OK',
      closeOnSelect: true
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

  createSession(data) {
    const dateInput = $('#date').val();
    const TimeStampDateInput = new Date(dateInput);

    const startDateTime = new Date(dateInput);
    const startTimeInput = $('#start-time').val().split(':');
    startDateTime.setHours(startTimeInput[0], startTimeInput[1]);

    const endDateTime = new Date(dateInput);
    const endTimeInput = $('#end-time').val().split(':');
    endDateTime.setHours(endTimeInput[0], endTimeInput[1]);

    const session = new Session();

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
    this.dao.createSession(this.eventId, session);
  }

  private findIdFromName(name: string): string {
    for (const speaker of this.speakers) {
      if (name === speaker.name) {
        return speaker.uid;
      }
    }
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

  formatDate(date) {
    const month = ['January', 'February', 'March',
      'April', 'May', 'June', 'July',
      'August', 'September', 'October',
      'November', 'December'];
    const day = date.getDate();
    const monthIndex = date.getMonth();
    const year = date.getFullYear();

    return day + ' ' + month[monthIndex] + ', ' + year;
  }
}
