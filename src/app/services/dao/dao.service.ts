import 'rxjs/add/operator/first';
import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';

import { CryptoService } from '../crypto/crypto.service'
import { TypeUser } from '../type-user/type-user.service';

import { Event } from '../../../models/event';
import { Session } from '../../../models/session';
import { User } from '../../../models/user';
import { Track } from '../../../models/track';

import { AttendeesComponent } from '../../components/event-pages/attendees/attendees.component';

@Injectable()
export class DaoService {
  private USERS_CHILD = '/users';
  private GOD_CHILD = '/god';
  private CLIENTS_CHILD = '/clients';
  private SUPERGOD_CHILD = '/supergod';
  private EMPLOYEE_CHILD = '/employee';

  // Firebase db events child
  private EVENTS_CHILD = '/events';
  private SESSIONS_CHILD = '/sessions';
  private SPEAKERS_CHILD = '/speakers';

  private ATTENDEES_CHILD = '/attendees';

  private TRACK_ATTENDEES_CHILD = '/track-attendee';
  private TRACK_ATTENDEES_MEMBERS_CHILD = '/track-attendee-members';

  private TRACK_SESSION_CHILD = '/track-session';
  private TRACK_SESSION_MEMBERS_CHILD = '/track-session-members';


  public EVENT_CLIENT = 0;
  public EVENT_B3App = 1;

  // Firebase db reference
  private db: firebase.database.Reference;

  /**
   * Creates an instance of DaoService and takes the firebase db reference
   * @memberof DaoService
   */
  constructor(
    private crypto: CryptoService
  ) {
    this.db = firebase.database().ref();
  }


  //                                   USER                                                                                                                                                                                           USER
  /**
   * uid survey of users. oberservation any type of user
   * @param {string} email
   * @param onResolve
   * @memberof DaoService
   */

  uid(email: string, onResolve) {
    const querySuperGod = this.db.child(this.SUPERGOD_CHILD).orderByChild('email').equalTo(email);
    querySuperGod.once('value')
      .then(function (snapshot) {
        snapshot.forEach(function (childSnapshot) {
          onResolve(childSnapshot.key);
          return true;
        });
      });

    const queryGod = this.db.child(this.GOD_CHILD).orderByChild('email').equalTo(email);
    queryGod.once('value')
      .then(function (snapshot) {
        snapshot.forEach(function (childSnapshot) {
          onResolve(childSnapshot.key);
          return true;
        });
      });

    const queryClient = this.db.child(this.CLIENTS_CHILD).orderByChild('email').equalTo(email);
    queryClient.once('value')
      .then(function (snapshot) {
        snapshot.forEach(function (childSnapshot) {
          onResolve(childSnapshot.key);
          return true;
        });
      });

    const queryEmployee = this.db.child(this.EMPLOYEE_CHILD).orderByChild('email').equalTo(email);
    queryEmployee.once('value')
      .then(function (snapshot) {
        snapshot.forEach(function (childSnapshot) {
          onResolve(childSnapshot.key);
          return true;
        });
      });

    const queryUsers = this.db.child(this.USERS_CHILD).orderByChild('email').equalTo(email);
    queryUsers.once('value')
      .then(function (snapshot) {
        snapshot.forEach(function (childSnapshot) {
          onResolve(childSnapshot.key);
          return true;
        });
      });
  }

  /**
   * Gets single user data from firebase db
   * @param {string} uid
   * @param onResolve
   * @memberof DaoService
   */

