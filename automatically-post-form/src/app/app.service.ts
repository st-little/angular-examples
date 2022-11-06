import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, of, Subject } from 'rxjs';
import { catchError, concatMap, map, tap } from 'rxjs/operators';

export interface User {
  name: string;
}

export interface PostUserQueue {
  user: User;
  isAutoSave: boolean;
}

@Injectable()
export class AppService {
  private postUserQueue = new Subject<PostUserQueue>();
  public postUserQueue$: Observable<number>;

  constructor(private http: HttpClient, private snackBar: MatSnackBar) {
    this.postUserQueue$ = this.postUserQueue.pipe(
      concatMap((queue) => this.postUser(queue.user, queue.isAutoSave))
    );
  }

  addToPostUserQueue(queue: PostUserQueue) {
    console.log('Add To PostUserQueue: ', queue);
    this.postUserQueue.next(queue);
  }

  postUser(user: User, isAutoSave: boolean): Observable<number> {
    console.log('Post user: ', user);
    return this.http.post('/user', user, { observe: 'response' }).pipe(
      map((res) => res.status),
      catchError((err: HttpErrorResponse) => of(err.status)),
      tap((status) => {
        const msg: string =
          status === 200 ? 'Successfully added user.' : 'Failed to add user.';

        if (isAutoSave) {
          console.log(`Auto save: ${msg}`);
        } else {
          console.log(`On submit: ${msg}`);
          this.snackBar.open(msg);
        }
      })
    );
  }
}
