import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { interval, lastValueFrom, tap } from 'rxjs';
import { IPageable } from 'src/app/models/core.model';
import { User } from '../models/user.model';
import { UsersService } from '../service/users.service';
import { AddUserFromNewUsers, GetNewUsers, GetUsers } from './users.actions';

export interface UsersStateModel {
  loading: boolean;
  users: User[];
  total: number;
  paginationParams: IPageable;
  pageForGetUser: number;
  newUsers: User[];
  total_pages: number;
}

@State<UsersStateModel>({
  name: 'users',
  defaults: {
    loading: false,
    users: [],
    total: 0,
    paginationParams: { limit: 10, page: 1, filter: '' },
    pageForGetUser: 1,
    newUsers: [],
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
  static newUsers(state: UsersStateModel) {
    return state.newUsers;
  }

  @Action(GetUsers)
  getUsers({ patchState, getState }: StateContext<UsersStateModel>) {
    const { paginationParams } = getState();
    return this.userService.getUsers(paginationParams).pipe(
      tap((results: { data: User[]; total: number; total_pages: number }) => {
        if (results.data) {
          patchState({
            users: results.data,
            total: results.total,
            total_pages: results.total_pages,
          });
        }
      }),
    );
  }

  @Action(GetNewUsers)
  getNewUsers({ patchState, getState }: StateContext<UsersStateModel>) {
    const { paginationParams, pageForGetUser } = getState();
    const pageParams: IPageable = {
      limit: paginationParams.limit,
      page: pageForGetUser,
      filter: '',
    };
    return this.userService.getUsers(pageParams).pipe(
      tap((results: { data: User[]; total: number }) => {
        if (results.data) {
          patchState({
            newUsers: results.data,
          });
        }
      }),
    );
  }

  @Action(AddUserFromNewUsers)
  async addUserFromNewUsers({ getState, patchState, dispatch }: StateContext<UsersStateModel>) {
    const { newUsers, users, pageForGetUser, total_pages } = getState();
    if (!newUsers.length) {
      patchState({
        pageForGetUser: pageForGetUser === total_pages ? 1 : pageForGetUser + 1,
      });
      await lastValueFrom(dispatch(new GetNewUsers()));
    }
    const updatedNewUsers = [...getState().newUsers];
    const userToBeAdded: User = updatedNewUsers.pop()!;
    patchState({
      users: [userToBeAdded, ...users.slice(0, -1)],
      newUsers: updatedNewUsers,
    });
  }
}
