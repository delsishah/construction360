import { Injectable } from '@angular/core';
import {
  Auth,
  browserSessionPersistence,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  user,
  User,
} from '@angular/fire/auth';
import { setPersistence } from 'firebase/auth';
import { from, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user$: Observable<User | null>;

  authUser: any;

  constructor(private firebaseAuth: Auth) {
    this.setSessionStoragePersistence();
    this.user$ = user(this.firebaseAuth);
    if (localStorage.getItem('user')) {
      this.authUser = JSON.parse(sessionStorage.getItem('user') || '{}');
    }
  }

  private setSessionStoragePersistence(): void {
    setPersistence(this.firebaseAuth, browserSessionPersistence);
  }

  login(email: string, password: string): Observable<void> {
    const promise = signInWithEmailAndPassword(this.firebaseAuth, email, password).then((data) => {
      this.authUser = data.user;
      localStorage.setItem('user', JSON.stringify(this.authUser));
    });
    
    return from(promise);
  }

  register(email: string, password: string): Observable<void> {
    const promise = createUserWithEmailAndPassword(this.firebaseAuth, email, password).then(() => {});
    return from(promise);
  }

  logout(): Observable<void> {
    const promise = signOut(this.firebaseAuth).then(() => {
      sessionStorage.clear();
      localStorage.removeItem('user');
    });
    return from(promise);
  }
}
