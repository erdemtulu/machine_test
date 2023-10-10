import { Component, OnInit } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Actions, ofActionDispatched, ofActionSuccessful, Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { User } from './models/user.model';
import { GetUsers } from './state/users.actions';
import { UsersState } from './state/users.state';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.less'],
})
@UntilDestroy()
export class UsersComponent implements OnInit {
  constructor(
    private readonly store: Store,
    private actions$: Actions,
  ) {}

  loading = false;

  @Select(UsersState.users)
  users$: Observable<User[]>;

  ngOnInit(): void {
    this.actions$.pipe(ofActionDispatched(GetUsers), untilDestroyed(this)).subscribe(() => (this.loading = true));
    this.actions$.pipe(ofActionSuccessful(GetUsers), untilDestroyed(this)).subscribe(() => (this.loading = false));
    this.store.dispatch(new GetUsers());
  }
}
