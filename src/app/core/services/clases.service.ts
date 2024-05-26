import { Injectable } from '@angular/core';
import { Observable, delay, forkJoin, map, of, pipe } from 'rxjs';

import { CURSOS } from '../../layouts/dashboard/pages/cursos/models';
import { CursosService } from './cursos.service';

import { CLASES, ICreateClasePayload } from '../../layouts/dashboard/pages/clases/models';

import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

//const clasesJson = '[{"id":1,"idCurso":1,"fechaIni":"2024-06-01","fechaFin":"2024-08-01","horaIni":"20:30","horaFin":"22:30"},{"id":2,"idCurso":1,"fechaIni":"2024-06-15","fechaFin":"2024-08-15","horaIni":"20:30","horaFin":"22:30"},{"id":3,"idCurso":2,"fechaIni":"2024-06-02","fechaFin":"2024-09-02","horaIni":"21:30","horaFin":"23:30"}]';
//const clases: CLASES[] = JSON.parse(clasesJson) as CLASES[];
@Injectable({
  providedIn: 'root'
})

export class clasesService {
//  clases: any[] = clases;

  constructor(private httpClient: HttpClient) {}

  getClases(): Observable<CLASES[]> {
    return this.httpClient.get<CLASES[]>(environment.baseAPIURL + '/clases');
  }

  //  getClasesByUser(userID: number): CLASES | undefined {
  //   return this.clases.find(usuario => usuario.id === userID);
  // }

  obtenerNombreClase(idClase: string): Observable<string> {
    return this.httpClient.get<{ clase: string }>(`${environment.baseAPIURL}/clases/${idClase}`)
      .pipe(
        map(response => response.clase)
      );
  }

  createClase(payload: ICreateClasePayload) {
    return this.httpClient.post<CLASES>(
      environment.baseAPIURL + '/clases',
      payload
    );
  }

}
