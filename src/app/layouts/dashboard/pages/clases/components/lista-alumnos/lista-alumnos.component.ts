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
  selector: 'app-lista-alumnos',
  templateUrl: './lista-alumnos.component.html',
  styleUrl: './lista-alumnos.component.scss'
})
export class ListaAlumnosComponent {
  ClaseForm: FormGroup;
  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private matDialogRef: MatDialogRef<ListaAlumnosComponent>,
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

  }

}
