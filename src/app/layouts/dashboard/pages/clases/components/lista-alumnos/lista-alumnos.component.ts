import { Component, Inject, Input } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-lista-alumnos',
  templateUrl: './lista-alumnos.component.html',
  styleUrls: ['./lista-alumnos.component.scss']
})
export class ListaAlumnosComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { alumnos: string[] }) {}
  displayedColumns: string[] = ['nombre'];
}
