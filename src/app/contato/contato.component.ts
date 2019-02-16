import { Component, OnInit, Input } from '@angular/core';
import { FormControl, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';

import {Router} from "@angular/router"
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
 
import { Contato }         from '../contato';
import { ContatoService }  from '../contato.service';
import { Endereco } from '../Endereco';
import { isEmpty } from 'rxjs/operators';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-contato',
  templateUrl: './contato.component.html',
  styleUrls: ['./contato.component.css']
})
export class ContatoComponent implements OnInit {

  @Input() contato: Contato;

  matcher = new MyErrorStateMatcher();
  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);
  
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private contatoService: ContatoService,
    private location: Location
  ) { }

  ngOnInit() {
    this.getHero();
  }

  getHero(): void {
    const id = +this.route.snapshot.paramMap.get('id');
    if(id && id > 0)
      this.contatoService.getContato(id)
        .subscribe(contato => {
          contato.enderecos.unshift(new Endereco());
          this.contato = contato;
        });
    else{
      this.contato = new Contato();
      this.contato.enderecos = [new Endereco()];
    }
  }

  save(): void {
    
    this.contato.enderecos = this.contato.enderecos.filter(x => this.isEmpty(x) == false);

    if(this.contato.id > 0)
      this.contatoService.updateContato(this.contato)
        .subscribe(contato => {
          let existeObjetoVazio = false;
          this.contato.enderecos.forEach(element => {
            if(this.isEmpty(element))
              existeObjetoVazio = true;
          });

          if(!existeObjetoVazio)
            this.contato.enderecos.unshift(new Endereco());
        });
    else{
      this.contatoService.addContato(this.contato)
        .subscribe(contato => {
          this.router.navigate(['/contatos', contato.id]);
        });
    }
  }

  goBack(): void {
    this.location.back();
  }

  isEmpty(obj): Boolean {
    return Object.keys(obj).length === 0;
  }
}
