import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ConversationsComponent }       from '../conversations/conversations.component';
import { MessagesComponent }    from '../messages/messages.component';
import { UsersComponent }       from '../users/users.component';

const routes: Routes = [
  { path: '', redirectTo: '/users', pathMatch: 'full' },
  { path: 'conversations',        component: ConversationsComponent },
  { path: 'users',        component: UsersComponent },
  { path: 'messages/:id', component: MessagesComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class RoutingModule {}
