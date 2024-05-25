import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { ALUMNOS, ICreateAlumnoPayload } from '../models';
import { HttpErrorResponse } from '@angular/common/http';

export const AlumnoActions = createActionGroup({
  source: 'Alumno',
  events: {
    'Load Alumnos': emptyProps(),
    'Load Alumnos Success': props<{ data: ALUMNOS[] }>(),
    'Load Alumnos Failure': props<{ error: unknown }>(),

    'Create Alumno': props<{ payload: ICreateAlumnoPayload }>(),
    'Create Alumno Success': props<{ data: ALUMNOS }>(),
    'Create Alumno Failure': props<{ error: unknown }>(),

    'Delete Alumno': props<{ id: string }>(),
    'Delete Alumno Success': props<{ data: ALUMNOS }>(),
    'Delete Alumno Failure': props<{ error: HttpErrorResponse }>(),

    'Update Alumno': props<{ id: string; payload: ICreateAlumnoPayload }>(),
    'Update Alumno Success': props<{ data: ALUMNOS }>(),
    'Update Alumno Failure': props<{ error: HttpErrorResponse }>(),

    'Load Alumnos By Clase': emptyProps(),
    'Load Alumnos By Clase Success': props<{ data: ALUMNOS[] }>(),
    'Load Alumnos By Clase Failure': props<{ error: unknown }>(),
  },
});
