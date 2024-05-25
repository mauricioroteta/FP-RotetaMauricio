import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StudentsRoutingModule } from './students-routing.module';
import { StudentsComponent } from './students.component';
import { StudentDialogComponent } from './components/student-dialog/student-dialog.component';
import { SharedModule } from '../../../../shared/shared.module';
import {MatCardModule} from '@angular/material/card';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatProgressBarModule} from '@angular/material/progress-bar';

import { EffectsModule } from '@ngrx/effects';
import { AlumnoEffects } from './store/alumno.effects';
import { StoreModule } from '@ngrx/store';
import { alumnoFeature } from './store/alumno.reducer';

@NgModule({
  declarations: [
    StudentsComponent,
    StudentDialogComponent
  ],
  imports: [
    CommonModule,
    StudentsRoutingModule,
    SharedModule,
    MatCardModule,
    MatGridListModule,
    MatProgressBarModule,
    StoreModule.forFeature(alumnoFeature),
    EffectsModule.forFeature([AlumnoEffects])
  ],
  exports: [StudentsComponent]
})
export class StudentsModule { }
