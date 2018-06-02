import { Component, OnInit } from '@angular/core';
import { DaoService } from '../../../services/dao/dao.service';
import { Session } from '../../../../models/session';
import { ActivatedRoute, Router } from '@angular/router';
import { AppStrings } from '../../../services/app-strings/app-strings.service';
import { AuthService } from '../../../services/auth/auth.service';
import { User } from '../../../../models/user';
import {Track} from '../../../../models/track';
import { RegexService } from '../../../services/regex/regex.service';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { TypeUser } from '../../../services/type-user/type-user.service';
import { DateService } from '../../../services/date/date.service'
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FormControlName } from '@angular/forms/src/directives/reactive_directives/form_control_name';

declare let $: any;
type AOA = Array<Array<any>>;

@Component({
  selector: 'app-event-schedule',
  templateUrl: './event-schedule.component.html',
  styleUrls: ['./event-schedule.component.css']
})
export class EventScheduleComponent implements OnInit {

  ROUTER_CREATE_SESSION = AppStrings.ROUTER_CREATE_SESSION;
  ROUTER_SESSION_INFO = AppStrings.ROUTER_SESSION_INFO;
  sessions: Array<Session>;
  tracks: Array<Track>;
  public loading = true;
  eventId: string = null;
  formGroup : FormGroup;


  sessionImports: Array<Session> = [];
  data: any;

  topic = 0;
  description = 1;
  startDate = 2;
  startTime = 3;
  endTime = 4;
  speakers = 5;
  group = 6;

  theError = false;

  day; month: number;

  temp: Array<string>;

  dataExportTemplate: AOA = [
    [
      'Topic',
      'Description',
      'Date',
      'StartTime',
      'EndTime',
      'Speakers Email',
      'Group'
    ],
    [
      'Workshop de Vendas',
      'Aprenda as técnicas de vendas com experientes do mercado. Aguce sua visão, habilidade e encante seus clientes',
      'mm/dd/yyyy',
      '09:15',
      '22:30',
      'joaodasilva@b3app.com',
      'Grupo A; Grupo B'
    ]
  ];

  dataExportSessions: AOA = [
    [
      'Topic',
      'Description',
      'Date',
      'StartTime',
      'EndTime',
      'Speakers Email',
      'Group'
    ]
  ];

  constructor(private dao: DaoService, private router: Router, private auth: AuthService, private route: ActivatedRoute,
    private regex: RegexService, private date: DateService) {
  }

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

  sessionInfo(index: number) {
    this.router.navigate([AppStrings.ROUTER_SESSION_INFO,
    { eventId: this.eventId, sessionId: this.sessions[index].id }]);
  }

  createSession() {
    this.router.navigate([AppStrings.ROUTER_CREATE_SESSION]);
  }

