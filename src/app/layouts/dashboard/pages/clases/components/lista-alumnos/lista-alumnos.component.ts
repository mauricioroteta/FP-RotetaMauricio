import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ALUMNOS } from '../../../../../../layouts/dashboard/pages/students/models';

@Component({
  selector: 'app-lista-alumnos',
  templateUrl: './lista-alumnos.component.html',
  styleUrls: ['./lista-alumnos.component.scss']
})
export class ListaAlumnosComponent {
  displayedColumns: string[] = ['avatar', 'nombre', 'apellido', 'telefono', 'email'];

  constructor(
    public dialogRef: MatDialogRef<ListaAlumnosComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { alumnos: ALUMNOS[] }
  ) {}

  onClose(): void {
    this.dialogRef.close();
  }
}