  user(uid: string, onResolve) {
    let newUser = new User();

    this.db.child(this.USERS_CHILD).child(uid).once('value', (snapshot) => {
      if (snapshot.val() !== null && snapshot.val() !== undefined) {
        newUser = snapshot.val();

        if (newUser.events === null || newUser.events === undefined) {
          newUser.events = [];
        }

        newUser.uid = uid;
        onResolve(newUser);
      }
    });

    this.db.child(this.EMPLOYEE_CHILD).child(uid).once('value', (snapshot) => {
      if (snapshot.val() !== null && snapshot.val() !== undefined) {
        newUser = snapshot.val();

        if (newUser.events === null || newUser.events === undefined) {
          newUser.events = [];
        }

        newUser.uid = uid;
        onResolve(newUser);
      }
    });

    this.db.child(this.CLIENTS_CHILD).child(uid).once('value', (snapshot) => {
      if (snapshot.val() !== null && snapshot.val() !== undefined) {
        newUser = snapshot.val();

        if (newUser.events === null || newUser.events === undefined) {
          newUser.events = [];
        }

        newUser.uid = uid;
        onResolve(newUser);
      }
    });

    this.db.child(this.GOD_CHILD).child(uid).once('value', (snapshot) => {
      if (snapshot.val() !== null && snapshot.val() !== undefined) {
        newUser = snapshot.val();


        if (newUser.events === null || newUser.events === undefined) {
          newUser.events = [];
        }

        newUser.uid = uid;
        onResolve(newUser);
      }
    });

    this.db.child(this.SUPERGOD_CHILD).child(uid).once('value', (snapshot) => {
      if (snapshot.val() !== null && snapshot.val() !== undefined) {
        newUser = snapshot.val();


        if (newUser.events === null || newUser.events === undefined) {
          newUser.events = [];
        }

        newUser.uid = uid;
        onResolve(newUser);
      }
    });
  }

  /**
  * create any type of user
  * @param {User} user
  * @memberof DaoService
  */
  createUser(user: User) {
    const aux = user.uid;
    const key = this.crypto.encrypt(user.password)
    user.password = key;

    let path = "";

    switch (user.type) {
      case TypeUser.USER: {
        path = this.USERS_CHILD + '/' + user.uid;
        break;
      }

      case TypeUser.EMPLOYEE: {
        path = this.EMPLOYEE_CHILD + '/' + user.uid;
        break;
      }

      case TypeUser.CLIENT: {
        path = this.CLIENTS_CHILD + '/' + user.uid;
        break;
      }

      case TypeUser.GOD: {
        path = this.GOD_CHILD + '/' + user.uid;
        break;
      }

      default: {
        path = this.SUPERGOD_CHILD + '/' + user.uid;
      }
    }

    this.db.child(path).set({
      name: user.name,
      email: user.email,
      company: user.company,
      title: user.title,
      description: user.description,
      type: user.type,
      facebook: user.facebook,
      instagram: user.instagram,
      twitter: user.twitter,
      linkedin: user.linkedin,
      website: user.website,
      picture: user.picture,
      selfEditLink: user.selfEditLink,
      aboutMe: user.aboutMe,
      password: user.password,
    });
  }

  /**
   * Saves user data to firebase db
   * @param {User} user
   * @memberof DaoService
   */
  updateUser(user: User) {
    if (user.type == TypeUser.SUPERGOD) {
      this.updateUserSuperGod(user);
    }
    else if (user.type == TypeUser.GOD) {
      this.updateUserGod(user);
    } else if (user.type == TypeUser.CLIENT) {
      this.updateUserClient(user);
    } else if (user.type == TypeUser.EMPLOYEE) {
      //arrumar
    } else if (user.type == TypeUser.USER) {
      this.updateUserFinal(user);
    }
  }

  //                                                          UPDATE TYPES USERS                                                                                                                                                  USER
  updateUserEmployee(user: User, idClient: string) {
    const aux = user.uid;
    const ref = this.db.child(this.CLIENTS_CHILD).child(idClient).child(this.EMPLOYEE_CHILD).child(user.uid);
    user.uid = null;
    ref.update(user);
    user.uid = aux;
  }


  updateUserClient(user: User) {
    const aux = user.uid;
    const ref = this.db.child(this.CLIENTS_CHILD).child(user.uid);
    user.uid = null;
    ref.update(user);
    user.uid = aux;
  }

