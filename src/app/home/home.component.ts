import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { User } from '../classes/User';
import { AuthService } from '../_services/auth.service';
import { TokenStorageService } from '../_services/token-storage.service';
import { faThumbsUp } from '@fortawesome/free-solid-svg-icons';
import { faThumbsDown } from '@fortawesome/free-solid-svg-icons';
export { User };

export class Book {
  constructor(
  public id: number,
  public title: String,
  public author: String,
  public ownerID: number,
  public ownerUsername: string,
  public borrowed: boolean,
  public borrowerUsername: string
  ){
  }
}

export class Reviews {
  constructor(
  public review: String,
  public username: String,
  ){
  }
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  isReadReview = false;

  bookPage: number = 1;
  bookCount: number = 0;
  bookTableSize: number = 5;

  page: number = 1;
  count: number = 0;
  bookid: number = 0;
  tableSize: number = 3;
  tableSizes: any = [5, 10, 15, 20];
  books: Book[] = [];
  reviews: Reviews[] = [];
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
    console.log(this.user_data.id);
    this.getBooks();
  }

  getBooks(){
    this.httpClient.get<Book[]>('https://localhost:7165/api/book/allbook?userid='+ this.user_data.id+'&page='+this.bookPage+'&size='+this.bookTableSize).subscribe(
      response => {
        this.books = response
      });
      this.httpClient.get<number>('https://localhost:7165/api/book/getBookSize?userid='+this.user_data.id).subscribe(
        response => {
          this.bookCount = response
        });
  }

  public open(content: any) {
    this.modalService.open(content, this.modalOptions);
  }

  borrow(bookID: number){
    this.authService.add_borrowed(bookID, this.user_data.id).subscribe({
      next: () => {
        this.getBooks()
      },
    });
  }

  getBookReviews(bookid: number) {
    this.bookid = bookid;
    this.httpClient.get<Reviews[]>('https://localhost:7165/api/bookreview/allreview?bookid='+bookid+'&page='+this.page+'&size='+this.tableSize).subscribe(
      response => {
        console.log(response)
        this.reviews = response
      });
      this.httpClient.get<number>('https://localhost:7165/api/bookreview/getSize?bookid='+bookid).subscribe(
        response => {
          this.count = response
        });
  }
  onTableDataChange(event: any){
    this.page = event;
    this.getBookReviews(this.bookid)
  }
  onBookTableDataChange(event: any){
    this.bookPage = event;
    this.getBooks()
  }
}
