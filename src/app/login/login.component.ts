import { Component, OnInit } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { TokenStorageService } from '../_services/token-storage.service';
import { AuthService } from '../_services/auth.service';
import { AppRoutingModule } from '../app-routing.module';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent{
  form: any = {
    username: null,
    password: null
  };
  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';
  userNotExist = false;

  constructor(private authService: AuthService, private tokenStorage: TokenStorageService) { }

  onSubmit(): void {
    const { username, password } = this.form;
    this.authService.login(username, password).subscribe({
      next: (data: { accessToken: any; } | null) => {
        if(data === null){
          this.userNotExist = true;
        }
        this.tokenStorage.saveToken(data?.accessToken);
        this.userNotExist = true;
        this.tokenStorage.saveUser(data);
        this.isLoginFailed = false;
        this.isLoggedIn = true;
        window.location.assign("home");
      },
      error: () => {
        this.isLoginFailed = true;
      }
    });
  }
}
