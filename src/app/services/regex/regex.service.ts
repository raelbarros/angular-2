import { Injectable } from '@angular/core';

@Injectable()

export class RegexService{
    constructor() {}

    public validateName(text: string){
        const regex = /^[A-Z][A-Za-z1-9 ]*$/;
        return regex.test(text);
    }
    
    public validateEmail(email){
        const regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return regex.test(email);
    }

    public removeHtml(text: string){
       let newText = '';
       const regex = /(<([^>]+)>)/ig;
        
       if(text !== null && typeof text !== 'undefined' ){
           newText = text.replace(regex, '');
        }
     
       return newText;
    }

}