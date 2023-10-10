import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IPageable } from 'src/app/models/core.model';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  constructor(private readonly http: HttpClient) {}

  getUsers(pageable: IPageable): Observable<{ data: User[]; total: number }> {
    const url = 'https://reqres.in/api/users';
    const params = this.prepareParams(pageable);
    return this.http.get<{ data: User[]; total: number }>(url, {
      params,
    });
  }

  private prepareParams(pageable?: IPageable): HttpParams {
    let params = new HttpParams();

    if (pageable) {
      const { page, limit, filter } = pageable;

      if (page) {
        params = params.append('page', page.toString());
      }

      if (limit) {
        params = params.append('per_page', limit.toString());
      }

      if (filter) {
        params = params.append('filter', filter.toString());
      }
    }

    return params;
  }
}
