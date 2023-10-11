import { User } from '../models/user.model';

export class GetUsers {
  static readonly type = '[Users] Get Users';
}

export class GetNewUsers {
  static readonly type = '[Users] Get New User';
}

export class AddUserFromNewUsers {
  static readonly type = '[Users] Add User From New Users';
}

export class FavorUser {
  static readonly type = '[Users] Favor User';
  constructor(public readonly user: User) {}
}

export class UnfavorUser {
  static readonly type = '[Users] Unfavor User';
  constructor(public readonly id: number) {}
}
