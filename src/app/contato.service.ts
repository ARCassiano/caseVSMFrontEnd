import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';

import { Contato } from './contato';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

import { MessageService } from './message.service';


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class ContatoService {
  private urlApi = 'http://localhost:8080/api/contatos';

  constructor(
    private http: HttpClient,
    private messageService: MessageService
  ) { }

  getContatos(): Observable<Contato[]> {
    return this.http.get<Contato[]>(this.urlApi)
    .pipe(
      tap(_ => this.log('Registros carregados')),
      catchError(this.handleError('getContatos', []))
    );
  }

  getContato(id: number): Observable<Contato> {
    const url = `${this.urlApi}/${id}`;
    
    return this.http.get<Contato>(url).pipe(
      tap(_ => this.log(`Registro encontrado id = ${id}`)),
      catchError(this.handleError<Contato>(`getContato id=${id}`))
    );
  }

  updateContato (contato: Contato): Observable<any> {
    const url = `${this.urlApi}/${contato.id}`;

    return this.http.put(url, contato, httpOptions).pipe(
      tap(_ => this.log(`Registro Atualizado [id = ${contato.id}]`)),
      catchError(this.handleError<any>('updateContato'))
    );
  }

  addContato (contato: Contato): Observable<Contato> {
    return this.http.post<Contato>(this.urlApi, contato, httpOptions).pipe(
      tap((newContato: Contato) => this.log(`Registro adicionado w/ [id=${newContato.id}]`)),
      catchError(this.handleError<Contato>('addContato'))
    );
  }

  deleteContato (contato: Contato | number): Observable<Contato> {
    const id = typeof contato === 'number' ? contato : contato.id;
    const url = `${this.urlApi}/${id}`;

    return this.http.delete<Contato>(url, httpOptions).pipe(
      tap(_ => this.log(`Registro removido [id = ${id}]`)),
      catchError(this.handleError<Contato>('deleteContato'))
    );
  }

  searchContato(term: string): Observable<Contato[]> {
    if (!term.trim()) {
      return of([]);
    }

    return this.http.get<Contato[]>(`${this.urlApi}/?name=${term}`).pipe(
      tap(_ => this.log(`Nenhum registro encotrado com o termo "${term}"`)),
      catchError(this.handleError<Contato[]>('searchContatos', []))
    );
  }

  private log(message: string) {
    this.messageService.add(message);
  }
  
  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead
      
      let messages = "";
      try{
        let virgula = "";
        error.error.errors.forEach(element => {
          messages += virgula + element.defaultMessage
          virgula = "; ";
        });
      }catch(ex){
        messages = error.message;
      }

      // TODO: better job of transforming error for user consumption
      this.log(messages);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
