import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ContatosListComponent }      from './contatos-list/contatos-list.component';
import { ContatoComponent }      from './contato/contato.component';


const routes: Routes = [
  {path: 'contatos', component: ContatosListComponent},
  {path: 'contatos/:id', component: ContatoComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
