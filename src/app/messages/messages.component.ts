import * as firebase from 'firebase';

import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute }    from '@angular/router';

import { Message } from './message';

import { User }    from '../users/user';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit, OnDestroy {

  convoId: string;
  conversationsRef: firebase.database.Reference;
  file: any;
  messages: Message[];
  messagesRef: firebase.database.Reference;
  usersRef: firebase.database.Reference;
  private sub: any;

  otherUid: string;
  otherUser: User;
  uid: string;
  user: User;

  users: {};

  title = 'Conversation';

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.convoId = '';

    this.messages = [];

    this.conversationsRef = firebase.database().ref('conversations');
    this.usersRef = firebase.database().ref('users');

    this.users = {};

    firebase.auth().onAuthStateChanged(user => {
      if(user) {
        this.usersRef.child(this.otherUid).on('value', data => {
          this.otherUser = data.val();
          this.users[data.key] = data.val();
        });
        this.usersRef.child(user.uid).on('value', data => {
          this.uid = user.uid;
          this.user = data.val();
          this.users[data.key] = data.val();
          this.conversationsRef.child(this.uid).orderByChild('uid').equalTo(this.otherUid).once('value', data => {
            var convo = data.val();
            if(convo) {
              this.convoId = Object.keys(convo).pop();
              this.messagesRef = firebase.database().ref('messages/' + this.convoId);
              this.messagesRef.on('child_added', data => {
                var m = data.val();
                this.messages.push({imageUrl: m.imageUrl, message: m.message, timestamp: m.timestamp, uid: m.uid});
              });
            }
          });
        });
      } else this.user = null;
    });

    this.sub = this.route.params.subscribe(params => {
      this.otherUid = params['id'];
    });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  readUrl(event): void {
    if(event.target.files && event.target.files[0]) {
      this.file = event.target.files[0];
    }
  }

  push(): void {
    if(this.file && this.messagesRef) {
      this.messagesRef.push({
        timestamp: Date.now(),
        uid: this.uid
      }).then(data => {
        firebase.storage().ref().child('messages').child(this.convoId).child(data.key).put(this.file, {contentType: this.file.type}).then(snap => {
          var path = snap.downloadURL;
          data.update({imageUrl: path});
        });
      });
    }
  }

  send(message: string): void {
    var timestamp = Date.now();

    var m = new Message();
    m.message = message;
    m.timestamp = timestamp;
    m.uid = this.uid;

    var convo = {
      name: this.user.firstName + ' ' + this.user.lastName,
      lastMessage: 'You: ' + message,
      imageUrl: this.otherUser.smallImageUrl,
      timestamp: timestamp,
      uid: this.otherUid
    }

    var otherConvo = {
      name: this.user.firstName + ' ' + this.user.lastName,
      lastMessage: this.user.firstName + ': ' + message,
      imageUrl: this.user.smallImageUrl,
      timestamp: timestamp,
      uid: this.uid
    }

    if(this.messagesRef) {
      this.conversationsRef.child(this.uid).child(this.convoId).update(convo);
      this.conversationsRef.child(this.otherUid).child(this.convoId).update(otherConvo);
      this.pushMessage(m);
    } else {
      this.convoId = this.conversationsRef.child(this.uid).push(convo).key;
      this.conversationsRef.child(this.otherUid).child(this.convoId).set(otherConvo);
      this.messagesRef = firebase.database().ref('messages/' + this.convoId);
      this.messagesRef.on('child_added', data => {
        var m = data.val();
        this.messages.push({imageUrl: m.imageUrl, message: m.message, timestamp: m.timestamp, uid: this.uid});
      });
      this.pushMessage(m);
    }
  }

  pushMessage(message: Message): void {
    this.messagesRef.push(message);
  }

  getImage(id: string): string {
    return this.users[id].smallImageUrl;
  }

  getName(id: string): string {
    return this.users[id].firstName + ' ' + this.users[id].lastName;
  }

}
