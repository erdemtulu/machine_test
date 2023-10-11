import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Actions, ofActionDispatched, ofActionSuccessful, Select, Store } from '@ngxs/store';
import { BehaviorSubject, filter, interval, Observable, of, skip, switchMap, takeUntil, takeWhile } from 'rxjs';
import { User } from './models/user.model';
import { AddUserFromNewUsers, FavorUser, GetNewUsers, GetUsers, UnfavorUser } from './state/users.actions';
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

  @Select(UsersState.favoriteUsersIds)
  favoriteUsersIds$: Observable<number[]>;

  favoriteUsersIds: number[];
  switchValue = false;

  ngOnInit(): void {
    this.actions$
      .pipe(ofActionDispatched(GetUsers, AddUserFromNewUsers), untilDestroyed(this))
      .subscribe(() => (this.loading = true));
    this.actions$
      .pipe(ofActionSuccessful(GetUsers, AddUserFromNewUsers), untilDestroyed(this))
      .subscribe(() => (this.loading = false));
    this.store.dispatch(new GetUsers());
    this.favoriteUsersIds$.pipe(untilDestroyed(this)).subscribe((res) => (this.favoriteUsersIds = res));
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

  onFavorClicked(user: User) {
    this.store.dispatch(this.isFavored(user.id) ? new UnfavorUser(user.id) : new FavorUser(user));
  }

  isFavored(id: number): boolean {
    return this.favoriteUsersIds.findIndex((uid) => uid === id) !== -1;
  }
}
