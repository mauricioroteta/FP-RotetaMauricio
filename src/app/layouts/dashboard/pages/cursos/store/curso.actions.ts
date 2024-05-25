import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { CURSOS, ICreateCursoPayload } from '../models';
import { HttpErrorResponse } from '@angular/common/http';

export const CursoActions = createActionGroup({
  source: 'Curso',
  events: {
    'Load Cursos': emptyProps(),
    'Load Cursos Success': props<{ data: CURSOS[] }>(),
    'Load Cursos Failure': props<{ error: unknown }>(),

    'Create Curso': props<{ payload: ICreateCursoPayload }>(),
    'Create Curso Success': props<{ data: CURSOS }>(),
    'Create Curso Failure': props<{ error: unknown }>(),

    'Delete Curso': props<{ id: string }>(),
    'Delete Curso Success': props<{ data: CURSOS }>(),
    'Delete Curso Failure': props<{ error: HttpErrorResponse }>(),

    'Update Curso': props<{ id: string; payload: ICreateCursoPayload }>(),
    'Update Curso Success': props<{ data: CURSOS }>(),
    'Update Curso Failure': props<{ error: HttpErrorResponse }>(),
  }
});
