import * as firebase from 'firebase';

import { Component, OnInit } from '@angular/core';

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

  constructor() { }

  ngOnInit() {
    this.authRef = firebase.auth();
    this.usersRef = firebase.database().ref('users');
    this.conversationsRef = firebase.database().ref('conversations');

    this.convos = [];
    this.user = null;

    this.authRef.onAuthStateChanged(user => {
      if(user) {
        this.usersRef.child(user.uid).on('value', data => {
          this.user = data.val();
        });
        this.conversationsRef.child(user.uid).orderByChild('timestamp').on('child_added', data => {
          var convo = data.val();
          convo.key = data.key;
          this.convos.unshift(convo);
        });
        this.conversationsRef.child(user.uid).orderByChild('timestamp').on('child_changed', data => {
          for(var i = 0; i < this.convos.length; i++) {
            if(data.key === this.convos[i].key) {
              this.convos[i] = data.val();
              this.convos[i].key = data.key;
            }
          }
        });
      } else {
        this.user = null;
        this.convos = [];
      }
    });
  }
}
