import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromAlumno from './alumno.reducer';
import { ALUMNOS } from '../models';

export const selectAlumnoState = createFeatureSelector<fromAlumno.State>(
  fromAlumno.alumnoFeatureKey
);

export const selectAlumnos = createSelector(
  selectAlumnoState,
  (state) => state.alumnos
);

export const selectAlumnoById = (id: string) =>
  createSelector(selectAlumnos,
    (alumnos: ALUMNOS[]) => alumnos.find((alumno) => alumno.id === id)
  );

  // export const selectAlumnosByClaseId = (claseId: string) =>
  //   createSelector(selectAlumnos,
  //   (alumnos) => alumnos.filter(alumno => alumno.clases.includes(claseId))
  // );

  export const selectAlumnosError = createSelector(
  selectAlumnoState,
  (state) => state.error
);

export const selectAlumnosLoading = createSelector(
  selectAlumnoState,
  (state) => state.loading
);
