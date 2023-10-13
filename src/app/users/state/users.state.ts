import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { catchError, lastValueFrom, tap } from 'rxjs';
import { IPageable } from 'src/app/models/core.model';
import { User } from '../models/user.model';
import { UsersService } from '../service/users.service';
import { FavorUser, GetNewUsers, GetUsers, UnfavorUser } from './users.actions';

export interface UsersStateModel {
  users: User[];
  total: number;
  paginationParams: IPageable;
  pageForGetUser: number;
  favoriteUsers: User[];
  total_pages: number;
}

@State<UsersStateModel>({
  name: 'users',
  defaults: {
    users: [],
    total: 0,
    paginationParams: { limit: 10, page: 1 },
    pageForGetUser: 1,
    favoriteUsers: [],
    total_pages: 0,
  },
})
@Injectable()
export class UsersState {
  constructor(private readonly userService: UsersService) {}

  @Selector([UsersState])
  static users(state: UsersStateModel) {
    return state.users;
  }

  @Selector([UsersState])
  static favoriteUsers(state: UsersStateModel) {
    return state.favoriteUsers;
  }

  @Selector([UsersState])
  static favoriteUsersIds(state: UsersStateModel) {
    return state.favoriteUsers.map((u) => u.id);
  }

  @Action(GetUsers)
  getUsers({ patchState, getState }: StateContext<UsersStateModel>) {
    const { paginationParams, users } = getState();
    if (users.length) return;
    return this.userService.getUsers(paginationParams).pipe(
      tap((results: { data: User[]; total: number; total_pages: number }) => {
        if (results.data) {
          patchState({
            users: results.data,
            total: results.total,
            total_pages: results.total_pages,
            pageForGetUser: results.total,
          });
        }
      }),
      catchError((error) => {
        throw new Error(error?.message);
      }),
    );
  }

  @Action(GetNewUsers)
  getNewUsers({ patchState, getState }: StateContext<UsersStateModel>) {
    const { pageForGetUser, users, total } = getState();
    const pageParams: IPageable = {
      limit: 1,
      page: pageForGetUser,
    };
    return this.userService.getUsers(pageParams).pipe(
      tap((results: { data: User[]; total: number }) => {
        if (results.data) {
          patchState({
            users: [...results.data, ...users.slice(0, -1)],
            pageForGetUser: pageForGetUser === 1 ? total : pageForGetUser - 1,
          });
        }
      }),
      catchError((error) => {
        throw new Error(error?.message);
      }),
    );
  }

  @Action(FavorUser)
  favorUser({ getState, patchState }: StateContext<UsersStateModel>, { user }: FavorUser) {
    const { favoriteUsers } = getState();
    patchState({
      favoriteUsers: [...favoriteUsers, user],
    });
  }

  @Action(UnfavorUser)
  unfavorUser({ getState, patchState }: StateContext<UsersStateModel>, { id }: UnfavorUser) {
    const { favoriteUsers } = getState();
    const index = favoriteUsers.findIndex((u) => u.id === id);
    if (index !== -1) {
      const cloneArr = [...favoriteUsers];
      cloneArr.splice(index, 1);
      patchState({
        favoriteUsers: cloneArr,
      });
    }
  }
}
