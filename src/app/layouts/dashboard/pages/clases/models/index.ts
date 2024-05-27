export interface iClasesAlumno {
  id: string;
  nombreCurso: string;
  clasesPresente: number;
  puntos: number;
}

export interface CLASES {
  id: string;
  idCurso: string;
  nombreCurso: string;
  fechaIni: Date;
  horaIni:  string;
  horaFin: string;
}

export interface ICreateClasePayload {
  idCurso: string | null;
  nombreCurso: string | null;
  fechaIni: Date | null;
  horaIni:  string | null;
  horaFin: string | null;
}