  updateUserGod(user: User) {
    const aux = user.uid;
    const ref = this.db.child(this.GOD_CHILD).child(user.uid);
    user.uid = null;
    ref.update(user);
    user.uid = aux;
  }

  updateUserSuperGod(user: User) {
    const aux = user.uid;
    const ref = this.db.child(this.SUPERGOD_CHILD).child(user.uid);
    user.uid = null;
    ref.update(user);
    user.uid = aux;
  }

  updateUserFinal(user: User) {
    const aux = user.uid;
    const ref = this.db.child(this.USERS_CHILD).child(user.uid);
    user.uid = null;
    ref.update(user);
    user.uid = aux;
  }

  updateUserSpeaker(user: User, onResolve) {
    const aux = user.uid;
    const ref = this.db.child(this.USERS_CHILD).child(user.uid);
    user.uid = null;
    ref.update(user);
    user.uid = aux;
    onResolve(true);
  }

  updateUserAttendees(user: User, onResolve) {
    const aux = user.uid;
    const ref = this.db.child(this.USERS_CHILD).child(user.uid);
    user.uid = null;
    ref.update(user);
    user.uid = aux;
    onResolve(true);
  }


  //                                                      EVENT                                                                                                                                                         USER


  event(id: string, onResolve) {
    this.db.child(this.EVENTS_CHILD).child(id).once('value', (snapshot) => {
      onResolve(snapshot.val());
    });
  }

  events(onResolve) {
    this.db.child(this.EVENTS_CHILD).once('value', (snapshot) => {
      const data = snapshot.val();
      const list = [];
      for (const uid in data) {
        const event = data[uid];
        event.uid = uid;
        list.push(event);
      }
      onResolve(list);
    });
  }

  eventsClient(onResolve) {
    this.db.child(this.EVENTS_CHILD).on('value', (snapshot) => {
      const data = snapshot.val();
      const list: Array<Event> = [];
      for (const key in data) {
        this.event(key, event => {
          event.uid = key;
          if (event.type === this.EVENT_CLIENT) {
            list.push(event)
          }
        })
      }
      onResolve(list);
    });
  }

  eventsB3App(onResolve) {
    this.db.child(this.EVENTS_CHILD).on('value', (snapshot) => {
      const data = snapshot.val();
      const list: Array<Event> = [];
      for (const key in data) {
        this.event(key, event => {
          event.uid = key;
          if (event.type === this.EVENT_B3App) {
            list.push(event)
          }
        })
      }

      onResolve(list);
    });
  }

  createEventB3App(event: Event) {
    this.db.child(this.EVENTS_CHILD).push(event);
  }

  /**
   * Saves (creates) new app (event) for a user
   * @param {User} user
   * @param {Event} event
   * 
   * @memberof DaoService
   */
  createEvent(user: User, event: Event) {
    this.db.child(this.EVENTS_CHILD).push(event).then((data) => {
      const eventId = data.key;
      this.insertEventFomClient(eventId, user);
    });
  }

  updateEvent(eventId: string, event: Event) {
    this.db.child(this.EVENTS_CHILD).child(eventId).update(event);
  }

  removeEvent(event: Event) {
    const idEvent = event.uid;

    this.db.child(this.EVENTS_CHILD).child(idEvent).remove();
    this.db.child(this.TRACK_ATTENDEES_CHILD).child(idEvent).remove();

    this.removeEventFromClient(event);

  }

  nameFromEvent(name: string, onResolve) {
    const query = this.db.child(this.EVENTS_CHILD).orderByChild('name').equalTo(name);
    query.once('value').then(function (snapshot) {
      snapshot.forEach(function (childSnapshot) {
        onResolve(childSnapshot.key);
      });
    });
  }

  removeEventFromClient(event: Event) {
    const idClient = event.client;
    const idEvent = event.uid;
    this.db.child(this.CLIENTS_CHILD).child(idClient).child(this.EVENTS_CHILD).child(idEvent).remove();
  }


