import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, combineLatest, map, of, switchMap } from 'rxjs';
import { Router } from '@angular/router';
import { UsuariosService } from './usuarios.service';
import { USUARIOS } from '../../layouts/dashboard/pages/users/models';
import Swal from 'sweetalert2';

import { Store } from '@ngrx/store';
import { authIsLogin, authUserLogin, authRolLogin, authAvatarLogin } from '../../store/auth.selectors';
import { authActions } from '../../store/auth.actions';

@Injectable({
  providedIn: 'root'
})


export class AuthService {
  private isAdmin: boolean = false;
  private isLoggedInSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private userDataSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  private usuarios: USUARIOS[] = [];

  isLogin$: Observable<boolean>;
  userLogin$: Observable<string | null>;
  rolLogin$: Observable<string | null>;
  avatarLogin$: Observable<string | null>;

  constructor(private router: Router, private usuariosService: UsuariosService, private store: Store) {
    this.isLogin$ = this.store.select(authIsLogin);
    this.userLogin$ = this.store.select(authUserLogin);
    this.rolLogin$ = this.store.select(authRolLogin);
    this.avatarLogin$ = this.store.select(authAvatarLogin);
  }

  obtenerUsuarios(): void {
    this.usuariosService.getUsuarios().subscribe({
      next: (data) => {
        this.usuarios = data;
      },
    });
  }

  login(username: string, password: string): Observable<boolean> {
    return this.usuariosService.getUsuarios().pipe(
      switchMap((usuarios) => {
        const isAuthenticated = usuarios.some(
          (usuario) =>
            usuario.userName === username && usuario.password === password
        );

        if (isAuthenticated) {
          const adminUser = usuarios.find(
            (usuario) => usuario.userName === username && usuario.rol === 'admin'
          );

          const user: USUARIOS | undefined = usuarios.find(
            (usuario) => usuario.userName === username
          );

          const rol = adminUser ? 'admin' : 'user';

          const User = usuarios.find(
            (usuario) => usuario.userName === username
          );
          const avatar = User ? User.avatar : 'https://robohash.org/providentverocorrupti.png?size=50x50&set=set1';


          const userData = {
            usuario: username,
            rol: rol,
            avatar: avatar
          };

          this.userDataSubject.next(userData);

          localStorage.setItem('user', userData.usuario);
          localStorage.setItem('rol', userData.rol);
          localStorage.setItem('avatar', userData.avatar ?? 'https://robohash.org/providentverocorrupti.png?size=50x50&set=set1' );

          if (isAuthenticated) {
            const usuarioEncontrado = usuarios.find(
              (usuario) => usuario.userName === username && usuario.rol === 'admin'
            );

            const avatar = usuarioEncontrado ? usuarioEncontrado.avatar : 'defaultAvatarValue';

            this.store.dispatch(authActions.login({ username, rol, avatar }));
          }



          return of(true);
        } else {
          return of(false);
        }
      })
    );
  }

  verifyToken(): boolean {
    const user = localStorage.getItem('user');
    const rol = localStorage.getItem('rol');
    const avatar = localStorage.getItem('avatar');

    let userLogin: string | null = null;
    let rolLogin: string | null = null;
    let AvatarLogin: string | null = null;

    this.userLogin$.subscribe(value => userLogin = value);
    this.rolLogin$.subscribe(value => rolLogin = value);
    this.avatarLogin$.subscribe(value => AvatarLogin = value);

    if (user && rol) {
      if (userLogin === null && rolLogin === null) {
        this.store.dispatch(authActions.login({ username: user, rol: rol, avatar: 'https://robohash.org/providentverocorrupti.png?size=50x50&set=set1'}));
      }
      return true;
    } else {
      return false;
    }
  }

  getUserData(): Observable<{ usuario: string | null; rol: string | null}> {
    return combineLatest([this.userLogin$, this.rolLogin$]).pipe(
      map(([usuario, rol]) => ({ usuario, rol }))
    );
  }

  logout(): void {
    localStorage.removeItem('user');
    localStorage.removeItem('rol');
    localStorage.removeItem('avatar');
    this.store.dispatch(authActions.logout());
    this.router.navigate(['']);
  }

  isLoggedIn(): Observable<boolean> {
    return this.isLogin$;
  }

}
