import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { tap } from 'rxjs';
import { IPageable } from 'src/app/models/core.model';
import { User } from '../models/user.model';
import { UsersService } from '../service/users.service';
import { GetUsers } from './users.actions';

export interface UsersStateModel {
  loading: boolean;
  users: User[];
  total: number;
  paginationParams: IPageable;
}

@State<UsersStateModel>({
  name: 'users',
  defaults: {
    loading: false,
    users: [],
    total: 0,
    paginationParams: { limit: 10, page: 1, filter: '' },
  },
})
@Injectable()
export class UsersState {
  constructor(private readonly userService: UsersService) {}

  @Selector([UsersState])
  static users(state: UsersStateModel) {
    return state.users;
  }

  @Action(GetUsers)
  getUsers({ patchState, getState }: StateContext<UsersStateModel>) {
    const { paginationParams } = getState();
    return this.userService.getUsers(paginationParams).pipe(
      tap((results: { data: User[]; total: number }) => {
        if (results.data) {
          patchState({
            users: results.data,
          });
        }
      }),
    );
  }
}
