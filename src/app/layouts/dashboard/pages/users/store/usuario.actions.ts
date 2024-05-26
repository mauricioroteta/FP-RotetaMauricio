import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { USUARIOS, CreateUSUARIOPayload } from '../models';
import { HttpErrorResponse } from '@angular/common/http';

export const UsuarioActions = createActionGroup({
  source: 'Usuario',
  events: {
    'Load Usuarios': emptyProps(),
    'Load Usuarios Success': props<{ data: USUARIOS[] }>(),
    'Load Usuarios Failure': props<{ error: unknown }>(),

    'Create Usuario': props<{ payload: CreateUSUARIOPayload }>(),
    'Create Usuario Success': props<{ data: USUARIOS }>(),
    'Create Usuario Failure': props<{ error: unknown }>(),

    'Delete Usuario': props<{ id: string }>(),
    'Delete Usuario Success': props<{ data: USUARIOS }>(),
    'Delete Usuario Failure': props<{ error: HttpErrorResponse }>(),

    'Update Usuario': props<{ id: string; payload: CreateUSUARIOPayload }>(),
    'Update Usuario Success': props<{ data: USUARIOS }>(),
    'Update Usuario Failure': props<{ error: HttpErrorResponse }>(),

    'Load Usuario por Id':props<{ id: string }>(),
    'Load Usuario Por Id Success': props<{ data: USUARIOS | null }>(),
    'Load Usuario Por Id Failure': props<{ error: any }>(),

    'Load Usuario por Nombre':props<{ nombreUsuario: string }>(),
    'Load Usuario Por Nombre Success': props<{ data: USUARIOS[] | null }>(),
    'Load Usuario Por Nombre Failure': props<{ error: any }>(),
  }
});
