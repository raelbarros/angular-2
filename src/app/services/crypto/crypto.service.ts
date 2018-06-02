import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable()
export class CryptoService {

  constructor() { }
  key = 'b3-2018-app';
  //  chave antiga = a1b2d3

  encrypt(password) {
    let aux = CryptoJS.AES.encrypt(password, this.key);
    let cipher = aux.toString();
    return cipher;
  }

  decrypt(password) { 
    let bytes = CryptoJS.AES.decrypt(password, this.key);
    let decipher = bytes.toString(CryptoJS.enc.Utf8);
    return decipher;
  }

}