  //                                                              SESSION                                                                                                                    USER


  createSession(eventId: string, session: Session) {
    this.db.child(this.EVENTS_CHILD).child(eventId).child(this.SESSIONS_CHILD).push(session);
  }

  createSessionWithTracks(eventId: string, session: Session) {
    const auxGroup = session.group;
    session.group = [];

    const newKeySession = this.db.child(this.EVENTS_CHILD).child(eventId).child(this.SESSIONS_CHILD).push(session).key;

    if (auxGroup.length > 0) {
      for (const group of auxGroup) {
        this.checkNameTrackSession(group, eventId, exist => {
          if (exist) {
            this.trackSessionSearchByName(group, eventId, (track) => {
              this.insertSessionTrackSession(track.uid, newKeySession);
            });
          } else {
            let newTrack = new Track();
            newTrack.name = group;
            const newKeyTrack = this.db.child(this.TRACK_SESSION_CHILD).child(eventId).push(newTrack).key;
            this.insertSessionTrackSession(newKeyTrack, newKeySession);
          }
        });
      }
    }
  }



  deleteSession(eventId: string, session: string, onResolve) {
    this.db.child(this.EVENTS_CHILD).child(eventId).child(this.SESSIONS_CHILD).child(session).remove(error => {
      if (!error) {
        onResolve(false)
      }
    });
  }


  session(eventId: string, sessionId: string, onResolve) {
    this.db.child(this.EVENTS_CHILD + '/' + eventId + this.SESSIONS_CHILD)
      .child(sessionId).once('value').then((snapshot) => {

        let session = new Session();

        if (snapshot.val() !== null && snapshot.val() !== undefined) {
          session = snapshot.val() as Session;
        }

        session.id = snapshot.key;
        onResolve(session);
      });
  }

  updateSession(eventId: string, session: Session) {
    const ref = this.db.child(this.EVENTS_CHILD + '/' + eventId + '/' + this.SESSIONS_CHILD +
      '/' + session.id);
    ref.update(session);
  }

  sessions(eventId: string, onResolve) {
    this.db.child(this.EVENTS_CHILD + '/' + eventId + this.SESSIONS_CHILD).on('value', (snapshot) => {
      const data = snapshot.val();
      const list: Array<Session> = [];
      for (const key in data) {
        data[key].id = key;
        list.push(data[key] as Session);
      };
      onResolve(list);
    });
  }


  //                                                            SPEAKER                                                                                                                   USER

  insertSpeaker(eventId: string, speaker: User) {
    const path = this.EVENTS_CHILD + '/' + eventId + this.SPEAKERS_CHILD + '/' + speaker.uid;
    this.db.child(path).set(true);
  }



  speakers(eventId: string, onResolve) {
    this.db.child(this.EVENTS_CHILD + '/' + eventId + this.SPEAKERS_CHILD).on('value', (snapshot) => {
      const data = snapshot.val();
      const list: Array<User> = [];

      for (const key in data) {
        this.user(key, speaker => {
          list.push(speaker);
        })
      }

      onResolve(list);
    });
  }

  speakersFromSession(eventId: string, sessionId: string, onResolve) {
    this.db.child(this.EVENTS_CHILD + '/' + eventId + '/' + this.SESSIONS_CHILD +
      '/' + this.SPEAKERS_CHILD + '/' + sessionId).on('value', (snapshot) => {
        const data = snapshot.val();
        const list = [];
        for (const key in data) {
          list.push(key);
        }
        onResolve(list);
      });
  }



  //                                                      ATTENDEE                                                                                                                    USER

  insertAttendee(eventId: string, attendee: User) {
    const path =
      this.EVENTS_CHILD + '/' + eventId + this.ATTENDEES_CHILD + '/' + attendee.uid;
    this.db.child(path).set(true);
  }

