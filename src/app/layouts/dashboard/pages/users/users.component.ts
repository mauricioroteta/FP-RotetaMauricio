import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { USUARIOS } from './models';
import { MatDialog } from '@angular/material/dialog';
import { userDialogComponent } from './components/user-dialog/user-dialog.component';
import Swal from 'sweetalert2';
import { Observable, Subscription, filter, map, switchMap, take } from 'rxjs';
import { UsuariosService } from '../../../../core/services/usuarios.service';

import { authRolLogin } from '../../../../store/auth.selectors';
import { Store } from '@ngrx/store';

import { selectUsuario, selectUsuarios, selectUsuariosLoading } from './store/usuario.selectors';
import { selectCursosError } from '../cursos/store/curso.selectors';
import { UsuarioActions } from './store/usuario.actions';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
})
export class usersComponent implements OnInit{
  displayedColumns: string[] = [
    'id',
    'avatar',
    'userName',
    'nombre',
    'apellido',
    'telefono',
    'email',
    'rol',
    'actions'
  ];

  loading = false;

  userData: Subscription = new Subscription();
  isAdmin: boolean = false;

  users: USUARIOS[] = [];

  usuarios$: Observable<USUARIOS[]>;

  loading$: Observable<boolean>;
  rolLogin$: Observable<string | null>;
  error$: Observable<Error>;
  usuario$: Observable<USUARIOS | null>;

  constructor(private matDialog: MatDialog, private UsuariosService: UsuariosService, private store: Store) {
    this.rolLogin$ = this.store.select(authRolLogin);
    this.usuarios$ = this.store.select(selectUsuarios);
    this.usuario$ = this.store.select(selectUsuario);
    this.loading$ = this.store.select(selectUsuariosLoading);
    this.error$ = this.store
      .select(selectCursosError)
      .pipe(map((err) => err as Error));
  }

  ngOnInit(): void {
    this.store.dispatch(UsuarioActions.loadUsuarios());
  }

  openDialog(editingUser?: USUARIOS): void {
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
          } else {
            this.store.dispatch(
              UsuarioActions.createUsuario({ payload: result })
            );
          }
        }
      },
    });
    // this.matDialog
    //   .open(userDialogComponent, {
    //     data: editingUser,
    //   })
    //   .afterClosed()
    //   .subscribe({
    //     next: (result) => {
    //       if (result) {
    //         if (editingUser) {
    //           this.users = this.users.map((u) =>
    //             u.id === editingUser.id ? { ...u, ...result } : u
    //           );
    //         } else {
    //           result.id = new Date().getTime().toString().substring(0, 3);
    //           result.createAt = new Date();
    //           this.users = [...this.users, result];
    //         }
    //       }
    //     },
    //   });
  }

  onDeleteUser(id: string): void {
    this.store.dispatch(UsuarioActions.loadUsuarioPorId({ id }));

    this.loading$.pipe(
      filter(loading => !loading),
      take(1),
      switchMap(() => this.usuario$.pipe(take(1)))
    ).subscribe(usuario => {
        Swal.fire({
          title: '¿Está seguro de eliminar el usuario?',
          icon: 'warning',
          showCancelButton: true,
        }).then((result) => {
          if (result.isConfirmed) {
            this.store.dispatch(UsuarioActions.deleteUsuario({ id }));
            Swal.fire({
              title: 'Usuario eliminado',
              icon: 'success',
            });
          }
        });
      }
    );
  }

  getPageNumbers(): number[] {
    const pageCount = Math.ceil(this.users.length / this.pageSize);
    return Array.from({ length: pageCount }, (_, index) => index + 1);
  }

  // Pagina inicial
  p: number = 1;

  // Cantidad de elementos por página
  pageSize: number = 6;
  goToFirstPage(): void {
    this.p = 1;
  }

  goToLastPage(): void {
    this.p = this.getLastPage();
  }

  getLastPage(): number {
    return Math.ceil(this.users.length / this.pageSize);
  }
  getPaginatedusers(): any[] {
    const startIndex = (this.p - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    return this.users.slice(startIndex, endIndex);
  }
}
