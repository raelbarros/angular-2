import { Component, OnInit, group } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../services/auth/auth.service';
import { DaoService } from '../../../services/dao/dao.service';
import { User } from '../../../../models/user';
import { AppStrings } from '../../../services/app-strings/app-strings.service';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { Track } from '../../../../models/track';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FormControlName } from '@angular/forms/src/directives/reactive_directives/form_control_name';
import { TypeUser } from '../../../services/type-user/type-user.service';

type AOA = Array<Array<any>>;
declare let $: any;

@Component({
  selector: 'app-attendees',
  templateUrl: './attendees.component.html',
  styleUrls: ['./attendees.component.css']
})
export class AttendeesComponent implements OnInit {
  ROUTER_CREATE_ATTENDEE = AppStrings.ROUTER_CREATE_ATTENDEE;
  ROUTER_EDIT_ATTENDEE = AppStrings.ROUTER_EDIT_ATTENDEE;
  attendeesEvent: Array<User> = []; //participants of the event.
  newAttendees: Array<User> = []; // new Attendees.
  messageErrors: Array<String> = []; // array with error messages.
  tracks: Array<Track> = []; // tracks of the event.
  eventId: string = null;
  theError = false;
  passwordDefault = '123456';
  emailDefault = 'camargo.santos@b3app.com';
  formGroup: FormGroup;
  data: any;
  name = 0;
  email = 1;
  title = 2;
  company = 3;
  aboutMe = 4;
  website = 5;
  facebook = 6;
  twitter = 7;
  linkedin = 8;
  group = 9;

  dataExportTemplate: AOA = [[ // array template export 
    'Name',
    'Email',
    'Title',
    'Company Name',
    'About Me',
    'Website',
    'Facebook',
    'Twitter',
    'Linkedin',
    'Group'
  ],
  [
    'Camargo Santos',
    'camargo.santos@b3app.com',
    'Assistente de Vendas',
    'B3App Corp',
    'Iniciando a carreira de vendedor na B3App Corp',
    'www.b3app.com',
    'www.fb.com/camargob3app',
    'www.twitter.com/camargob3app',
    'www.linkedin.com/in/camargob3app',
    'Vendedores;Gerentes...',
  ]
  ];

  dataExportAttendees: AOA = [[
    'Name',
    'Email',
    'Title',
    'Company Name',
    'About Me',
    'Website',
    'Facebook',
    'Twitter',
    'Linkedin',
    'Group',
  ]];

  constructor(
    private dao: DaoService,
    private router: Router,
    private appStrings: AppStrings,
    private auth: AuthService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.eventId = this.route.params['value']['eventId'];

    if (this.eventId === null || this.eventId === undefined) {
      this.router.navigate([AppStrings.ROUTER_DASHBOARD_CLIENT]);
    }

    this.load();

    this.formGroup = new FormGroup({
      group_name: new FormControl(''),
      group_description: new FormControl('')
    });
  }

  openPage(page: string) {
    this.router.navigate([page, { eventId: this.eventId }]);
  }

  openPageInfo(page: string, index: number) {
    this.router.navigate([page, { eventId: this.eventId, profileId: this.attendeesEvent[index].uid }]);
  }

  openModal() {
    const query = $('.modal');
    this.theError = false;
    query.modal({
      dismissible: true, // Modal can be dismissed by clicking outside of the modal
      opacity: 0.7, // Opacity of modal background
      inDuration: 300, // Transition in duration
      outDuration: 200, // Transition out duration
      startingTop: '4%', // Starting top style attribute
      endingTop: '20.2%', // Ending top style attribute
    });
  }

  closeModal() {
    const query = $('.modal');
    query.modal('close');
  }

  validateEmail(email) {
    const regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regex.test(email);
  }

  checkLetterCols(column: number) {
    let letter = "";
    switch (column) {
      case this.name: {
        letter = "A";
        break;
      }
      case this.email: {
        letter = "B";
        break;
      }
    }
    return letter;
  }


  onFileChange(evt: any) {
    /* wire up file reader */
    const target: DataTransfer = <DataTransfer>(evt.target);
    if (target.files.length !== 1) {
      throw new Error('Cannot use multiple files');
    }
    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      /* read workbook */
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

      /* grab first sheet */
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];

