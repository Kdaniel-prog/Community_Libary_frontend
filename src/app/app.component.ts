import { Component } from '@angular/core';
import { TokenStorageService } from './_services/token-storage.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
  title = 'Community_Libary_frontend';
  isNavbarCollapsed = true;
  isLoggedIn = false;
  constructor(private tokenStorageService: TokenStorageService) {
  }

  ngOnInit(): void {
    if(window.location.pathname =='/login' || window.location.pathname == '/register'){
      this.tokenStorageService.signOut()
    }
    this.isLoggedIn = !!this.tokenStorageService.getToken();
  }

  logout(): void {
    this.tokenStorageService.signOut();
    window.location.reload();
  }

}
