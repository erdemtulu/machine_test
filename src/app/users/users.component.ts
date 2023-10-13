import { Component, OnDestroy, OnInit } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Actions, ofActionDispatched, ofActionErrored, ofActionSuccessful, Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { User } from './models/user.model';
import { FavorUser, GetNewUsers, GetUsers, UnfavorUser } from './state/users.actions';
import { UsersState } from './state/users.state';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.less'],
})
@UntilDestroy()
export class UsersComponent implements OnInit, OnDestroy {
  constructor(
    private readonly store: Store,
    private actions$: Actions,
  ) {}

  loading = false;

  @Select(UsersState.users)
  users$: Observable<User[]>;

  @Select(UsersState.favoriteUsersIds)
  favoriteUsersIds$: Observable<number[]>;

  favoriteUsersIds: number[];
  isFavorDisabled = false;
  switchValue = false;
  timer: ReturnType<typeof setInterval>;

  ngOnInit(): void {
    this.actions$
      .pipe(ofActionDispatched(GetUsers, GetNewUsers), untilDestroyed(this))
      .subscribe(() => (this.loading = true));
    this.actions$
      .pipe(ofActionSuccessful(GetUsers, GetNewUsers), untilDestroyed(this))
      .subscribe(() => (this.loading = false));
    this.actions$
      .pipe(ofActionErrored(GetUsers, GetNewUsers), untilDestroyed(this))
      .subscribe(() => ((this.loading = false), alert('Error getting users')));

    this.store.dispatch(new GetUsers());
    this.favoriteUsersIds$.pipe(untilDestroyed(this)).subscribe((res) => {
      this.favoriteUsersIds = res;
      this.isFavorDisabled = res.length === 10;
    });
  }

  toggled(e: boolean) {
    if (e) {
      this.timer = setInterval(() => {
        this.store.dispatch(new GetNewUsers());
      }, 5000);
    } else clearInterval(this.timer);
  }

  onFavorClicked(user: User) {
    this.store.dispatch(this.isFavored(user.id) ? new UnfavorUser(user.id) : new FavorUser(user));
  }

  isFavored(id: number): boolean {
    return this.favoriteUsersIds.findIndex((uid) => uid === id) !== -1;
  }

  ngOnDestroy(): void {
    if (this.timer) clearInterval(this.timer);
  }
}
