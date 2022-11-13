import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Observable, window} from 'rxjs';
import { TokenStorageService } from './token-storage.service';

const AUTH_API = 'https://localhost:7165/api/auth/';
const API = 'https://localhost:7165/api';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json'})
};
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient, private readonly tokenService: TokenStorageService) { }

  get isLoggedIn(){
    return !!this.tokenService.getToken();
  }

  add_book(Title: string, Author: string, OwnerID: number): Observable<any> {
    return this.http.post(API + '/book/addBook', {
      Title,
      Author,
      OwnerID
    }, httpOptions);
  }

  login(username: string, password: string): Observable<any> {
    return this.http.post(AUTH_API + 'signin', {
      username,
      password
    }, httpOptions);
  }

  register(username: string, Email: string, password: string, Fullname: String): Observable<any> {
    return this.http.post(AUTH_API + 'signup', {
      username,
      password,
      Email,
      Fullname
    }, httpOptions);
  }
}
