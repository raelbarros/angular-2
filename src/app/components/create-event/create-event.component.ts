import {AfterViewChecked, Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {Event} from '../../../models/event';
import {DaoService} from '../../services/dao/dao.service';
import {AuthService} from '../../services/auth/auth.service';

declare let $: any;

@Component({
  selector: 'app-create-event',
  templateUrl: './create-event.component.html',
  styleUrls: ['./create-event.component.css']
})
export class CreateEventComponent implements OnInit, AfterViewChecked {

  // Used to attach html form to ts component file
  public formGroup: FormGroup;

  // Used to inform view if it should display loading indicator
  public loading = true;

  // Used to check if we can initialize materialize css
  public cssDone = false;

  /**
   * Creates an instance of CreateEventComponent and injects the services needed
   * @param {DaoService} dao
   * @param {AuthService} authService
   * @param router
   * @memberof CreateEventComponent
   */
  constructor(private dao: DaoService, private authService: AuthService, private router: Router) {
  }

  /**
   * Called whenever the view initializes.
   * Inside this function we setup the link between the html form and the component
   * @memberof CreateEventComponent
   */
  ngOnInit() {
    this.formGroup = new FormGroup({
      name: new FormControl('', Validators.compose([Validators.required, Validators.maxLength(50)])),
      agendaModule: new FormControl('')
    });
  }

  /**
   * Initializes color picker and materialize css libraries.
   * @memberof CreateEventComponent
   */
  ngAfterViewChecked() {
    this.initColorPicker();
    this.initMaterializeCSS();
  }

  /**
   * Recieves create new app button click event and attempts to create new app (event)
   * @param {any} data User input taken from html form
   * @memberof CreateEventComponent
   */
  createNewApp(data) {
    // TODO: arrumar

    /*data.agendaModule = $('#agenda').prop('checked');

    const eventDict = new Map<string, any>();
    eventDict['name'] = data.name;
    eventDict['agendaModule'] = data.agendaModule;
    this.dao.createEvent(this.userSession.user, new Event(), (eventId) => {
      this.userSession.eventId = eventId;
      this.router.navigate(['eventInfo']);
    });*/
  }

  /**
   * Initializes materialize css library
   * Check http://materializecss.com/ docs form more information
   * @private
   * @memberof CreateEventComponent
   */
  private initMaterializeCSS() {
    if (!this.cssDone) {
      $('select').material_select();
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

  /**
   * Initializes color picker library
   * Check http://www.eyecon.ro/colorpicker/ docs for more information
   * @private
   * @memberof CreateEventComponent
   */
  private initColorPicker() {
    $('#primary-color').ColorPicker({
      color: '#fff',
      onShow: function (colpkr) {
        $(colpkr).fadeIn(500);
        return false;
      },
      onHide: function (colpkr) {
        $(colpkr).fadeOut(500);
        return false;
      },
      onChange: function (hsb, hex, rgb) {
        const query = $('#primary-color');
        query.find('input').css('background-color', '#' + hex);
        query.find('label').text(hex);
      }
    });

    $('#secondary-color').ColorPicker({
      color: '#fff',
      onShow: function (colpkr) {
        $(colpkr).fadeIn(500);
        return false;
      },
      onHide: function (colpkr) {
        $(colpkr).fadeOut(500);
        return false;
      },
      onChange: function (hsb, hex, rgb) {
        const query = $('#secondary-color');
        query.find('input').css('background-color', '#' + hex);
        query.find('label').text(hex);
      }
    });
  }
}
