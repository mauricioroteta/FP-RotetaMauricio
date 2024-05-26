import { Injectable } from '@angular/core';
import { Observable, delay, of, pipe } from 'rxjs';
import { USUARIOS, CreateUSUARIOPayload } from '../../layouts/dashboard/pages/users/models';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
@Injectable({
  providedIn: 'root'
})

export class UsuariosService {

  constructor(private httpClient: HttpClient) {}

  getUsuarios(): Observable<USUARIOS[]> {
    return this.httpClient.get<USUARIOS[]>(environment.baseAPIURL + '/users');
  }

  obtenerUsuario(nombreUsuario: string): Observable<USUARIOS[]> {
    return this.httpClient.get<USUARIOS[]>(environment.baseAPIURL + '/users?userName=' + nombreUsuario);
  }

  getUsuarioPorId(id: string): Observable<USUARIOS | undefined> {
    return this.httpClient.get<USUARIOS>(environment.baseAPIURL + '/users/' + id);
  }

  createUsuario(payload: CreateUSUARIOPayload) {
    return this.httpClient.post<USUARIOS>(environment.baseAPIURL + '/users', payload);
  }

  deleteUsuario(id: string) {
    return this.httpClient.delete<USUARIOS>(environment.baseAPIURL + '/users/' + id);
  }

  updateUsuario(id: string, payload: CreateUSUARIOPayload) {
    return this.httpClient.put<USUARIOS>(environment.baseAPIURL + '/users/' + id, payload);
  }

}
