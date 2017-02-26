import * as firebase from 'firebase';

import { Component, OnInit, ChangeDetectorRef } from '@angular/core';

import { Observable } from 'rxjs/Rx';

import { Conversation }      from './conversation';
import { User }              from '../users/user';

@Component({
  selector: 'app-conversations',
  templateUrl: './conversations.component.html',
  styleUrls: ['./conversations.component.css']
})
export class ConversationsComponent implements OnInit {
  authRef: firebase.auth.Auth;
  convos: Conversation[];
  conversationsRef: firebase.database.Reference;
  user: User;
  usersRef: firebase.database.Reference;

  constructor(private cd: ChangeDetectorRef) { }

  ngOnInit() {
    this.authRef = firebase.auth();
    this.usersRef = firebase.database().ref('users');
    this.conversationsRef = firebase.database().ref('conversations');

    this.convos = [];
    this.user = null;

    this.authRef.onAuthStateChanged(user => {
      if(user) {
        this.usersRef.child(user.uid).on('value', snap => {
          this.user = snap.val();
          this.cd.detectChanges();
        });
        var ref = this.conversationsRef.child(user.uid).orderByChild('timestamp');
        Observable.fromEvent(ref, 'child_added').subscribe(snap => {
          var convo = snap['val']();
          convo.key = snap['key'];
          this.convos.unshift(convo);
          this.cd.detectChanges();
        });
        Observable.fromEvent(ref, 'child_changed').subscribe(snap => {
          for(var i = 0; i < this.convos.length; i++) {
            if(snap['key'] === this.convos[i]['key']) {
              this.convos[i] = snap['val']();
              this.convos[i].key = snap['key'];
              this.cd.detectChanges();
            }
          }
        });
      } else {
        this.user = null;
        this.convos = [];
      }
      this.cd.detectChanges();
    });
  }
}
