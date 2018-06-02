import { Component, OnInit } from '@angular/core';
import { AppStrings } from '../../services/app-strings/app-strings.service';
import { Router } from '@angular/router';

declare let $: any;

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.css']
})
export class FaqComponent implements OnInit {
  ROUTER_MANAGE_EMPLOYEE = AppStrings.ROUTER_MANAGE_EMPLOYEE;
  ROUTER_FAQ = AppStrings.ROUTER_FAQ;

  constructor(private router: Router) { }

  ngOnInit() {
    $(document).ready(function(){
      $('.collapsible').collapsible();
    });
  }

  openPage(page: string) {
    this.router.navigate([page]);
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

}
