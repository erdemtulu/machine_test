import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsersRoutingModule } from './users-routing.module';
import { UsersComponent } from './users.component';
import { NgxsModule } from '@ngxs/store';
import { UsersState } from './state/users.state';
import { NzTableModule } from 'ng-zorro-antd/table';

@NgModule({
  declarations: [UsersComponent],
  imports: [CommonModule, UsersRoutingModule, NgxsModule.forFeature([UsersState]), NzTableModule],
})
export class UsersModule {}
