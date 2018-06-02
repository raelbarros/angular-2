import { DaoService } from '../../../services/dao/dao.service';
import { AuthService } from '../../../services/auth/auth.service';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from '../../../../models/user';
import { ActivatedRoute, Router } from "@angular/router";
import { GlobalVariablesService } from "../../../services/global-variables/global-variables.service";
import { AppStrings } from "../../../services/app-strings/app-strings.service";
import { TypeUser } from '../../../services/type-user/type-user.service';


declare let $: any;

@Component({
  selector: 'app-speakers',
  templateUrl: './create-speaker.component.html',
  styleUrls: ['./create-speaker.component.css']
})

export class CreateSpeakerComponent implements OnInit {
  alreadyExists = false;
  eventId: string = null;
  passwordDefault = '123456';
  auxType = null;
  auxPassword = null;
  public formSpeaker: FormGroup;

  private tempUid: string; // AUXILIAR PARA GUARDAR O UID QUANDO O USUARIO JA EXISTIR

  constructor(private dao: DaoService, private auth: AuthService, private router: Router,
    private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.eventId = this.route.params['value']['eventId'];
    this.alreadyExists = false;

    if (this.eventId === null || this.eventId === undefined) {
      this.router.navigate([AppStrings.ROUTER_DASHBOARD_CLIENT]);
    }

    this.formSpeaker = new FormGroup({
      email: new FormControl('', Validators.compose([Validators.required, Validators.email, Validators.maxLength(40)])),
      name: new FormControl('', Validators.compose([Validators.maxLength(50)])),
      description: new FormControl('', Validators.compose([Validators.maxLength(300)])),
      company: new FormControl(''),
      title: new FormControl(''),
      facebook: new FormControl(''),
      instagram: new FormControl(''),
      twitter: new FormControl(''),
      linkedin: new FormControl(''),
      website: new FormControl(''),
    });
  }

  checkEmail(data) {
    this.dao.uid(data.email, (uid) => {
      if (uid !== null && uid !== undefined) {
        this.dao.user(uid, (user) => {
          this.tempUid = user.uid;
          this.auxType = user.type;
          this.auxPassword = user.password;
          this.formSpeaker.patchValue({
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
        });
        //$('input').prop('disabled', true);
        //$('textarea').prop('disabled', true);
        this.alreadyExists = true;
      } else {
        this.alreadyExists = false;
      }
    });
  }

  insertSpeaker(data) {
    const speaker = new User();

    if (typeof data.email != 'undefined' && data.email.length > 0) {
      speaker.email = data.email;
    }

    if (typeof data.name != 'undefined' && data.name.length > 0) {
      speaker.name = data.name;
    }

    if (typeof data.description != 'undefined' && data.description.length > 0) {
      speaker.description = data.description;
    }

    if (typeof data.company != 'undefined' && data.company.length > 0) {
      speaker.company = data.company;
    }

    if (typeof data.title != 'undefined' && data.title.length > 0) {
      speaker.title = data.title;
    }

    if (typeof data.facebook != 'undefined' && data.facebook.length > 0) {
      speaker.facebook = data.facebook;
    }

    if (typeof data.instagram != 'undefined' && data.instagram.length > 0) {
      speaker.instagram = data.instagram;
    }

    if (typeof data.twitter != 'undefined' && data.twitter.length > 0) {
      speaker.twitter = data.twitter;
    }

    if (typeof data.linkedin != 'undefined' && data.linkedin.length > 0) {
      speaker.linkedin = data.linkedin;
    }

    if (typeof data.website != 'undefined' && data.website.length > 0) {
      speaker.website = data.website;
    }

    if (this.alreadyExists) {
      speaker.uid = this.tempUid;
      speaker.password = this.auxPassword;
      speaker.type = this.auxType;
      /// fazer a função para verificar se o speaker já ta na lista de speakers
      this.dao.updateUser(speaker);
      this.dao.insertSpeaker(this.eventId, speaker);
      this.router.navigate([AppStrings.ROUTER_SPEAKERS, { eventId: this.eventId }]);
    } else {
      this.auth.register(data.email, (user) => {
        if (user !== null && user !== undefined) {
          speaker.uid = user.uid;
          speaker.password = this.passwordDefault;
          speaker.type = TypeUser.USER;
          this.dao.createUser(speaker);
          this.dao.insertSpeaker(this.eventId, speaker);
          this.router.navigate([AppStrings.ROUTER_SPEAKERS, { eventId: this.eventId }]);
        }
      });
    }
  }

}
