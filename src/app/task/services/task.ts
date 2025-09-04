import { inject, Injectable, signal } from '@angular/core';
import {
  addDoc,
  collection,
  collectionData,
  Firestore,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
} from '@angular/fire/firestore';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { AuthStateService } from '../../shared/data-access/auth-state.service';

export interface Task {
  id: string;
  area: string;
  task: string;
  initialDate: string;
  finalDate: string;
  time: string;
  completed: boolean;
  finalDateTime: string;
}

export type TaskCreate = Omit<Task, 'id' | 'finalDate' | 'time'>;
// export type TaskCreate = Omit<Task, 'id' | 'finalDate' | 'time'> & { userId: string };

const PATH = 'task-test';

@Injectable()
export class TaskService {
  private _firestore = inject(Firestore);
  private _collection = collection(this._firestore, PATH);
  private _authState = inject(AuthStateService);
  private _query = query(
    this._collection,
    where('userId', '==', this._authState.currentUser?.uid)
  )

  loading = signal<boolean>(true);

  getTasks = toSignal(
    (
      collectionData(this._query, { idField: 'id' }) as Observable<Task[]>
    ).pipe(
      tap(() => this.loading.set(false)),
      catchError((error) => {
        this.loading.set(false);
        return throwError(() => error);
      })
    ),
    { initialValue: [] }
  );

  getTask(id: string) {
    const docRef = doc(this._collection, id);
    return getDoc(docRef);
  }

  create(task: TaskCreate) {
    return addDoc(this._collection, {
      ...task,
      userId: this._authState.currentUser?.uid,
    });
  }

  update(task: TaskCreate, id: string) {
    const docRef = doc(this._collection, id);
    return updateDoc(docRef, {
      ...task,
      userId: this._authState.currentUser?.uid,
    });
  }
}
