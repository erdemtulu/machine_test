import { Component } from '@angular/core';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';
import { UsersState } from '../state/users.state';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.less'],
})
export class FavoritesComponent {
  @Select(UsersState.favoriteUsers)
  favoriteUsers$: Observable<User[]>;
}