  openModal() {
    const query = $('.modal');
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

  importSession() {
    if (this.data.length > 0) {
      let cont = 0;
      for (const element of this.data) {
        console.log(element)
        if (cont > 0 && typeof element[0] !== 'undefined' && typeof element[2] !== 'undefined') {
          const newSession = new Session();
          newSession.topic = element.name;
          newSession.startTime = element.startTime;

          // Format Date import
          this.temp = (element[this.startDate].split("/"));
          this.verifyDate(parseInt(this.temp[0]), parseInt(this.temp[1]));

          const years = parseInt(this.temp[2]) + 2000;

          const aux = new Date(years, this.month - 1, this.day).getTime() / 1000;
          element[this.startDate] = aux;


          // format Hors import
          const startHours = new Date();
          const firstHours = element[this.startTime].split(':');
          const minStart = firstHours[1].split('AM');
          startHours.setHours(firstHours[0], minStart[0]);
          const stHours = startHours.getTime() / 1000;
          element[this.startTime] = stHours;

          const endHors = new Date();
          const lastHors = element[this.endTime].split(':');
          const minEnd = lastHors[1].split('PM');
          endHors.setHours(lastHors[0], minEnd[0]);
          const ehours = endHors.getTime() / 1000;
          element[this.endTime] = ehours;



          if (typeof element[this.topic] !== 'undefined') {
            newSession.topic = element[this.topic];
          }

          if (typeof element[this.description] !== 'undefined') {
            newSession.description = element[this.description];
          }

          if (typeof element[this.startDate] !== 'undefined') {
            newSession.date = element[this.startDate];
          }

          if (typeof element[this.startTime] !== 'undefined') {
            newSession.startTime = element[this.startTime];
          }

          if (typeof element[this.endTime] !== 'undefined') {
            newSession.endTime = element[this.endTime];
          }

          if (typeof element[this.speakers] !== 'undefined') {
            this.auth.emailIsRegistered(element[this.speakers], aux => {
              if (!aux) {
                this.auth.register(element[this.speakers], user => {
                  let newUser = new User()
                  newUser.type = TypeUser.USER;
                  newUser.email = user.email;
                  newUser.uid = user.uid;
                  this.dao.updateUser(newUser);
                  this.dao.insertSpeaker(this.eventId, user);
                  newSession.speakers = element[user];
                  console.log("nao tinha email e criou")
                })
              } else {
                this.dao.uid(element[this.speakers], uid => {
                  this.dao.user(uid, user => {
                    this.dao.insertSpeaker(this.eventId, user);
                    newSession.speakers = element[user];
                    console.log("tinha email e criou")
                  })
                })
              }
            })
          }
          
          if(typeof element[this.group] !== 'undefined') {
            newSession.group = this.prepareTrackImport(element[this.group]);
          }
          
          this.sessionImports.push(newSession);
        }
        cont++;
      }
    }
    this.registreSessionImport();
    this.closeModal();
  }

  registreSessionImport() {
    for (const session of this.sessionImports) {
      this.dao.createSessionWithTracks(this.eventId, session);
    };
    console.log("criou")
  }

  exportFileSessions() {
    for (const session of this.sessions) {
      let row: any;
      row = this.preparesSessons(session);
      this.dataExportSessions.push(row);
    }



    const wscols: XLSX.ColInfo[] = [
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

    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(this.dataExportSessions);

    /* TEST: column props */

    ws['!cols'] = wscols;

    /* TEST: row props */

    ws['!rows'] = wsrows;

    /* generate workbook and add the worksheet */

    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */

    const wbout: string = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });
    saveAs(new Blob([this.s2ab(wbout)]), 'sessions.xlsx');
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


  verifyDate(x, y: number) {
    if ((x => 1 && x <= 12)) {
      this.day = y;
      this.month = x;
    } else {
      this.day = x;
      this.month = y;
    }
  }

  preparesSessons(session: Session) {
    const row = [];
    
    row.push(session.topic);
    row.push(this.regex.removeHtml(session.description));
    row.push(session.date);
    row.push(session.startTime);
    row.push(session.endTime);
    row.push(session.speakers); // speakers

    return row;
  }

  private load(){
    this.dao.sessions(this.eventId, (list) => {
      this.sessions = list;
  
      for (let session of this.sessions) {
        this.dao.event(this.eventId, (event) => {
          session.date = this.date.getTimeStampOnlyDate(session.date, event.timezone)
          session.startTime = this.date.getTimeStampOnlyHours(session.startTime, event.timezone)
          session.endTime = this.date.getTimeStampOnlyHours(session.endTime, event.timezone)
        })
      }
  
      this.loading = false;
    });
  
    this.dao.tracksSession(this.eventId, (tracks) => {
      this.tracks = [];
      this.tracks = tracks;
    });
  
  }
  
  private loadTrack(){
    this.dao.tracksSession(this.eventId, (tracks) => {
      this.tracks = [];
      this.tracks = tracks;
    });
  }
  
  
  createTrack(data){
    if(data.group_name.length > 0){
      this.dao.checkNameTrackSession(data.group_name, this.eventId, exist =>{ //check if track exist.
        if(!exist){
          let newTrack = new Track();  
          newTrack.name = data.group_name;
          newTrack.description = data.group_description;
          this.dao.createTrackSession(this.eventId, newTrack);
        }
      });
    }
  }

  private removeTrack(track : Track){
    this.dao.removeTrackSession(this.eventId, track);
  }


  createTrackSessionImport(session: Session, group){
    if(group.length > 0){
      for(const name of group){
        if(name.length > 0){
          this.dao.checkNameTrackSession(name, this.eventId, exist =>{ //check if track exist.
            if(exist){
              this.dao.trackSessionSearchByName(name, this.eventId, (track) => {
                this.dao.checkUserOnTreck(track.uid, session.id, exist => {
                  if(!exist){
                    this.dao.insertSessionTrackSession(track.uid, session.id);
                    this.load();
                  }
                });
              });  
            }
            else{
              let newTrack = new Track();  
              newTrack.name = name;
              /*this.dao.createTrackAttendee(this.eventId, newTrack);
              this.dao.trackSearchByName(newTrack.name, this.eventId, (track) =>{ // corrigir
                this.dao.insertUserTrackAttendee(track.uid, attendee.uid);
                this.load();
              });*/
              this.dao.RegisterTrackSession(this.eventId, newTrack, result => {
                if(result){
                  this.dao.trackSessionSearchByName(newTrack.name, this.eventId, (track) =>{ // corrigir
                    this.dao.insertSessionTrackSession(track.uid, session.id);
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

    /**
    prepare the attendees tracks import
  * @param {string} groupd
    @memberof AteendeesComponent
   */
  prepareTrackImport(group: string){
    const tracks = group.split(";");
    return tracks;
  }

}
