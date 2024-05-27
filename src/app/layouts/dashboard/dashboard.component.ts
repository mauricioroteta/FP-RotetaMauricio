import { Component, OnDestroy, OnInit, EventEmitter, Output, inject } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatSlideToggleChange, MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, map, shareReplay  } from 'rxjs';
import { Subscription, Observable } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import { UsuarioRol } from './pages/users/models';
import { DataSource } from '@angular/cdk/collections';
import { LoginModule } from '../login/login.module';
import { authIsLogin, authUserLogin, authRolLogin, authAvatarLogin } from '../../store/auth.selectors';
import { Store } from '@ngrx/store';

import { userDialogComponent } from '../dashboard/pages/users/components/user-dialog/user-dialog.component';
import { USUARIOS } from '../dashboard/pages/users/models';
import { selectUsuario, selectUsuarios, selectUsuariosLoading } from '../dashboard/pages/users/store/usuario.selectors';
import { selectCursosError } from '../dashboard/pages/cursos/store/curso.selectors';
import { UsuarioActions } from '../dashboard/pages/users/store/usuario.actions';
import { MatDialog } from '@angular/material/dialog';

interface UserData {
  usuario: string;
  rol: string;
  avatar: string;
  nombreCompleto: string;
  isAdmin: boolean;
}
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})

export class DashboardComponent implements OnInit, OnDestroy {
  showFiller = false;
  titulo: string = '';
  isAuthenticated: boolean = false;
  authSubscription: Subscription;
  userData$?: Observable<UserData>;
  userData: Subscription = new Subscription();
  isAdmin: boolean = false;
  userName: string | null= '';
  user: string | null= '';
  rol: string | null= '';
  avatar: string | null= '';

  isLogin$: Observable<boolean>;
  userLogin$: Observable<string | null>;
  rolLogin$: Observable<string | null>;
  AvatarLogin$: Observable<string | null>;


  @Output() readonly darkModeSwitched = new EventEmitter<boolean>();

  private breakpointObserver = inject(BreakpointObserver);

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  onDarkModeSwitched({checked}: MatSlideToggleChange) {
    this.darkModeSwitched.emit(checked);
  }


  isMobile(): boolean {
    return window.innerWidth <= 600;
  }

  constructor(private matDialog: MatDialog, private router: Router, private activatedRoute: ActivatedRoute, private authService: AuthService,
    private store: Store
  ) {
      this.isLogin$ = this.store.select(authIsLogin);
      this.userLogin$ = this.store.select(authUserLogin);
      this.rolLogin$ = this.store.select(authRolLogin);
      this.AvatarLogin$ = this.store.select(authAvatarLogin);

      this.authSubscription = this.authService.isLoggedIn().subscribe((loggedIn: boolean) => {
      this.isAuthenticated = loggedIn;
      this.userName = localStorage.getItem('nombre');
      this.rol = localStorage.getItem('rol');
      this.avatar = localStorage.getItem('avatar');
      this.user = localStorage.getItem('user');

      if (localStorage.getItem('user')) {
        this.isAuthenticated = true;
      }
      // if (loggedIn || this.isAuthenticated) {
      //   this.userData? = this.authService.getUserData();
      //   this.router.navigate(['/home']);
      // }
    });
  }

  ngOnDestroy(): void {
    this.authSubscription.unsubscribe();
  }


  usrInfo(editingUser?: USUARIOS): void {
    var nombreUsuario = "admin";
    this.store.dispatch(UsuarioActions.loadUsuarioPorNombre({ nombreUsuario }))

      this.matDialog
      .open(userDialogComponent, {
        data: editingUser,
      })
      .afterClosed()
      .subscribe({
        next: (result) => {
          if (result) {
            if (editingUser) {
              this.store.dispatch(
                UsuarioActions.updateUsuario({
                  id: editingUser.id.toString(),
                  payload: result,
                })
              );
            }
          }
        },
      });
  }

  ngOnInit(): void {
    this.userData = this.authService.getUserData().subscribe((userData) => {
      if (userData.rol === 'admin') {
        this.isAdmin = true;
      } else {
        this.isAdmin = false;
      }
    });
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => this.activatedRoute),
      map(route => {
        while (route.firstChild) route = route.firstChild;
        return route;
      }),
      filter(route => route.outlet === 'primary'),
      map(route => route.snapshot.data as { titulo: string })
    ).subscribe(data => {
      this.titulo = data.titulo;
    });
  }

  logout(): void {
    this.authService.logout();
  }
}
