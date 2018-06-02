import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DaoService } from '../../../services/dao/dao.service';
import { User } from '../../../../models/user';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { AuthService } from '../../../services/auth/auth.service';
import { AppStrings } from '../../../services/app-strings/app-strings.service';
import { database } from 'firebase/app';
import { TypeUser } from '../../../services/type-user/type-user.service';

declare let $: any;
type AOA = Array<Array<any>>;

@Component({
  selector: 'app-speakers',
  templateUrl: './speakers.component.html',
  styleUrls: ['./speakers.component.css']
})

export class SpeakersComponent implements OnInit {
  ROUTER_CREATE_SPEAKER = AppStrings.ROUTER_CREATE_SPEAKER;
  ROUTER_EDIT_SPEAKER = AppStrings.ROUTER_EDIT_SPEAKER;

  speakersEvent: Array<User> = [];
  newSpeakers: Array<User> = [];
  messageErrors: Array<string> = [];

  eventId: string = null;

  passwordDefault = '123456';
  emailDefault = 'joaosilva@b3app.com';

  theError = false;

  data: any;

  name = 0;
  email = 1;
  company = 2;
  title = 3;
  description = 4;
  website = 5;
  facebook = 6;
  twitter = 7;
  linkedin = 8;
  picture = 9;
  selfEditLink = 10;

  dataExportTemplate: AOA = [[
    'Name',
    'Email',
    'Company',
    'Title',
    'Description',
    'Website',
    'Facebook',
    'Twitter',
    'Linkedin'
  ],
  [
    'João da Silva',
    'joaosilva@b3app.com',
    'B3App Corp',
    'Gerente de Contas',
    '20 anos de experiência em atendimento ao cliente, liderança de equipe e projetos',
    'www.b3app.com',
    'www.fb.com/joaob3app',
    'www.twitter.com/joaob3app',
    'www.linkedin.com/in/joaob3app'
  ]
  ];

  dataExportSpeakers: AOA = [[
    'Name',
    'Email',
    'Company',
    'Title',
    'Description',
    'Website',
    'Facebook',
    'Twitter',
    'Linkedin'
  ]];

  constructor(private dao: DaoService,
    private router: Router,
    private auth: AuthService,
    private route: ActivatedRoute
  ) {
    // the "href" attribute of the modal trigger must specify the modal ID that wants to be triggered
  }

  ngOnInit() {
    this.eventId = this.route.params['value']['eventId'];

    if (this.eventId === null || this.eventId === undefined) {
      this.router.navigate([AppStrings.ROUTER_DASHBOARD_CLIENT]);
    }

    this.dao.speakers(this.eventId, (speakers) => {
      this.speakersEvent = [];
      this.speakersEvent = speakers;
    });


  }

  openPage(page: string) {
    this.router.navigate([page, { eventId: this.eventId }]);
  }

  openPageInfo(page: string, index: number) {
    console.log("ok", index)
    this.router.navigate([page, { eventId: this.eventId, profileId: this.speakersEvent[index].uid }]);
  }

