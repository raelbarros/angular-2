import {Component, OnInit, AfterViewChecked} from '@angular/core';
import {FormGroup, FormControl, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {AuthService} from '../../services/auth/auth.service';
import {DaoService} from '../../services/dao/dao.service';
import {User} from '../../../models/user';
import {AppStrings} from "../../services/app-strings/app-strings.service";

declare let $: any;

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit, AfterViewChecked {

  // Used to inform view if there is an error
  public hasError = false;

  // Recieves the error string from firebase
  public error = '';

  // Used to attach html form to ts component file
  public formGroup: FormGroup;

  // Used to inform view if it should display loading indicator
  public loading = true;

  // Used to check if we can initialize materialize css
  public cssDone = false;

  /**
   * Creates an instance of RegisterComponent and injects the services needed
   * @param {AuthService} authService
   * @param {DaoService} daoService
   * @param {Router} router
   * @memberof RegisterComponent
   */
  constructor(private authService: AuthService, private daoService: DaoService, private router: Router) {
  }

  /**
   * Called whenever the view initializes.
   * Inside this function we setup the link between the html form and the component
   * @memberof RegisterComponent
   */
  ngOnInit() {
    this.formGroup = new FormGroup({
      name: new FormControl('', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(40)])),
      email: new FormControl('', Validators.compose([Validators.required, Validators.email, Validators.maxLength(30)])),
      password: new FormControl('', Validators.compose([Validators.required, Validators.minLength(8)])),
      company: new FormControl(''),
      userType: new FormControl(0),
      title: new FormControl(''),
      description: new FormControl(''),
      facebook: new FormControl(''),
      instagram: new FormControl(''),
      twitter: new FormControl(''),
      linkedin: new FormControl('')
    });
  }

  /**
   * Called whenever the view makes an evaluation.
   * Inside this function we check if we have to initialize materialize css
   * @memberof RegisterComponent
   */
  ngAfterViewChecked() {
    if (!this.cssDone) {
      this.initMaterializeCSS();
      this.cssDone = true;
    }
  }

  /**
   * Receives the register button click event and attempts to register user
   * @param {any} data User input taken from html form
   * @memberof RegisterComponent
   */
  registerClick(data) {
    data.userType = $('#user-type').val();
    this.authService.registerUser(data.email, data.password, (firebaseUser) => {
      if (firebaseUser) {
        const user = new User();
        user.uid = firebaseUser.uid;
        user.name = data.name;
        user.company = data.company;
        user.type = data.userType;
        user.description = data.description;
        user.facebook = data.facebook;
        user.instagram = data.ins;
        user.twitter = data.instagram;
        user.linkedin = data.linkedin;

        this.daoService.updateUser(user);
        this.router.navigate([AppStrings.ROUTER_DASHBOARD]);
      }
    });
  }

  /**
   * Initialize materialize css library
   * Check http://materializecss.com/ docs for more information
   * @private
   * @memberof RegisterComponent
   */
  private initMaterializeCSS() {
    $('select').material_select();
  }
}
