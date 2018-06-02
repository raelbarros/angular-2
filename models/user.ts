import { Event } from "./event";
/**
 * Represents a user with firebase db data
 * @attribute uid
 * @attribute name
 * @attribute email
 * @attribute company
 * @attribute title
 * @attribute description
 * @attribute type
 * @attribute events
 * @attribute facebook
 * @attribute instagram
 * @attribute twitter
 * @attribute linkedin
 * @attribute website
 * @attribute picture
 * @attribute selfEditLink
 * @attribute group
 * @attribute aboutMe
 * @export
 * @class User
 */
export class User {
  uid: string;
  name: string;
  email: string;
  company: string;
  title: string;
  description: string;
  type: number;
  events;
  facebook: string;
  instagram: string;
  twitter: string;
  linkedin: string;
  website: string; 
  picture:string;
  selfEditLink:string;
  group: Array <string>;
  aboutMe: string;
  password: string;

  constructor(){
    this.uid = "";
    this.name = "";
    this.email = "";
    this.company = "";
    this.title = "";
    this.description = "";
    this.type = 0;
    this.facebook = "";
    this.instagram = "";
    this.twitter = "";
    this.linkedin = "";
    this.website = "";
    this.picture = "";
    this.selfEditLink = "";
    this.aboutMe = "";
    this.password = "";
  }




}
 


