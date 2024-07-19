import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {
  private usernameSource = new BehaviorSubject<string>('אורח');
  currentUsername = this.usernameSource.asObservable();
  changeUsername(username: string) {
    this.usernameSource.next(username);
  }
  
}
