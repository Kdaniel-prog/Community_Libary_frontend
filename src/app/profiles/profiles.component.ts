import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { User } from '../classes/User';
import { AuthService } from '../_services/auth.service';
import { TokenStorageService } from '../_services/token-storage.service';
import { faThumbsUp } from '@fortawesome/free-solid-svg-icons';
import { faThumbsDown } from '@fortawesome/free-solid-svg-icons';
export { User };

export class UserReview {
  constructor(
  public userId: number,
  public username: String,
  public fullName: String,
  public like: number,
  public dislike: number,
  ){
  }
}

@Component({
  selector: 'app-profiles',
  templateUrl: './profiles.component.html',
  styleUrls: ['./profiles.component.scss']
})

export class ProfilesComponent implements OnInit {
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': `Bearer ${this.tokenStorageService.getToken()}`,})
  };
  page: number = 1;
  count: number = 0;
  tableSize: number = 5;
  tableSizes: any = [5, 10, 15, 20];

  userReviews: UserReview[] = [];
  user_data!: User;
  faThumbsUp = faThumbsUp;
  faThumbsDown = faThumbsDown
  closeResult: string | undefined;
  modalOptions: NgbModalOptions | undefined;
  constructor(
    private tokenStorageService: TokenStorageService,
    private httpClient: HttpClient,
    private modalService: NgbModal,
    private authService: AuthService,
  ) { }
  ngOnInit(): void {
    this.user_data = this.tokenStorageService.getUser();
    this.getAllUsers();
  }

  getAllUsers(){
    this.httpClient.get<UserReview[]>('https://localhost:7165/api/userReviews/allUsers?id='+this.user_data.id+'&page='+this.page+'&size='+this.tableSize,this.httpOptions).subscribe(
      response => {
        this.userReviews = response
        console.log(this.userReviews );
      });
      this.httpClient.get<number>('https://localhost:7165/api/userReviews/allUsersSize?id='+this.user_data.id,this.httpOptions).subscribe(
        response => {
          this.count = response
        });
  }
  sendReview(ReviewedID: number, isLiked: boolean){
    let ReviewerID = this.user_data.id;
    console.log(isLiked);
    this.httpClient.post('https://localhost:7165/api/userReviews/addReview', {
      ReviewedID,
      ReviewerID,
      isLiked
    },this.httpOptions).subscribe(
      response =>{
        this.getAllUsers();
      }
    )
  }
  onTableDataChange(event: any){
    this.page = event;
    this.getAllUsers()
  }
}
