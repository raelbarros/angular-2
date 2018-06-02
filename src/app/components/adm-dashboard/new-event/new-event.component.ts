import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppStrings } from '../../../services/app-strings/app-strings.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from '../../../../models/user';
import { Event } from '../../../../models/event';
import { DaoService } from '../../../services/dao/dao.service';
import { AuthService } from '../../../services/auth/auth.service';
import { FormControlName } from '@angular/forms/src/directives/reactive_directives/form_control_name';
import { RegexService } from '../../../services/regex/regex.service';

declare let $: any;

@Component({
  selector: 'app-new-event',
  templateUrl: './new-event.component.html',
  styleUrls: ['./new-event.component.css']
})

export class NewEventComponent implements OnInit {

  formGroup : FormGroup;

  ROUTER_DASHBOARD = AppStrings.ROUTER_DASHBOARD;
  urlDefault = 'b3app.com/#/';
  msgError;
  saved = false;
  

  constructor(
    private router: Router, 
    private db: DaoService, 
    private auth: AuthService, 
    private regex: RegexService) { 

  }

  ngOnInit() {
    this.formGroup = new FormGroup({
      name: new FormControl('', Validators.compose([Validators.required, Validators.maxLength(50)])),
      //email: new FormControl('', Validators.compose([Validators.required, Validators.email, Validators.maxLength(40)])),
      email: new FormControl(''),
      startDate: new FormControl('', Validators.required),
      endDate: new FormControl('', Validators.required),
      package: new FormControl(''),
      url: new FormControl(''),
      numberAttendee: new FormControl('')
    });

    $('.datepicker').pickadate({
      selectMonths: true, // Creates a dropdown to control month
      selectYears: 15, // Creates a dropdown of 15 years to control year,
      today: 'Today',
      clear: 'Clear',
      close: 'Ok',
      closeOnSelect: false // Close upon selecting a date,
    });

    $(document).ready(function () {
      $('select').material_select();
    });

    $(function() {

      var checkbox = $("#attendeePackage");
      var hidden = $("#hidden_fields");

      hidden.hide();

      checkbox.change(function() {

        if (checkbox.is(':checked')) {

          hidden.show();

        } else {

          hidden.hide();

        }
      });
    });

    $('.limited').on('change', function() {
      if($('.limited:checked').length > 1) {
          this.checked = false;
      }
   });

  }

  openPage(page: string) {
    this.router.navigate([page]);
  }

  createEvent(data) {
    const email = data.email;
    
    let startDateInput = $('#startDate').val();
    let endDateInput = $('#endDate').val();

    const newEvent = new Event()
    newEvent.name = data.name;
    newEvent.startDate = new Date(startDateInput).getTime() / 1000;
    newEvent.endDate = new Date(endDateInput).getTime() / 1000;
    newEvent.numberAttendee = data.numberAttendee;

    if(email.length > 0){
      newEvent.type = 0;
      if(this.validateForm(newEvent, email)){
        newEvent.url = this.urlDefault + newEvent.name;
        this.registerEvent(newEvent, email);
      }
    }else{
      newEvent.type = 1;
      if(this.validateForm(newEvent, email)){
        newEvent.url = this.urlDefault + newEvent.name;
        this.registerEventB3App(newEvent);
      }
    }
  }

  private validateForm(event: Event, email: string) {
    let validate = true;

    if (event.name.length <= 0) {
      this.msgError = "Digite o nome do evento.";
      validate = false;
    }
    
    if(event.type === 0){
      if (!this.regex.validateEmail(email) && validate) {
        this.msgError = "E-mail inválido.";
        validate = false;
      }
    }

    if (event.startDate !== event.startDate && validate) {
      this.msgError = "Digite a data de início.";
      validate = false;
    }

    if (event.endDate !== event.endDate && validate) {
      this.msgError = "Digite a data de encerramento.";
      validate = false;
    }

    return validate;  
  }

  private registerEventB3App(newEvent: Event){
    this.checkNameEvent(newEvent, checkName =>{
        if(checkName){
          this.db.createEventB3App(newEvent);
          this.openPage(AppStrings.ROUTER_DASHBOARD)
          this.saved = true;
          if (this.saved) {
            alert("Evento Criado com Sucesso!");// corrigir
          }
        }
    });  
  } 


  private registerEvent(newEvent: Event, email: string) {
    this.checkNameEvent(newEvent, checkName => {
      if(checkName){
        this.checkEmailClient(email, checkClient => {
            if(checkClient){
              this.db.emailFromClient(email, idClient => {
                this.db.client(idClient, resulClient => {
                  let client = new User();
                  client = resulClient;
                  client.uid = idClient;
                  newEvent.client = client.uid;
                  this.db.createEvent(client, newEvent);
                  this.openPage(AppStrings.ROUTER_DASHBOARD)
                  this.saved = true;
                  if (this.saved) {
                    alert("Evento Criado com Sucesso!");// corrigir
                  }
                });
              })
            }
        });       
      }
    });
  }
  
  private checkEmailClient(email, onReSolve) {
    this.db.clients(clients => {
      if(clients.length >= 1){
        const sizeListClients = clients.length
        let cont = 0;
        let flag = false;
        
        for(const client of clients){
          if(email === client.email){
            flag = true;
            onReSolve(true);
          }
          cont++;
        }

        if(sizeListClients === cont && !flag){
          alert('Cliente não existe');
          onReSolve(false);
        }
      }else{
        alert('Cliente não existe.');
        onReSolve(false)
      }
    })
  }

  private checkNameEvent(newEvent: Event, onReSolve){
    this.db.events(listEvents =>{
      const sizeListEvents = listEvents.length
      let cont = 0;
      let flag = false;

      if(sizeListEvents >= 1){
        for(const event of listEvents){
          if(newEvent.name === event.name){
            flag = true;
            alert('Evento ' + newEvent.name + ' já existe.');
            onReSolve(false)
          }
          cont++;
        }
        
        if(cont == sizeListEvents && !flag){
          onReSolve(true);
        }
      }else{
        onReSolve(true);
      }
    });
  }



}
