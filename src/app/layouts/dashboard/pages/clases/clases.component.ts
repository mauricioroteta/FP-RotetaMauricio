import { Component, Output, EventEmitter } from '@angular/core';
import { CLASES } from './models';
import { MatDialog } from '@angular/material/dialog';
import { ClaseDialogComponent } from './components/clase-dialog/clase-dialog.component';
import { ListaAlumnosComponent } from './components/lista-alumnos/lista-alumnos.component';
import Swal from 'sweetalert2';
import { clasesService } from '../../../../core/services/clases.service';
import { AlumnosService } from '../../../../core/services/alumnos.service';
import { ALUMNOS} from '../../../../layouts/dashboard/pages/students/models';


import { AuthService } from '../../../../core/services/auth.service';
import { Observable, Subscription, map } from 'rxjs';

import { authRolLogin } from '../../../../store/auth.selectors';
import { Store } from '@ngrx/store';


@Component({
  selector: 'app-Clases',
  templateUrl: './Clases.component.html',
  styleUrl: './clases.component.scss',
})
export class ClasesComponent {
  displayedColumns: string[] = [
    'id',
    'nombreCurso',
    'fechaIni',
    'horaIni',
    'horaFin',
    'actions'
  ];

  loading = false;
  rolLogin$: Observable<string | null>;
  userData: Subscription = new Subscription();
  isAdmin: boolean = false;

  clases: CLASES[] = [];
  alumnosByCurso: ALUMNOS[] = [];

  constructor(private matDialog: MatDialog,
    private AlumnosService: AlumnosService,
    private clasesService: clasesService, private authService: AuthService, private store: Store,
    public dialog: MatDialog) {
    this.rolLogin$ = this.store.select(authRolLogin);
  }

  ngOnInit(): void {
    this.loading = true;
    this.userData = this.authService.getUserData().subscribe((userData) => {
      if (userData.rol === 'admin') {
        this.isAdmin = true;
      }
    });
    this.clasesService.getClases().subscribe({
      next: (clases) => {
        this.clases = clases;
      },
      error: () => {
        Swal.fire('Error', 'Ocurrio un error', 'error');
      },
      complete: () => {
        this.loading = false;
      }
    })
  }

openDialog(editingClass?: CLASES): void {
  this.matDialog
    .open(ClaseDialogComponent, {
      data: editingClass,
    })
    .afterClosed()
    .subscribe({
      next: (result) => {
        if (result) {
          if (editingClass) {
            this.clasesService.updateClase(editingClass.id.toString(), result).subscribe({
              next: (data) => {
                this.clases.push(data);
                this.getClases();
              },
            });
          } else {
            this.clasesService.createClase(result).subscribe({
              next: (data) => {
                this.clases.push(data);
                this.getClases();
              },
            });
          }
        }
      },
    });
}

getClases(): void {
  this.clasesService.getClases().subscribe({
    next: (data) => {
      this.clases = data;
    },
  });
}

onListaAlumnos(nombreCurso: string): void {
  this.AlumnosService.getAlumnosByCurso(nombreCurso).subscribe((alumnos) => {
    this.alumnosByCurso = alumnos;
    this.dialog.open(ListaAlumnosComponent, {
      data: {
        alumnos: alumnos
      }
    });
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
        this.clasesService.deleteClase(id).subscribe((data) => {
          Swal.fire({
            title: 'Clase eliminado',
            icon: 'success',
          });
          this.clases = this.clases.filter(clase => clase.id !== id);
        });
        Swal.fire('¡Eliminado!', 'El Clase ha sido eliminada.', 'success');
      }
    });
  }

  getPageNumbers(): number[] {
    const pageCount = Math.ceil(this.clases.length / this.pageSize);
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
    return Math.ceil(this.clases.length / this.pageSize);
  }

  getPaginatedClases(): any[] {
    const startIndex = (this.p - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    return this.clases.slice(startIndex, endIndex);
  }
}