  attendees(eventId: string, onResolve) {
    this.db.child(this.EVENTS_CHILD + '/' + eventId + this.ATTENDEES_CHILD)
      .on('value', (snapshot) => {
        const data = snapshot.val();
        const list: Array<User> = [];

        for (const uid in data) {
          this.user(uid, Attendees => {
            list.push(Attendees);
          })
        }
        onResolve(list);
      });
  }

  attendeesWithTracks(eventId: string, onResolve) {
    this.db.child(this.EVENTS_CHILD + '/' + eventId + this.ATTENDEES_CHILD)
      .on('value', (snapshot) => {
        const data = snapshot.val();
        const list = [];

        for (const uid in data) {
          this.user(uid, Attendees => {
            this.searchUserTrackInEvent(Attendees, eventId, tracks => {
              Attendees.group = tracks;
              list.push(Attendees);
            });
          })
        }
        onResolve(list);
      });

  }

  /**
   * 
   * check if the attendees is part of the event
   * @param {string} eventId
   * @param {string} attendeesId
   * @param {boolean} onResolve
     @memberof DaoService
   */
  checkAttendeesEvent(eventId: string, attendeesId: string, onResolve) {
    this.db.child(this.EVENTS_CHILD).child(eventId).child(this.ATTENDEES_CHILD).once('value', (snapshot) => {
      if (snapshot.hasChild(attendeesId)) { // verifica se o id do participante existe.
        onResolve(true);
      } else {
        onResolve(false);
      }
    });
  }

  //                                                    CLIENT                                                                                                                    USER

  clients(onResolve) {
    this.db.child(this.CLIENTS_CHILD).once('value', (snapshot) => {
      const data = snapshot.val();
      const list = [];
      for (const uid in data) {
        const client = data[uid];
        client.uid = uid;
        list.push(client);
      }
      onResolve(list);
    });
  }

  client(uid, onResolve) {
    this.db.child(this.CLIENTS_CHILD).child(uid).once('value', (snapshot) => {
      const client = snapshot.val();
      onResolve(client)
    })
  }

  insertEventFomClient(eventId: string, client: User) {
    const path = this.CLIENTS_CHILD + '/' + client.uid + this.EVENTS_CHILD + '/' + eventId;
    this.db.child(path).set(true);
  }

  emailFromClient(email: string, onResolve) {
    const query = this.db.child(this.CLIENTS_CHILD).orderByChild('email').equalTo(email);
    query.once('value').then(function (snapshot) {
      snapshot.forEach(function (childSnapshot) {
        onResolve(childSnapshot.key);
      });
    });
  }

  removeClient(clientId: string) {
    this.db.child(this.CLIENTS_CHILD).child(clientId).remove();

  }

  //                                                    GOD

  /**
   * 
    list users type god.

   * @param {string} eventId
   * @param {Track} newTrack
   * 
   * @memberof DaoService
   */

  gods(onResolve) {
    this.db.child(this.GOD_CHILD).on('value', (snapshot) => {
      const data = snapshot.val();
      const list = [];
      for (const uid in data) {
        const god = data[uid];
        god.uid = uid;
        list.push(god);
      }
      onResolve(list);
    });
  }

  removeGod(uid: string) {
    this.db.child(this.GOD_CHILD).child(uid).remove();
  }

  // //   TRACKS ATTENDEE                 

  /**
   * 
    creates a new track of attendees for the event
   * @param {string} eventId
   * @param {Track} newTrack
   * 
   * @memberof DaoService
   */

  createTrackAttendee(eventId: string, newTrack: Track) {
    this.db.child(this.TRACK_ATTENDEES_CHILD).child(eventId).push(newTrack);
  }

  /**
   * 
    mesma coisa do createTrackAttende, mas com a confirmação
   * @param {string} eventId
   * @param {Track} newTrack
   * 
   * @memberof DaoService
   */

