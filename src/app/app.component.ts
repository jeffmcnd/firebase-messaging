import * as firebase from 'firebase';

import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  user: firebase.User;

  title = 'Chat';

  ngOnInit(): void {
    firebase.auth().onAuthStateChanged(user => {
      if(user) this.user = user;
      else this.user = null;
    });
  }

  login(): void {
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider)
    .then(result => {
      firebase.database().ref('users').child(result.user.uid).set({
        firstName: result.user.displayName.split(' ')[0],
        lastName: result.user.displayName.split(' ')[1],
        email: result.user.email,
        imageUrl: result.user.photoURL,
        searchName: result.user.displayName.toLowerCase(),
        smallImageUrl: result.user.photoURL
      });
    })
    .catch(err => console.log(err.message));
  }

  logout(): void {
    firebase.auth().signOut();
  }
}
