import {Modules} from './modules';
import {User} from './user'
/**
 * Represents an app (event)
 * @attribute name
 * @attribute uid
 * @attribute language
 * @attribute description
 * @attribute startDate  subdomain: any;

 * @attribute endDate
 * @attribute timezone
 * @attribute placeName
 * @attribute placeAddress
 * @attribute appDesign
 * @attribute modules
 * @attribute name
 * @attribute url
 * @attribute site
 * @attribute numberAttendee
 * @attribute client
 * @attribute emailSupport
 * @export
 * @class Event
 */
export class Event {
  uid: string;
  type:number;
  name: string;
  language: string;
  description: string;
  startDate: number;
  endDate: number;
  timezone: string;
  placeName: string;
  placeAddress: string;
  url: string;
  site: string;
  subdomain: string;
  client: string;
  emailSupport: string;
  numberAttendee: number;
  modules: Modules;
  
  constructor() {
  }
}
