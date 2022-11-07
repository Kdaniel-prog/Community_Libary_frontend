import { Component, OnInit } from '@angular/core';
import { AppComponent } from '../app.component';
import { TokenStorageService } from '../_services/token-storage.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private tokenStorageService: TokenStorageService) { }

  ngOnInit(): void {
  }
  logout(): void {
    this.tokenStorageService.signOut();
    window.location.reload();
  }
}
