import { AfterViewChecked, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { Event } from '../../../../models/event';
import { DaoService } from '../../../services/dao/dao.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AppStrings } from "../../../services/app-strings/app-strings.service";
import { GlobalVariablesService } from "../../../services/global-variables/global-variables.service";
import { FormControlName } from '@angular/forms/src/directives/reactive_directives/form_control_name';
import { DateService } from '../../../services/date/date.service'

declare let $: any;

@Component({
  selector: 'app-event-info',
  templateUrl: './event-info.component.html',
  styleUrls: ['./event-info.component.css']
})

export class EventInfoComponent implements OnInit, AfterViewChecked {
  public formGroup: FormGroup;
  public loading = true;
  public cssDone = false;
  public saved = false;
  private eventId: string = null;

  // language form select
  public LANG_EN = 'Inglês';
  public LANG_PT = 'Português';
  public LANG_FR = 'Francês';

  // timezone form select
  public TIMEZONE_ENIWETOK = 'GMT -12:00';
  public TIMEZONE_MIDWAY = 'GMT -11:00';
  public TIMEZONE_HAWAII = 'GMT -10:00';
  public TIMEZONE_ALASKA = 'GMT -9:00';
  public TIMEZONE_PACIFIC = 'GMT -8:00';
  public TIMEZONE_MOUNTAIN = 'GMT -7:00';
  public TIMEZONE_CENTRAL = 'GMT -6:00';
  public TIMEZONE_EASTERN = 'GMT -5:00';
  public TIMEZONE_ATLANTIC = 'GMT -4:00';
  public TIMEZONE_NEWFOUNDLAND = 'GMT -3:30';
  public TIMEZONE_BRAZIL = 'GMT -3:00';
  public TIMEZONE_MIDATLANTIC = 'GMT -2:00';
  public TIMEZONE_AZORES = 'GMT -1:00';
  public TIMEZONE_WESTERNEUROPE = 'GMT';
  public TIMEZONE_BRUSSELS = 'GMT +1:00';
  public TIMEZONE_KALININGRAD = 'GMT +2:00';
  public TIMEZONE_BAGHDAD = 'GMT +3:00';
  public TIMEZONE_TEHRAN = 'GMT +3:30';
  public TIMEZONE_ABUDHABI = 'GMT +4:00';
  public TIMEZONE_KABUL = 'GMT +4:30';
  public TIMEZONE_EKATERINBURG = 'GMT +5:00';
  public TIMEZONE_BOMBAY = 'GMT +5:30';
  public TIMEZONE_KATHMANDU = 'GMT +5:45';
  public TIMEZONE_ALMATY = 'GMT +6:00';
  public TIMEZONE_BANGKOK = 'GMT +7:00';
  public TIMEZONE_BEIJING = 'GMT +8:00';
  public TIMEZONE_TOKYO = 'GMT +9:00';
  public TIMEZONE_ADELAIDE = 'GMT +9:30';
  public TIMEZONE_EASTERNAUSTRALIA = 'GMT +10:00';
  public TIMEZONE_MAGADAN = 'GMT +11:00';
  public TIMEZONE_AUCKLAND = 'GMT +12:00';


  constructor(private dao: DaoService, private router: Router, private route: ActivatedRoute,
    private global: GlobalVariablesService, private date: DateService) {
  }

  ngOnInit() {
    this.eventId = this.route.params['value']['eventId'];
    this.global.eventId = this.eventId;

    if (this.eventId !== null && this.eventId !== undefined) {
      this.dao.event(this.eventId, (event) => {

        let sDate = this.date.getTimeStampOnlyDate(event.startDate, event.timezone);
        let eDate = this.date.getTimeStampOnlyDate(event.endDate, event.timezone);

        this.formGroup.patchValue({
          name: event.name,
          url: event.url,
          site: event.site,
          subdomain: event.subdomain,
          language: event.language,
          description: event.description,
          timezone: event.timezone,
          startDate: sDate,
          endDate: eDate,
          placeName: event.placeName,
          placeAddress: event.placeAddress,
          emailSupport: event.emailSupport
        });

        this.loading = false;
      });
    } else {
      this.router.navigate([AppStrings.ROUTER_DASHBOARD_CLIENT]);
    }

    this.formGroup = new FormGroup({
      name: new FormControl('', Validators.required),
      url: new FormControl(''),
      site: new FormControl(''),
      subdomain: new FormControl(''),
      language: new FormControl('', Validators.required),
      description: new FormControl('', Validators.compose([Validators.maxLength(300)])),
      startDate: new FormControl('', Validators.required),
      endDate: new FormControl('', Validators.required),
      timezone: new FormControl('', Validators.required),
      placeName: new FormControl(''),
      placeAddress: new FormControl(''),
      emailSupport: new FormControl('')
    });

    $(document).ready(function () {
      $('select').material_select();
    });

  }

  ngAfterViewChecked() {
    this.initMaterializeCSS();
  }

  updateEvent(data) {
    data.language = $('#lang-select').val();
    data.startDate = new Date($('#start-date').val());
    data.endDate = new Date($('#end-date').val());
    data.timezone = $('#timezones').val();

    let statTimeStamp = this.date.criateTimeStamp(data.startDate);
    let endTimeStamp = this.date.criateTimeStamp(data.endDate);

    const event = new Event();

    if (typeof data.name !== 'undefined') {
      event.name = data.name;
    }

    if (typeof data.url !== 'undefined') {
      event.url = data.url;
    }

    if (typeof data.site !== 'undefined') {
      event.site = data.site;
    }

    if (typeof data.subdomain !== 'undefined') {
      event.subdomain = data.subdomain;
    }

    if (typeof data.emailSupport !== 'undefined') {
      event.emailSupport = data.emailSupport;
    }

    if (typeof data.language !== 'undefined') {
      event.language = data.language;
    }

    if (typeof data.description !== 'undefined') {
      event.description = data.description;
    }

    if (typeof data.startDate !== 'undefined') {
      event.startDate = statTimeStamp;
    }

    if (typeof data.endDate !== 'undefined') {
      event.endDate = endTimeStamp;
    }

    if (typeof data.timezone !== 'undefined') {
      event.timezone = data.timezone;
    }

    if (typeof data.placeName !== 'undefined') {
      event.placeName = data.placeName;
    }

    if (typeof data.placeAddress !== 'undefined') {
      event.placeAddress = data.placeAddress;
    }

    this.dao.updateEvent(this.eventId, event);
    this.saved = true;
    console.log(this.saved);
  }

  private initMaterializeCSS() {
    if (!this.cssDone) {
      $('.datepicker').pickadate({
        selectMonths: true,
        selectYears: 15,
        today: 'Today',
        clear: 'Clear',
        close: 'Ok',
        closeOnSelect: false
      });
      this.cssDone = true;
    }
  }

}
