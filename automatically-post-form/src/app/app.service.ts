import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

export interface User {
  name: string;
}

export interface PostUserQueue {
  user: User;
  isAutoSave: boolean;
}

@Injectable()
export class AppService {
  constructor(private http: HttpClient, private snackBar: MatSnackBar) {}

  postUser(user: User): Observable<number> {
    console.log('Post user: ', user);
    return this.http.post('/user', user, { observe: 'response' }).pipe(
      map((res) => res.status),
      catchError((err: HttpErrorResponse) => of(err.status)),
      tap((status) => {
        const msg: string =
          status === 200 ? 'Successfully added user.' : 'Failed to add user.';
        this.snackBar.open(msg);
      })
    );
  }
}
