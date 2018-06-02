import { Injectable } from '@angular/core';

@Injectable()
export class TypeUser{
  static SUPERGOD = 4;
  static GOD = 3;
  static CLIENT= 2;
  static EMPLOYEE = 1;
  static USER = 0;
  
  constructor() { }

}
