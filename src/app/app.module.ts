import * as firebase from 'firebase';

import { NgModule }          from '@angular/core';
import { BrowserModule }     from '@angular/platform-browser';
import { FormsModule }       from '@angular/forms';

import { RoutingModule }     from './routing/routing.module';

import { AppComponent }      from './app.component';
import { ConversationsComponent }    from './conversations/conversations.component';
import { MessagesComponent } from './messages/messages.component';
import { UsersComponent } from './users/users.component';

var config = {
  apiKey: "<API_KEY>",
  authDomain: "<AUTH_DOMAIN>",
  databaseURL: "<DB_URL>",
  storageBucket: "<STORAGE_BUCKET>",
  messagingSenderId: "<MESSAGING_SENDER_ID>"
};
firebase.initializeApp(config);

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    RoutingModule
  ],
  declarations: [AppComponent, ConversationsComponent, MessagesComponent, UsersComponent],
  bootstrap: [AppComponent]
})
export class AppModule {}