  RegisterTrackAttendee(eventId: string, newTrack: Track, onResolve) {
    this.db.child(this.TRACK_ATTENDEES_CHILD).child(eventId).push(newTrack).then(
      onResolve(true)
    )
  }


  /**
   * remove attendees track from event
   * @param {string} eventId
   * @param {Track} track
   * 
   * @memberof DaoService
   */

  removeTrackAttendee(eventId: string, track: Track) {
    this.db.child(this.TRACK_ATTENDEES_CHILD).child(eventId).child(track.uid).remove();
    this.db.child(this.TRACK_ATTENDEES_MEMBERS_CHILD).child(track.uid).remove();
  }

  /**
   * search event track list
   * @param {string} eventId
   * @param onResolve
   * 
   * @memberof DaoService
   */

  tracksAttendee(eventId: string, onResolve) {
    this.db.child(this.TRACK_ATTENDEES_CHILD).child(eventId).on('value', (snapshot) => {
      const data = snapshot.val();
      const list: Array<Track> = [];
      for (const uid in data) {
        data[uid].uid = uid;
        list.push(data[uid] as Track);
      }
      onResolve(list);
    });
  }

  /**
   * search and return track by name
   * @param {string} nameTrack
   * @param onResolve
   * 
   * @memberof DaoService
   */

  trackSearchByName(nameTrack: string, eventId: string, onResolve) {
    const query = this.db.child(this.TRACK_ATTENDEES_CHILD).child(eventId).orderByChild('name').equalTo(nameTrack);
    query.once('value').then((snapshot) => {
      snapshot.forEach(function (childSnapshot) {
        let track = new Track();
        track = childSnapshot.val();
        track.uid = childSnapshot.key;
        onResolve(track);
      });
    });
  }

  /**
     search user track in event
   * @param {User} user
   * @param {String} eventId
   * @param onResolve
   * 
   * @memberof DaoService
   */
  searchUserTrackInEvent(user: User, eventId: string, onResolve) {
    this.tracksAttendee(eventId, (snapshot) => {
      let tracks: Array<string> = [];
      const data = snapshot;
      for (const track of data) {
        this.db.child(this.TRACK_ATTENDEES_MEMBERS_CHILD).child(track.uid).child(user.uid)
          .once('value', snapshot => {
            if (snapshot.val() !== null) {
              tracks.push(track.name);
            }
          });
      }
      onResolve(tracks);
    });
  }


  /**
   * add users on track
   * @param {string} uidTrack
   * @param {string} uidUser
   * 
   * @memberof DaoService
   */
  insertUserTrackAttendee(uidTrack: string, uidUser: string) {
    const path = this.TRACK_ATTENDEES_MEMBERS_CHILD + '/' + uidTrack + '/' + uidUser;
    this.db.child(path).set(true);
  }

  /**
   * check if name new track exist event
   * @param {string} nameTrack
   * @param onResolve
   * 
   * @memberof DaoService
   */
  checkNameTrack(nameTrack: string, eventId: string, onResolve) {
    const query = this.db.child(this.TRACK_ATTENDEES_CHILD).child(eventId).orderByChild('name').equalTo(nameTrack);
    query.once('value', snapshot => {
      if (snapshot.val() != null) {
        onResolve(true);
      } else {
        onResolve(false);
      }
    });
  }

  /**
  * return tha truck with uid;
  * @param {string} uid
  * @param {string} eventId
  * @param onResolve
  * 
  * @memberof DaoService
  */
  track(uid: string, eventId: string, onResolve) {
    this.db.child(this.TRACK_ATTENDEES_CHILD).child(eventId).child(uid)
      .once('value', (snapshot) => {
        const track = snapshot.val();
        track.uid = snapshot.key;
        onResolve(track);
      });
  }

  /**
   *check if user exists on treck
   * @param {string} trackUid
   * @param {string} userUid
   * @param onResolve
   * 
   * @memberof DaoService
   */

