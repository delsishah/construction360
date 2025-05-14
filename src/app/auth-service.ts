import { Injectable } from '@angular/core';
import {
  Auth,
  browserLocalPersistence,
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
    this.setLocalStoragePersistence();
    this.user$ = user(this.firebaseAuth);
    if (localStorage.getItem('user')) {
      this.authUser = JSON.parse(localStorage.getItem('user') || '{}');
    }
  }

  private setLocalStoragePersistence(): void {
    setPersistence(this.firebaseAuth, browserLocalPersistence);
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
      localStorage.removeItem('user');
      this.authUser = null;
    });
    return from(promise);
  }
}
