export class GetUsers {
  static readonly type = '[Users] Get Users';
}

export class GetUser {
  static readonly type = '[Users] Get User';

  constructor(public readonly payload: { id: string }) {}
}
