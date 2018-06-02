import { Component, OnInit } from '@angular/core';

declare let $: any;

@Component({
  selector: 'app-add-modules',
  templateUrl: './add-modules.component.html',
  styleUrls: ['./add-modules.component.css']
})
export class AddModulesComponent implements OnInit {

  constructor() { }

  ngOnInit() {

    $(document).ready(function() {
      $('select').material_select();
    });

  }

}
