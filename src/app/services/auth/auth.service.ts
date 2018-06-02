import {Injectable} from '@angular/core';
import 'rxjs/add/operator/map';
import {Observable} from 'rxjs/Observable';
import * as firebase from 'firebase/app';
import {DaoService} from '../dao/dao.service';
import {AngularFireAuth} from 'angularfire2/auth';
import {environment} from '../../../environments/environment';
import { CryptoService } from '../crypto/crypto.service'

import {User} from '../../../models/user';


@Injectable()
export class AuthService {
  private auth: firebase.auth.Auth;
  private secondaryAuth: firebase.auth.Auth;

  constructor(private dao: DaoService, private angularFireAuth: AngularFireAuth, private crypto: CryptoService) {
    this.auth = angularFireAuth.auth;
  }

 
  /**
   * Takes email and password and attempts to log user in firebase
   * @param {string} email
   * @param {string} password
   * @param onResolve true if login was successful
   * @memberof AuthService
   */
  loginUser(email: string, password: string, onResolve) {
    this.auth.signInWithEmailAndPassword(email, password).then(_ => {
      onResolve(true);
    }).catch((error) => {
      console.log(error);
      onResolve(false);
    });
  }

  /**
   * Attempts to register user in firebase and returns registered user
   * @param {string} email
   * @param {string} password
   * @param onResolve
   * @memberof AuthService
   */
  registerUser(email: string, password: string, onResolve) {
    this.checkSecondary();
    this.secondaryAuth.createUserWithEmailAndPassword(email, password).then((firebaseUser: firebase.User) => {
      onResolve(firebaseUser);
    }).catch((error) => {
      console.log(error);
      onResolve(null);
    });
  }

  deleteUser(user: User){
    this.checkSecondary();
    this.secondaryAuth.signInWithEmailAndPassword(user.email, user.password).then((user: firebase.User) => {
      user.delete().catch(error => {
        alert('erro ao deletar usuário da Authentication do firebase.');
      });
    })    
  }

  /**
   * Takes email and registers a user in firebase without changing currentUser, returns new user`s info
   * @param {string} email
   * @param onResolve
   * @memberof AuthService
   */
  register(email: string, onResolve) {
    this.checkSecondary();
    this.secondaryAuth.createUserWithEmailAndPassword(email, '123456').then((user: firebase.User) => {
      // this.dao.user(user.uid, (userInfo) => {
      //   userInfo.uid = user.uid;
      onResolve(user);
      // });
    });
  }

  // TODO: arrumar
  checkSecondary() {
    if (this.secondaryAuth === null || this.secondaryAuth === undefined) {
      this.secondaryAuth = firebase.initializeApp(environment.firebase, 'secondary').auth();
    }
  }

 

  signSecondary(email: string, password: string, onResolve){
    this.checkSecondary();
    this.secondaryAuth.signInWithEmailAndPassword(email, password).then((user: firebase.User) => {
      onResolve(user);
    }).catch((error) => {
      console.log(error);
    });
  }


  /**
   * Attempts to log the user out from firebase
   * @memberof AuthService
   */
  logoutSecondary() {
    this.secondaryAuth.signOut();
  }

  /**
   * Attempts to log the user out from firebase
   * @memberof AuthService
   */
  logoutUser() {
    this.auth.signOut();
  }

  /**
   * Helper function to check if user is logged in
   * @returns {Observable<boolean>}
   * @memberof AuthService
   */
  isAuthenticated(): Observable<boolean> {
    return new Observable((subscriber) => {
      this.angularFireAuth.authState.subscribe((user) => {
        subscriber.next(user !== null && user !== undefined);
      });
    });
  }

  /**
   * Only reliable way to get current logged user
   * @returns {Observable<string>}
   */
  currentUserUid(): Observable<string> {
    return new Observable((subscriber) => {
      this.angularFireAuth.authState.subscribe((firebaseUser) => {
        subscriber.next(firebaseUser.uid);
      });
    });
  }

  /**
   * check if e-mail registered
   * @param {string} email
   * @param onResolve
   * @memberof AuthService
   */

  emailIsRegistered(email: string, onResolve) {
    this.auth.fetchProvidersForEmail(email).then((providers) => {
      onResolve(providers.length > 0)
    });
  }

  updateEmailAndPassword(newEmail: string, newPassword: string, user: User){
    this.checkSecondary();
    const descryptpassword = this.crypto.decrypt(user.password)
    this.secondaryAuth.signInWithEmailAndPassword(user.email, descryptpassword).then((user: firebase.User) => {
      
      user.updateEmail(newEmail).catch((error) =>{
        alert('Erro e-mail.');
      }); 
    
      user.updatePassword(newPassword).catch((error) =>{
        alert('Erro senha.');
      });
    });
    
  }

  updateEmail(newEmail: string, user: User){
    this.checkSecondary();
    const descryptpassword = this.crypto.decrypt(user.password)
    this.secondaryAuth.signInWithEmailAndPassword(user.email, descryptpassword).then((user: firebase.User) => {
      user.updateEmail(newEmail).catch((error) =>{
        alert('Erro: E-mail já existe.');
      });
    });
  }

  updatePassword(newPassword: string, user: User){
    this.checkSecondary();
    const descryptpassword = this.crypto.decrypt(user.password)
    this.secondaryAuth.signInWithEmailAndPassword(user.email, descryptpassword).then((user: firebase.User) => {
      user.updatePassword(newPassword).catch((error) =>{
        alert('erro: Senha invalida.');
      });
    });
  }


  recoveryPassword(email: string){
    this.auth.sendPasswordResetEmail(email).then(function(){
      alert("E-mail enviado!")
    }).catch(function (error){
      console.log(error);
    })
  }

}
