import { Injectable } from '@angular/core';

@Injectable()
export class DateService {

  constructor() {
  }

  criateTimeStamp(data) {
    /** Converte para number o valor recebido pelo parametro
     * A converção serve para mandar como os valores na ordem correta na funcao Date
     */
    const day = Number(data.getDate());
    const month = Number(data.getMonth());
    const year = Number(data.getFullYear());
    const hours = Number(data.getHours());
    const min = Number(data.getMinutes());

    /** Passa os valores convertidos na funcao Date e gera o timestamp atraves do getTime()/1000 */
    const timeStamp = new Date(year, month, day, hours, min).getTime() / 1000;

    return timeStamp;
  }

  /** Recebe o TimeStamp e o Timezone do banco e formata a data para o tipo do fuzoHorario do evento 
   * Returna somente a Data
  */
  getTimeStampOnlyDate(val, timezone) {
    let result;

    /** opcao de formatacao da Data */
    const options = { year: 'numeric', month: 'numeric', day: 'numeric' };

    switch (timezone) {
      case 'GMT -3:00': {
        result = new Date(val * 1000).toLocaleDateString('pt-BR', options);
        break;
      }
      case 'GMT -8:00': {
        result = new Date(val * 1000).toLocaleDateString('en-GB', options);
        break;
      }
    }
    return result;
  }

  /** Recebe o TimeStamp e o Timezone do banco e formata a data para o tipo do fuzoHorario do evento 
   * Returna somente a Hora
  */
  getTimeStampOnlyHours(val, timezone) {
    let result;
    const options = { hour: 'numeric', minute: 'numeric' };

    switch (timezone) {
      case 'GMT -3:00': {
        result = new Date(val * 1000).toLocaleTimeString('pt-BR', options);
        break;
      }
      case 'GMT -8:00': {
        result = new Date(val * 1000).toLocaleTimeString('en-US', options);
        break;
      }
    }

    return result;
  }

  /** Recebe o TimeStamp e o Timezone do banco e formata a data para o tipo do fuzoHorario do evento 
   * Returna a Date e a Hora
  */
  getFullTimeStamp(val, timezone) {
    let result;
    const options = { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric' };

    switch (timezone) {
      case 'GMT -3:00': {
        result = new Date(val * 1000).toLocaleDateString('pt-BR', options);
        break;
      }
      case 'GMT -8:00': {
        result = new Date(val * 1000).toLocaleDateString('en-US', options);
        break;
      }
    }

    return result;
  }

  /** Verifica se o formato da hora eh 24h
   *  Se verdadeiro, returna true no callback
  */
  checkFormatHours(val, onResolve) {
    const checkTime = String(val);

    const temp = checkTime.split(' ');
    const AMPM = temp[1];

    if (AMPM === 'undefined') {
      onResolve(true);
    } else {
      onResolve(false);
    }
  }

  /** Converte uma hora 12h para 24h */
  convertTime12to24(time12h) {
    const val = String(time12h);

    const temp = val.split(' ');
    const time = temp[0];
    const AMPM = temp[1];

    const aux = time.split(':');

    let hours = Number(aux[0]);
    const min = Number(aux[1]);

    if (AMPM === 'AM' && hours === 12) {
      hours -= 12;
    }
    if (AMPM === 'PM' && hours < 12) {
      hours += 12;
    }

    let sHours = String(hours);
    let sMinutes = String(min);

    /** Acrescenta o 0 na frente se o numero for menor que 10 */
    if (hours < 10) {
      sHours = '0' + sHours;
    }
    if (min < 10) {
      sMinutes = '0' + sMinutes;
    }

    return (sHours + ':' + sMinutes);
  }

}
