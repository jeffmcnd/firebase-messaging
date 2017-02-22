import * as firebase from 'firebase';

import { Component, OnInit } from '@angular/core';
import { Router }            from '@angular/router';

import { User }              from './user';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  authRef: firebase.auth.Auth;
  user: firebase.User;
  users: User[];
  usersRef: firebase.database.Reference;

  constructor(private router: Router) { }

  ngOnInit() {
    this.authRef = firebase.auth();
    this.usersRef = firebase.database().ref('users');
    this.users = [];

    this.authRef.onAuthStateChanged(user => {
      this.user = user;
      if(user) {
        this.usersRef.orderByChild('firstName').on('child_added', data => {
          if(data.key !== user.uid) {
            var u = data.val();
            u.uid = data.key;
            this.users.push(u);
          }
        });
      } else {
        this.users = [];
      }
    });
  }
}