  checkUserOnTreck(trackUid: string, userUid: string, onResolve) {
    this.db.child(this.TRACK_ATTENDEES_MEMBERS_CHILD).child(trackUid).child(userUid).
      once('value', (snapshot) => {
        if (snapshot.val() != null) {
          onResolve(true);
        } else {
          onResolve(false);
        }
      });
  }

  // //   TRACKS SESSION                 
  /**
 * 
  creates a new track of session for the event
 * @param {string} eventId
 * @param {Track} newTrack
 * @memberof DaoService
 */

  createTrackSession(eventId: string, newTrack: Track) {
    this.db.child(this.TRACK_SESSION_CHILD).child(eventId).push(newTrack);
  }

  /**
   * search event track list
   * @param {string} eventId
   * @param onResolve
   * 
   * @memberof DaoService
   */

  tracksSession(eventId: string, onResolve) {
    this.db.child(this.TRACK_SESSION_CHILD).child(eventId).on('value', (snapshot) => {
      const data = snapshot.val();
      const list: Array<Track> = [];
      for (const uid in data) {
        data[uid].uid = uid;
        list.push(data[uid] as Track);
      }
      onResolve(list);
    });
  }

  /**
  * remove attendees track from event
  * @param {string} eventId
  * @param {Track} track
  * 
  * @memberof DaoService
  */

  removeTrackSession(eventId: string, track: Track) {
    this.db.child(this.TRACK_SESSION_CHILD).child(eventId).child(track.uid).remove();
    this.db.child(this.TRACK_SESSION_MEMBERS_CHILD).child(track.uid).remove();
  }

  /**
  * check if name new track exist event
  * @param {string} nameTrack
  * @param onResolve
  * 
  * @memberof DaoService
  */
  checkNameTrackSession(nameTrack: string, eventId: string, onResolve) {
    const query = this.db.child(this.TRACK_SESSION_CHILD).child(eventId).orderByChild('name').equalTo(nameTrack);
    query.once('value', snapshot => {
      if (snapshot.val() != null) {
        onResolve(true);
      } else {
        onResolve(false);
      }
    });
  }

  /**
  * search and return track by name
  * @param {string} nameTrack
  * @param onResolve
  * 
  * @memberof DaoService
  */

  trackSessionSearchByName(nameTrack: string, eventId: string, onResolve) {
    const query = this.db.child(this.TRACK_SESSION_CHILD).child(eventId).orderByChild('name').equalTo(nameTrack);
    query.once('value').then((snapshot) => {
      snapshot.forEach(function (childSnapshot) {
        let track = new Track();
        track = childSnapshot.val();
        track.uid = childSnapshot.key;
        onResolve(track);
      });
    });
  }

  /**
 *check if session exists on treck
 * @param {string} trackUid
 * @param onResolve
 * 
 * @memberof DaoService
 */

  checkSessionOnTreck(trackUid: string, sessionUid: string, onResolve) {
    this.db.child(this.TRACK_SESSION_MEMBERS_CHILD).child(trackUid).child(sessionUid).
      once('value', (snapshot) => {
        if (snapshot.val() != null) {
          onResolve(true);
        } else {
          onResolve(false);
        }
      });
  }

  /**
  * add users on track
  * @param {string} uidTrack
  * @param {string} uidUser
  * 
  * @memberof DaoService
  */
  insertSessionTrackSession(uidTrack: string, uidSession: string) {
    const path = this.TRACK_SESSION_MEMBERS_CHILD + '/' + uidTrack + '/' + uidSession;
    this.db.child(path).set(true);
  }

  /**
  * 
   mesma coisa do createTrackAttende, mas com a confirmação
  * @param {string} eventId
  * @param {Track} newTrack
  * 
  * @memberof DaoService
  */

  RegisterTrackSession(eventId: string, newTrack: Track, onResolve) {
    this.db.child(this.TRACK_SESSION_CHILD).child(eventId).push(newTrack).then(
      onResolve(true)
    )
  }




}
