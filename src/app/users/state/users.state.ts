import { IPageable } from 'src/app/models/core.model';
import { User } from '../models/user.model';

export interface UsersStateModel {
  loading: boolean;
  iltCourses: User[];
  total: number;
  paginationParams: IPageable;
}