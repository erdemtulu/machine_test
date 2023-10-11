import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsersRoutingModule } from './users-routing.module';
import { UsersComponent } from './users.component';
import { NgxsModule } from '@ngxs/store';
import { UsersState } from './state/users.state';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [UsersComponent],
  imports: [
    CommonModule,
    UsersRoutingModule,
    NgxsModule.forFeature([UsersState]),
    NzTableModule,
    NzSwitchModule,
    ReactiveFormsModule,
    FormsModule,
  ],
})
export class UsersModule {}