  openModal() {
    this.theError = false;
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

  preparesSpeaker(speaker: User) {
    const row = [];

    row.push(speaker.name);
    row.push(speaker.email);
    row.push(speaker.company);
    row.push(speaker.title);
    row.push(speaker.description);
    row.push(speaker.website);
    row.push(speaker.facebook);
    row.push(speaker.twitter);
    row.push(speaker.linkedin);

    return row;
  }

  createArrayAux(data: Array<User>) {
    const aux: Array<User> = [];

    for (const element of data) {
      aux.push(element);
    }
    aux.shift();
    return aux;
  }

  importSpeakers() {
    const aux = this.createArrayAux(this.data);
    this.messageErrors = [];
    let validate_error = true;
    if (aux.length > 0) {
      let row = 2;
      for (const element of aux) {
        const newSpeaker = new User();

        if (this.validateEmail(element[this.email])) {
          if (element[this.email] !== this.emailDefault) {
            newSpeaker.email = element[this.email];
          } else {
            validate_error = false;
            const column = this.checkLetterCols(this.email);
            this.messageErrors.push(column + row);
          }
        } else {
          validate_error = false;
          const column = this.checkLetterCols(this.email);
          this.messageErrors.push(column + row);
          this.theError = true;
        }

        if (typeof element[this.name] !== 'undefined') { // fazer função validar nome. 
          newSpeaker.name = element[this.name];
        } else {
          validate_error = false;
          const column = this.checkLetterCols(this.name);
          this.messageErrors.push(column + row);
        }

        if (typeof element[this.title] !== 'undefined') {
          newSpeaker.title = element[this.title];
        }

        if (typeof element[this.company] !== 'undefined') {
          newSpeaker.company = element[this.company];
        }

        if (typeof element[this.description] !== 'undefined') {
          newSpeaker.description = element[this.description];
        }

        if (typeof element[this.website] !== 'undefined') {
          newSpeaker.website = element[this.website];
        }

        if (typeof element[this.facebook] !== 'undefined') {
          newSpeaker.facebook = element[this.facebook];
        }

        if (typeof element[this.twitter] !== 'undefined') {
          newSpeaker.twitter = element[this.twitter];
        }

        if (typeof element[this.linkedin] !== 'undefined') {
          newSpeaker.linkedin = element[this.linkedin];
        }

        if (typeof element[this.picture] !== 'undefined') {
          newSpeaker.picture = element[this.picture];
        }

        if (typeof element[this.selfEditLink] !== 'undefined') {
          newSpeaker.selfEditLink = element[this.selfEditLink];
        }
        this.newSpeakers.push(newSpeaker);
        row++;
      }

      if (validate_error) {
        for (const speaker of this.newSpeakers) {
          this.registreSpeakersImport(speaker);
          this.closeModal();
        }
      } else {
        this.theError = true;
      }
    }
  }

  registreSpeakersImport(speaker: User) {
    this.auth.emailIsRegistered(speaker.email, check => {
      if (check) {
        this.dao.uid(speaker.email, uid => {
          speaker.uid = uid;
          this.dao.user(speaker.uid, oldSpeaker => {
            speaker.type = oldSpeaker.type;
            speaker.password = oldSpeaker.password;
            if (!this.checkSpeakerEvent(speaker)) {
              this.dao.updateUser(speaker);
              this.dao.insertSpeaker(this.eventId, speaker)
            } else {
              this.updateSpeakerEvent(speaker);
            }
          })
        })
      } else {
        this.auth.register(speaker.email, user => {
          speaker.uid = user.uid;
          speaker.type = TypeUser.USER;
          speaker.password = this.passwordDefault;
          this.dao.createUser(speaker);
          this.dao.insertSpeaker(this.eventId, speaker);
        });
      }
    })
  }


  checkSpeakerEvent(newSpeaker: User) {
    let result = false;

    for (const speaker of this.speakersEvent) {
      if (newSpeaker.uid === speaker.uid) {
        result = true;
      }
    }
    return result;
  }

  exportFileSpeakers() {
    for (const speaker of this.speakersEvent) {
      let row: any;
      row = this.preparesSpeaker(speaker);
      this.dataExportSpeakers.push(row);
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
      { wpx: 100 }, // "pixels"
      { hidden: false } // hide column
    ];

    /* At 96 PPI, 1 pt = 1 px */
    const wsrows: XLSX.RowInfo[] = [
      { hpx: 25 }, // "pixels"
    ];

    /* generate worksheet */
    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(this.dataExportSpeakers);

    /* TEST: column props */
    ws['!cols'] = wscols;

    /* TEST: row props */
    ws['!rows'] = wsrows;

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    const wbout: string = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });
    saveAs(new Blob([this.s2ab(wbout)]), 'speakers.xlsx');
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

  updateSpeakerEvent(speaker: User) {
    this.dao.updateUserSpeaker(speaker, result => {
      this.dao.speakers(this.eventId, (speakers) => {
        this.speakersEvent = [];
        this.speakersEvent = speakers;
      });
    })
  }

}



