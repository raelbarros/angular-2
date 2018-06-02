import { DaoService } from '../../../services/dao/dao.service';
import { AuthService } from '../../../services/auth/auth.service';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from '../../../../models/user';
import { GlobalVariablesService } from "../../../services/global-variables/global-variables.service";
import { ActivatedRoute, Router } from "@angular/router";
import { AppStrings } from "../../../services/app-strings/app-strings.service";
import { TypeUser } from '../../../services/type-user/type-user.service';
import { Track } from '../../../../models/track';
declare let $: any;

@Component({
  selector: 'app-attendees',
  templateUrl: './create-attendee.component.html',
  styleUrls: ['./create-attendee.component.css']
})

export class CreateAttendeeComponent implements OnInit {
  public formAttendee: FormGroup;
  eventId: string = null;
  passwordDefault = '123456';
  alreadyExists = false; //check if user exist
  auxUid = null;
  auxType = null;
  auxPassword = null;
  tracks: Array<Track> = []; // array with event tracks
  selectedTracks: Array<string> = []; // array with selected attendees 

  source = []; // array do auto-complete
  filteredList = []; // armazena as sugestões exibidas pelo auto-complete
  query = "";// string digitada pelo usuário
  elementRef = "";

  constructor(
    private dao: DaoService,
    private auth: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.eventId = this.route.params['value']['eventId'];
    this.alreadyExists = false;
    this.selectedTracks = [];

    if (this.eventId === null || typeof this.eventId === undefined || this.eventId === 'undefined') {
      this.router.navigate([AppStrings.ROUTER_DASHBOARD_CLIENT]);
    }

    this.formAttendee = new FormGroup({
      email: new FormControl('', Validators.compose([Validators.required, Validators.email, Validators.maxLength(30)])),
      name: new FormControl('', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(40)])),
      description: new FormControl('', Validators.compose([Validators.maxLength(300)])),
      company: new FormControl(''),
      track: new FormControl(''),
      title: new FormControl(''),
      facebook: new FormControl(''),
      instagram: new FormControl(''),
      twitter: new FormControl(''),
      linkedin: new FormControl(''),
      website: new FormControl(''),
    });

    this.dao.tracksAttendee(this.eventId, (tracks) => {
      this.tracks = [];
      this.tracks = tracks;

      for (const track of tracks) {
        this.source.push(track.name); // add 
      }

      //this.autoComplete();
      //this.initChipsMaterialize(this.selectedTracks);
    });
  }

  /**'
   * add event attendee
   * @param {FormGroup.value} data
   * @memberof CreateAttendee
   */

  insertAttendee(data) {
    const attendee = new User();

    if (typeof data.email != 'undefined' && data.email.length > 0) {
      attendee.email = data.email;
    }

    if (typeof data.name != 'undefined' && data.name.length > 0) {
      attendee.name = data.name;
    }

    if (typeof data.description != 'undefined' && data.description.length > 0) {
      attendee.description = data.description;

    }


    if (typeof data.company != 'undefined' && data.company.length > 0) {
      attendee.company = data.company;
    }

    if (typeof data.title != 'undefined' && data.title.length > 0) {
      attendee.title = data.title;
    }

    if (typeof data.facebook != 'undefined' && data.facebook.length > 0) {
      attendee.facebook = data.facebook;
    }

    if (typeof data.instagram != 'undefined' && data.instagram.length > 0) {
      attendee.instagram = data.instagram;
    }

    if (typeof data.twitter != 'undefined' && data.twitter.length > 0) {
      attendee.twitter = data.twitter;
    }

    if (typeof data.linkedin != 'undefined' && data.linkedin.length > 0) {
      attendee.linkedin = data.linkedin;
    }

    if (typeof data.website != 'undefined' && data.website.length > 0) {
      attendee.website = data.website;
    }


    if (this.alreadyExists) {
      attendee.uid = this.auxUid;
      attendee.password = this.auxPassword;
      attendee.type = this.auxType; // qualquer tipo de user pode acessar o evento.
      this.dao.checkAttendeesEvent(this.eventId, attendee.uid, exist => {
        if (!exist) {
          this.dao.insertAttendee(this.eventId, attendee);
          this.insertUserTrackAttendee(attendee);
          this.dao.updateUser(attendee);
          this.router.navigate([AppStrings.ROUTER_ATTENDEES, { eventId: this.eventId }]);
        } else {
          console.log('usuário já existe no evento:)');
        }
      });
    } else {
      attendee.type = TypeUser.USER;
      attendee.password = this.passwordDefault;
      this.auth.register(attendee.email, (user) => {
        if (user !== null && user !== undefined) {
          attendee.uid = user.uid;
          this.dao.createUser(attendee);
          this.dao.insertAttendee(this.eventId, attendee);
          this.insertUserTrackAttendee(attendee);
          this.router.navigate([AppStrings.ROUTER_ATTENDEES, { eventId: this.eventId }]);
        }
      });
    }
  }

  /**'
  * check if user exist
  * @param {FormGroup.value} data
  * @memberof CreateAttendee
  */


  checkEmail(data) {
    this.dao.uid(data.email, (uid) => {
      if (uid !== null && uid !== undefined) {
        this.auxUid = uid;

        this.dao.user(uid, (user) => {
          this.auxType = user.type;
          this.auxPassword = user.password;
          this.formAttendee.patchValue({
            name: user.name,
            email: user.email,
            description: user.description,
            company: user.company,
            title: user.title,
            facebook: user.facebook,
            instagram: user.instagram,
            twitter: user.twitter,
            linkedin: user.linkedin,
            website: user.website,
          });

          //$('input').prop('disabled', true);
          // $('textarea').prop('disabled', true);
          this.alreadyExists = true;
        });
      } else {
        this.alreadyExists = false;
      }
    });
  }

  /**'
   * add user track attendee
   * @param {User} attendee
   * @memberof CreateAttendee
   */

  private insertUserTrackAttendee(attendee: User) {
    if (attendee.uid !== null && attendee.uid !== undefined) {
      for (const name of this.selectedTracks) {
        this.dao.trackSearchByName(name, this.eventId, track => {
          this.dao.insertUserTrackAttendee(track.uid, attendee.uid);
        });
      }
    }
  }
  //          Auto-Complete



  filter() { // filtra o array source e armazena o resultado no filteredList.
    if (this.query !== "") {
      this.filteredList = this.source.filter(function (el) {
        return el.toLowerCase().indexOf(this.query.toLowerCase()) > -1;
      }.bind(this));
    } else {
      this.filteredList = [];
    }
  }

  select(item) {
    this.query = item;
    this.filteredList = [];
  }


}
