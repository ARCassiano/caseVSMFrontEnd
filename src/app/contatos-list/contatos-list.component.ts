import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';

import { Contato } from '../contato';
import { ContatoService } from '../contato.service';

@Component({
  selector: 'app-contatos-list',
  templateUrl: './contatos-list.component.html',
  styleUrls: ['./contatos-list.component.css']
})
export class ContatosListComponent implements OnInit {

  myDataArray: MatTableDataSource<Contato>;
  displayedColumns: string[] = ['id', 'nome', 'cpf', 'data_nascimento', 'email', 'telefone', 'edit'];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private contatoService: ContatoService) { }

  ngOnInit() {
    this.getContatos();
  }

  applyFilter(filterValue: string) {
    this.myDataArray.filter = filterValue.trim().toLowerCase();
  }

  getContatos(): void { 
    this.contatoService.getContatos()
        .subscribe(contatos => {
          console.log(contatos);
          this.myDataArray = new MatTableDataSource<Contato>(contatos);
          this.myDataArray.sort = this.sort;
          this.myDataArray.paginator = this.paginator;
        });
  }

  putContato(contato: Contato): void{
    console.log(contato);
  }
}
