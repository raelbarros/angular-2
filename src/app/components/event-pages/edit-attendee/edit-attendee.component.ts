import { Component, OnInit } from '@angular/core';
import { DaoService } from '../../../services/dao/dao.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AppStrings } from "../../../services/app-strings/app-strings.service";
import { User } from '../../../../models/user'
import { AuthService } from '../../../services/auth/auth.service';

declare let $: any;


@Component({
  selector: 'app-edit-attendee',
  templateUrl: './edit-attendee.component.html',
  styleUrls: ['./edit-attendee.component.css']
})

export class EditAttendeeComponent implements OnInit {
  profileId: string;
  eventId: string;
  public formAttendee: FormGroup;

  constructor(private dao: DaoService,
             private route: ActivatedRoute,
             private router: Router, 
             private auth: AuthService
  ) {
    this.profileId = route.params['value']['profileId'];
    this.loadInfo(this.profileId)
  }

  ngOnInit() {
    this.eventId = this.route.params['value']['eventId'];

    if (this.eventId === null || this.eventId === undefined) {
      this.router.navigate([AppStrings.ROUTER_DASHBOARD_CLIENT]);
    }

    this.formAttendee = new FormGroup({
      email: new FormControl(''),
      name: new FormControl(''),
      description: new FormControl(''),
      company: new FormControl(''),
      title: new FormControl(''),
      facebook: new FormControl(''),
      instagram: new FormControl(''),
      twitter: new FormControl(''),
      linkedin: new FormControl(''),
      website: new FormControl(''),
    });
  }

  loadInfo(uid) {
    this.dao.user(uid, (attendee) => {
      this.formAttendee.patchValue({
        name: attendee.name,
        email: attendee.email,
        description: attendee.description,
        company: attendee.company,
        title: attendee.title,
        facebook: attendee.facebook,
        instagram: attendee.instagram,
        twitter: attendee.twitter,
        linkedin: attendee.linkedin,
        website: attendee.website,
      });
    
      this.auth.currentUserUid().subscribe( (uid) =>{
        this.dao.user(uid, userLogged =>{
         if(userLogged.type <= attendee.type && userLogged.uid  != attendee.uid){
            $('input, button').prop('disabled', true);   
          }
        })
      })
    });
  }

  updateProfile(data) {
    this.dao.user(this.profileId, (user) =>{

      if (typeof data.name !== 'undefined') {
        user.name = data.name;
      }
  
      if (typeof data.email !== 'undefined' && data.email !== user.email) {
        this.auth.updateEmail(data.email, user)
        user.email = data.email;
      }
  
      if (typeof data.company !== 'undefined') {
        user.company = data.company;
      }
  
      if (typeof data.title !== 'undefined') {
        user.title = data.title;
      }
  
      if (typeof data.description !== 'undefined') {
        user.description = data.description;
      }
  
      if (typeof data.website !== 'undefined') {
        user.website = data.website;
      }
  
      if (typeof data.facebook !== 'undefined') {
        user.facebook = data.facebook;
      }
  
      if (typeof data.instagram !== 'undefined') {
        user.instagram = data.instagram;
      }
  
      if (typeof data.twitter !== 'undefined') {
        user.twitter = data.twitter;
      }
  
      if (typeof data.linkedin !== 'undefined') {
        user.linkedin = data.linkedin;
      }
  
      this.dao.updateUser(user);
      this.router.navigate([AppStrings.ROUTER_ATTENDEES, {eventId: this.eventId}]);
    })

  }

}
