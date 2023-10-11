import { Component, OnInit } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Actions, ofActionDispatched, ofActionSuccessful, Select, Store } from '@ngxs/store';
import { BehaviorSubject, filter, interval, Observable, of, skip, switchMap, takeUntil, takeWhile } from 'rxjs';
import { User } from './models/user.model';
import { AddUserFromNewUsers, GetNewUsers, GetUsers } from './state/users.actions';
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

  @Select(UsersState.newUsers)
  newUsers$: Observable<User[]>;

  switchValue = false;

  ngOnInit(): void {
    this.actions$.pipe(ofActionDispatched(GetUsers), untilDestroyed(this)).subscribe(() => (this.loading = true));
    this.actions$.pipe(ofActionSuccessful(GetUsers), untilDestroyed(this)).subscribe(() => (this.loading = false));
    this.store.dispatch(new GetUsers());
  }

  toggled(e: boolean) {
    if (e) {
      interval(5000)
        .pipe(
          untilDestroyed(this),
          takeWhile((_) => this.switchValue),
        )
        .subscribe((s) => this.store.dispatch(new AddUserFromNewUsers()));
    }
  }
}
