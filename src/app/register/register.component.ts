import { AuthService } from '../_services/auth.service';
import {Component} from "@angular/core";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})

export class RegisterComponent{
  form: any = {
    username: null,
    email: null,
    password: null,
    name: null
  };

  isSuccessful = false;
  isSignUpFailed = false;
  errorMessage = '';

  constructor(private authService: AuthService) { }
  onSubmit(): void {
    const { username, email, password, name } = this.form;
    this.authService.register(username, email, password, name).subscribe({
      next: () => {
        this.isSuccessful = true;
        this.isSignUpFailed = false;
      },
      error: err => {
        this.errorMessage = err.error.message;
        this.isSignUpFailed = true;

      }
    });
  }
}
