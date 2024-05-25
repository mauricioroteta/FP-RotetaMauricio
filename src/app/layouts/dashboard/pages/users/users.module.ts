import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { usersRoutingModule } from './users-routing.module';
import { usersComponent } from './users.component';
import { userDialogComponent } from './components/user-dialog/user-dialog.component';
import { SharedModule } from '../../../../shared/shared.module';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import {MatProgressBarModule} from '@angular/material/progress-bar';

import { EffectsModule } from '@ngrx/effects';
import { UsuarioEffects } from './store/usuario.effects';
import { StoreModule } from '@ngrx/store';
import { usuarioFeature } from './store/usuario.reducer';

@NgModule({
  declarations: [
    usersComponent,
    userDialogComponent
  ],
  imports: [
    CommonModule,
    usersRoutingModule,
    SharedModule,
    MatCardModule,
    MatGridListModule,
    MatProgressBarModule,
    SharedModule,
    StoreModule.forFeature(usuarioFeature),
    EffectsModule.forFeature([UsuarioEffects])
  ],
  exports: [usersComponent]
})
export class usersModule { }
