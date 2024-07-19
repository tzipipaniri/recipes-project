import { EventEmitter, inject, Injectable } from '@angular/core';
import { User } from '../models/user';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject, tap } from 'rxjs';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})

export class UsersService {
  private http = inject(HttpClient);
  private usersURL = `${environment.apiURL}/users`;

  currentUser?: User;
  private _users: User[] = [];
  private currentUserSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(this.token ? 'משתמש' : null); // התאמה לפי איך שאתה מזהה משתמש
  public currentUser$ = this.currentUserSubject.asObservable();
  private userSubject = new Subject<User | undefined>();

  constructor() {//private http: HttpClient 
    const userString = localStorage.getItem('user');
    if (userString) {
      try {
        const user = JSON.parse(userString);
        this.currentUserSubject.next(user ? user.firstName : 'אורח');
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }

  sigin(username: string, password: String) {
    console.log('username', username);
    console.log('password', password);

    // return this.http.post<Object>('http://localhost:5000/users/signin',{username,password},{ withCredentials: true });
    // return this.http.post<{ token: string }>('http://localhost:5000/users/signin', { username, password }, { withCredentials: true })
    //   .pipe(
    //     tap(response => {
    //       if (response.token) {
    //         localStorage.setItem('token', response.token);
    //         this.currentUserSubject.next(username);
    //       }
    //     })
    //   );
    return this.http.post<{ user: User; token: string }>(
      `${this.usersURL}/signin`,
      { username, password }
    )
    .pipe(
      tap(response => {
        if (response.user && response.token) {
          this.currentUser = response.user;
          localStorage.setItem('user', JSON.stringify(response.user));
          localStorage.setItem('token', response.token);
          this.currentUserSubject.next(username);
        }
      })
    );
  }
  sigup(user: User) {
    return this.http.post<Object>(`${this.usersURL}/signup`, { ...user }, { withCredentials: true })
   
  }
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user'); // Clear user data from local storage
    this.currentUserSubject.next(null);

  }

  getUsers() {
    return this.http.get<User[]>(`${this.usersURL}/users`);
  }

  public get token(): string | null {
    return localStorage.getItem('token');
  }
  public set token(token: string | null) {
    if (token) {
      localStorage.setItem('token', token);
    }
  }
  public get role() {
    console.log('this.currentUser?.role',this.currentUser?.role);
    
    return this.currentUser?.role
  }
  // user.service.ts
  private userChange = new EventEmitter<User | undefined>();

  getUser(): User | undefined {
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      this.userChange.emit(user); // Emit the user data on change
      return user;
    }
    return undefined;
  }


}