      /* save data */
      this.data = <AOA>(XLSX.utils.sheet_to_json(ws, { header: 1 }));
    };
    reader.readAsBinaryString(target.files[0]);
  }

  preparesAttendeesExport(attendees: User) {
    const row = [];

    row.push(attendees.name);
    row.push(attendees.email);
    row.push(attendees.title);
    row.push(attendees.company);
    row.push(attendees.aboutMe);
    row.push(attendees.website);
    row.push(attendees.facebook);
    row.push(attendees.twitter);
    row.push(attendees.linkedin);
    row.push(this.prepareTrackExport(attendees.group));

    return row;
  }

  /**
   prepare the attendees tracks import
 * @param {string} groupd
   @memberof AteendeesComponent
  */
  prepareTrackImport(group: string) {
    const tracks = group.split(";");
    return tracks;
  }

  /**
    prepare the attendees tracks import
  * @param {string} groupd
    @memberof AteendeesComponent
   */
  prepareTrackExport(groups: Array<string>) {
    let track = "";
    for (const group of groups) {
      track += group + ";";
    }
    return track;
  }

  createArrayAux(data: Array<User>) {
    const aux: Array<User> = [];

    for (const element of data) {
      aux.push(element);
    }
    aux.shift();
    return aux;
  }

  importAttendees() {
    const aux = this.createArrayAux(this.data); // retira a linha de titulo.
    this.messageErrors = [];
    let validate_error = true;

    if (aux.length > 0) {
      let row = 2;

      for (const element of aux) {
        const newAttendees = new User();
        if (typeof element[this.name] !== 'undefined') { // fazer função validar nome. 
          newAttendees.name = element[this.name];
        } else {
          validate_error = false;
          const column = this.checkLetterCols(this.name);
          this.messageErrors.push(column + row);
        }

        if (this.validateEmail(element[this.email])) {
          if (element[this.email] !== this.emailDefault) {
            newAttendees.email = element[this.email];
          } else {
            validate_error = false;
            const column = this.checkLetterCols(this.email);
            this.messageErrors.push(column + row);
            this.theError = true;
          }
        } else {
          validate_error = false;
          const column = this.checkLetterCols(this.email);
          this.messageErrors.push(column + row);
        }

        if (typeof element[this.title] !== 'undefined') {
          newAttendees.title = element[this.title];
        }

        if (typeof element[this.company] !== 'undefined') {
          newAttendees.company = element[this.company];
        }

        if (typeof element[this.aboutMe] !== 'undefined') {
          newAttendees.aboutMe = element[this.aboutMe];
        }

        if (typeof element[this.website] !== 'undefined') {
          newAttendees.website = element[this.website];
        }

        if (typeof element[this.facebook] !== 'undefined') {
          newAttendees.facebook = element[this.facebook];
        }

        if (typeof element[this.twitter] !== 'undefined') {
          newAttendees.twitter = element[this.twitter];
        }

        if (typeof element[this.linkedin] !== 'undefined') {
          newAttendees.linkedin = element[this.linkedin];
        }

        if (typeof element[this.group] !== 'undefined') {
          newAttendees.group = this.prepareTrackImport(element[this.group]);
        }

        this.newAttendees.push(newAttendees);
        row++;
      }

      if (validate_error) {
        for (const attendees of this.newAttendees) {
          this.registreAttendeesImport(attendees);
          this.closeModal();
        }
      } else {
        this.theError = true;
      }
    }
  }

  /**
  * create or upadate and insert attendees.
  * @param {User} attendees
  * @memberof DaoService
  */

  registreAttendeesImport(attendees: User) {
    const auxGroup = attendees.group;
    attendees.group = [];
    this.auth.emailIsRegistered(attendees.email, check => {
      if (check) {
        this.dao.uid(attendees.email, uid => {//corrigir -> criar função que com e-mail retorna usuário.
          attendees.uid = uid;
          this.dao.user(attendees.uid, (oldUser) => { //corrigir
            attendees.type = oldUser.type;
            attendees.password = oldUser.password;
            if (!this.checkAttendeesEvent(attendees)) { //verifica se o participante já faz parte do evento.
              this.dao.updateUser(attendees);
              this.dao.insertAttendee(this.eventId, attendees)
              this.createTrackImport(attendees, auxGroup);
            } else {
              this.dao.updateUser(attendees)
              this.createTrackImport(attendees, auxGroup);
              this.load();
            }
          });
        })
      } else {
        this.auth.register(attendees.email, user => {
          attendees.uid = user.uid;
          attendees.password = this.passwordDefault;
          attendees.type = TypeUser.USER;
          this.dao.createUser(attendees);
          this.dao.insertAttendee(this.eventId, attendees);
          this.createTrackImport(attendees, auxGroup);
        });
      }
    })
  }

  /**
   *check if the participant is part of the event
    @param User newAttendees
   */

  checkAttendeesEvent(newAttendees: User) { // refazer
    let result = false;

    for (const speaker of this.attendeesEvent) {
      if (newAttendees.uid === speaker.uid) {
        result = true;
      }
    }
    return result;
  }

  exportFileAttendees() {
    for (const attendees of this.attendeesEvent) {
      let row: any;
      row = this.preparesAttendeesExport(attendees);
      this.dataExportAttendees.push(row);
    }

    const wscols: XLSX.ColInfo[] = [
      { wpx: 100 }, // "pixels"
      { wpx: 100 }, // "pixels"
      { wpx: 100 }, // "pixels"
      { wpx: 100 }, // "pixels"
      { wpx: 100 }, // "pixels"
      { wpx: 100 }, // "pixels"
      { wpx: 100 }, // "pixels"
      { wpx: 100 }, // "pixels"
      { wpx: 100 }, // "pixels"
      { wpx: 100 }, // "pixels"
      { hidden: false } // hide column
    ];

    /* At 96 PPI, 1 pt = 1 px */
    const wsrows: XLSX.RowInfo[] = [
      { hpx: 25 }, // "pixels"
    ];

    /* generate worksheet */
    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(this.dataExportAttendees);

    /* TEST: column props */
    ws['!cols'] = wscols;

    /* TEST: row props */
    ws['!rows'] = wsrows;

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    const wbout: string = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });
    saveAs(new Blob([this.s2ab(wbout)]), 'attendees.xlsx');
  }


  exportFileTemplate() {
    const wscols: XLSX.ColInfo[] = [
      { wpx: 100 }, // "pixels"
      { wpx: 100 }, // "pixels"
      { wpx: 100 }, // "pixels"
      { wpx: 100 }, // "pixels"
      { wpx: 100 }, // "pixels"
      { wpx: 100 }, // "pixels"
      { wpx: 100 }, // "pixels"
      { wpx: 100 }, // "pixels"
      { wpx: 100 }, // "pixels"
      { wpx: 100 }, // "pixels"

      { hidden: false } // hide column
    ];

    /* At 96 PPI, 1 pt = 1 px */
    const wsrows: XLSX.RowInfo[] = [
      { hpx: 25 }, // "pixels"
      { hpx: 25 }, // "pixels"
    ];

    /* generate worksheet */
    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(this.dataExportTemplate);

    /* TEST: column props */
    ws['!cols'] = wscols;

    /* TEST: row props */
    ws['!rows'] = wsrows;

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    const wbout: string = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });
    saveAs(new Blob([this.s2ab(wbout)]), 'template.xlsx');
  }

  private s2ab(s: string): ArrayBuffer {
    const buf: ArrayBuffer = new ArrayBuffer(s.length);
    const view: Uint8Array = new Uint8Array(buf);
    for (let i = 0; i !== s.length; ++i) {
      view[i] = s.charCodeAt(i) & 0xFF;
    }
    return buf;
  }

  /**
   * create track
   * @param {FormGroup} data
   * @memberof DaoService
   */

  createTrack(data) {
    if (data.group_name.length > 0) {
      this.dao.checkNameTrack(data.group_name, this.eventId, exist => { //check if track exist.
        if (!exist) {
          let newTrack = new Track();
          newTrack.name = data.group_name;
          newTrack.description = data.group_description;
          this.dao.createTrackAttendee(this.eventId, newTrack);
          this.load();
        }
      });
    }
  }

  /**
   * remove track. 
   * @memberof DaoService
   */

  removeTrack(track: Track) {
    this.dao.removeTrackAttendee(this.eventId, track);
    this.load();
  }

  /**
  * load list of tracks and attendees. 
  * @param {string} eventId
  * @param onResolve
  * @memberof DaoService
  */

  load() {
    this.dao.tracksAttendee(this.eventId, (tracks) => {
      this.tracks = [];
      this.tracks = tracks;
    });
    this.dao.attendeesWithTracks(this.eventId, Attendees => {
      this.attendeesEvent = [];
      this.attendeesEvent = Attendees;
    });
  }

  /**
  * create track function importAttendees()
  * @param {User} attendee
  * @memberof DaoService
  */

  createTrackImport(attendee: User, group) {
    if (group.length > 0) {
      for (const name of group) {
        if (name.length > 0) {
          this.dao.checkNameTrack(name, this.eventId, exist => { //check if track exist.
            if (exist) {
              this.dao.trackSearchByName(name, this.eventId, (track) => {
                this.dao.checkUserOnTreck(track.uid, attendee.uid, exist => {
                  if (!exist) {
                    this.dao.insertUserTrackAttendee(track.uid, attendee.uid);
                    this.load();
                  }
                });
              });
            }
            else {
              let newTrack = new Track();
              newTrack.name = name;
              /*this.dao.createTrackAttendee(this.eventId, newTrack);
              this.dao.trackSearchByName(newTrack.name, this.eventId, (track) =>{ // corrigir
                this.dao.insertUserTrackAttendee(track.uid, attendee.uid);
                this.load();
              });*/
              this.dao.RegisterTrackAttendee(this.eventId, newTrack, result => {
                if (result) {
                  this.dao.trackSearchByName(newTrack.name, this.eventId, (track) => { // corrigir
                    this.dao.insertUserTrackAttendee(track.uid, attendee.uid);
                    this.load();
                  });
                }
              })
            }
          });
        }
      }
    }
  }
}