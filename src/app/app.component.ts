import { Component } from '@angular/core';
import { TokenStorageService } from './_services/token-storage.service';
import { faHouseUser, faDoorOpen, faUser} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Community_Libary_frontend';
  fahouse = faHouseUser;
  isNavbarCollapsed = true;
  fauser = faUser;
  fadooropen = faDoorOpen;
  isLoggedIn = false;
  constructor(private tokenStorageService: TokenStorageService) {

  }

  ngOnInit(): void {
    this.isLoggedIn = !!this.tokenStorageService.getToken();
  }

  logout(): void {
    this.tokenStorageService.signOut();
    window.location.reload();
  }

}
