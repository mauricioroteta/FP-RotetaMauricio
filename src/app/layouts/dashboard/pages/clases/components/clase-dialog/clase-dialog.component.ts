import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CLASES } from '../../models';
import { telefonoValidator, isValidCUITCUIL } from '../../../../../../shared/validators';
import { DatePipe } from '@angular/common'; // Importa el DatePipe
import { AuthService } from '../../../../../../core/services/auth.service';
import { Observable, Subscription } from 'rxjs';

import { CursosService } from './../../../../../../core/services/cursos.service';
import { ListaCursos } from './../../../cursos/models';

@Component({
  selector: 'app-Clase-dialog',
  templateUrl: './Clase-dialog.component.html',
  styleUrl: './clase-dialog.component.scss',
})

export class ClaseDialogComponent {
  Curso: string[] = [];

  ClaseForm: FormGroup;

  isAdmin: boolean | undefined;
  userData: Subscription = new Subscription();

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private matDialogRef: MatDialogRef<ClaseDialogComponent>,
    private CursosService: CursosService,
    @Inject(MAT_DIALOG_DATA) private editingUser?: CLASES,
  ) {
    this.ClaseForm = this.formBuilder.group({
      idCurso:[],
      nombreCurso: [
        '',
        [Validators.required],
      ],
      fechaIni: [
        '',
        [Validators.required]],
      horaIni: [
        '',
        [Validators.required]],
      horaFin: [
        '',
        [Validators.required]],
    });

    if (editingUser) {
      this.ClaseForm.patchValue(editingUser);
    }
  }

  get idCursoControl() {
    return this.ClaseForm.get('idCurso');
  }

  get NombreCursoControl() {
    return this.ClaseForm.get('nombreCurso');
  }

  get fechaIniControl() {
    return this.ClaseForm.get('fechaIni');
  }

  get horaIniControl() {
    return this.ClaseForm.get('HoraIni');
  }

  get horaFinControl() {
    return this.ClaseForm.get('HoraFin');
  }

  onSave(): void {
    if (this.ClaseForm.invalid) {
      this.ClaseForm.markAllAsTouched();
    } else {
      this.matDialogRef.close(this.ClaseForm.value);
    }
  }

  ngOnInit(): void {
    this.userData = this.authService.getUserData().subscribe((userData) => {
      if (userData.rol === 'admin') {
        this.isAdmin = true;
      }
    });
    this.CursosService.getListaCursos().subscribe({
      next: (curso) => {

        this.Curso = curso;
      }
    });
  }

}
