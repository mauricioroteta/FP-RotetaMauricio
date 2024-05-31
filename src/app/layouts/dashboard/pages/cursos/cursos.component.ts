import { Component, Output, EventEmitter } from '@angular/core';
import { CURSOS } from './models';
import { MatDialog } from '@angular/material/dialog';
import { CursoDialogComponent } from './components/curso-dialog/curso-dialog.component';
import Swal from 'sweetalert2';
import { CursosService } from '../../../../core/services/cursos.service';

//import { AuthService } from '../../../../core/services/auth.service';
import { Observable, Subscription, map } from 'rxjs';

import { authRolLogin } from '../../../../store/auth.selectors';
import { Store } from '@ngrx/store';


import { CursoActions } from './store/curso.actions';
import { selectCursos, selectCursosError } from './store/curso.selectors';

@Component({
  selector: 'app-Cursos',
  templateUrl: './Cursos.component.html',
  styleUrl: './cursos.component.scss',
})

export class CursosComponent {
  displayedColumns: string[] = [
    'id',
    'curso',
    'Categoria',
    'NroClases',
    'dificultad',
    'descripcion',
    'actions'
  ];

  loading = false;

  userData: Subscription = new Subscription();
  isAdmin: boolean = false;

  Cursos: CURSOS[] = [];
  cursos$: Observable<CURSOS[]>;
  loading$: Observable<boolean>;
  rolLogin$: Observable<string | null>;
  error$: Observable<Error>;
  constructor(private matDialog: MatDialog, private CursosService: CursosService, private store: Store) {
    this.rolLogin$ = this.store.select(authRolLogin);
    this.loading$ = this.store.select(selectClasesLoading);
    this.cursos$ = this.store.select(selectCursos);
    this.error$ = this.store
      .select(selectCursosError)
      .pipe(map((err) => err as Error));
  }

  // Implementacion con Observable
  ngOnInit(): void {
    this.store.dispatch(CursoActions.loadCursos());
  }

  openDialog(editingUser?: CURSOS): void {
    this.matDialog
      .open(CursoDialogComponent, {
        data: editingUser,
      })
      .afterClosed()
      .subscribe({
        next: (result) => {
          if (result) {
            if (editingUser) {
              this.store.dispatch(
                CursoActions.updateCurso({
                  id: editingUser.id,
                  payload: result,
                })
              );
            } else {
              this.store.dispatch(
                CursoActions.createCurso({ payload: result })
              );
            }
          }
        },
      });
  }

  onDeleteUser(id: string): void {
    Swal.fire({
      title: '¿Está seguro?',
      text: 'El registro se eliminara permanentemente',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.CursosService.deleteCurso(id).subscribe((data) => {
          Swal.fire({
            title: 'Curso eliminado',
            icon: 'success',
          });
          this.Cursos = this.Cursos.filter(curso => curso.id !== id);
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire({
          title: 'Petición Cancelada',
          icon: 'error',
        });
      }
    });
  }

  onListaAlumnos(id: string): void {
  }

  getPageNumbers(): number[] {
    const pageCount = Math.ceil(this.Cursos.length / this.pageSize);
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
    return Math.ceil(this.Cursos.length / this.pageSize);
  }
  getPaginatedCursos(): any[] {
    const startIndex = (this.p - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    return this.Cursos.slice(startIndex, endIndex);
  }
}
function selectClasesLoading(state: object): boolean {
  throw new Error('Function not implemented.');
}

