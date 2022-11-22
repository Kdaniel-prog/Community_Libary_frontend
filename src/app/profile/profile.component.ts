import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import {ModalDismissReasons, NgbModal, NgbModalOptions} from "@ng-bootstrap/ng-bootstrap";
import { User } from '../classes/User';
import { AuthService } from '../_services/auth.service';
import { TokenStorageService } from '../_services/token-storage.service';
import { faPlusCircle, faThumbsDown} from '@fortawesome/free-solid-svg-icons';
export {User};


export class UserData {
  constructor(
    public id: number,
    public username: string,
    public email: string,
    public fullname: string,
    public like: number,
    public dislike: number
  ){
  }
}
export class Book {
  constructor(
  public id: number,
  public title: String,
  public author: String,
  public ownerID: number,
  public borrowerUsername: string
  ){
  }
}
export class Reviews {
  constructor(
  public review: String | null,
  public username: String | null,
  ){
  }
}

export class BorrowedBook {
  constructor(
  public bookID: number,
  public title: String,
  public author: String,
  public ownerUsername: String,
  public borrowedTime: Date,
  public bookReview: String | null,
  public bookReviewID: number | null,
  public borrowedReviewID: number | null
  ){
  }
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})


export class ProfileComponent implements OnInit {
  mybookPage: number = 1;
  mybookCount: number = 0;
  mybookTableSize: number = 5;

  borrowBooksPage: number = 1;
  borrowBooksCount: number = 0;
  borrowBooksTableSize: number = 5;

  page: number = 1;
  count: number = 0;
  tableSize: number = 3;
  bookid: number = 0;
  tableSizes: any = [5, 10, 15, 20];

  books: Book[] = [];
  reviews: Reviews[] = [];
  userData = {} as UserData;
  borrowedBooks: BorrowedBook[] = [];
  editForm = new FormGroup({
    id: new FormControl(),
    Title: new FormControl(),
    Author: new FormControl(),
  });
  editReview = new FormGroup({
    bookID: new FormControl(),
    reviewerID: new FormControl(),
    bookReview: new FormControl(),
  });
  form: any ={
    Title: '',
    Author: '',
  };
  reviewForm: any = {
    bookReview: '',
    bookID: ''
  };
  faplus = faPlusCircle
  myBooks = false;
  private deleteID: number | undefined;
  errorMessage = '';
  modalOptions: NgbModalOptions | undefined;
  isSuccessful: boolean | undefined;
  user_data!: User ;
  OwnerID : any
  closeResult!: string;
  constructor(
    private tokenStorageService: TokenStorageService,
    private httpClient: HttpClient,
    private modalService: NgbModal,
    private authService: AuthService,
    private fb: FormBuilder) {
  }

  ngOnInit(): void {
    this.user_data = this.tokenStorageService.getUser();
    this.OwnerID = this.user_data?.id;
    this.getBooks();
    this.getBorrowedBooks();
    this.userInfo();
    this.editForm = this.fb.group({
      id: [''],
      Author: [''],
      Title: ['']
    } );
    this.editReview = this.fb.group({
      bookID: [''],
      reviewerID: [''],
      bookReview: [''],
    } );
  }

  getBooks() {
    this.httpClient.get<Book[]>('https://localhost:7165/api/book/mybooks?id='+this.OwnerID+'&page='+this.mybookPage+'&size='+this.mybookTableSize).subscribe(
      response => {
        this.books = response
        console.log(this.books)
      });
      this.httpClient.get<number>('https://localhost:7165/api/book/mybooksSize?id='+this.OwnerID).subscribe(
        response => {
          this.mybookCount = response
        });
  }

  getBorrowedBooks() {
    this.httpClient.get<BorrowedBook[]>('https://localhost:7165/api/borrowed/Books?borrowerID='+this.OwnerID+'&page='+this.borrowBooksPage+'&size='+this.borrowBooksTableSize).subscribe(
      response => {
        this.borrowedBooks = response
      });
      this.httpClient.get<number>('https://localhost:7165/api/borrowed/BooksSize?borrowerID='+this.OwnerID).subscribe(
        response => {
          this.borrowBooksCount = response
        });
  }
  userInfo(){
    this.httpClient.get<any>('https://localhost:7165/api/userReviews/oneUser?id='+this.OwnerID).subscribe(
      response => {
        console.log(response)
        this.userData = response
      });
  }

  onSubmit(): void {
    const {Title, Author} = this.form;
    this.authService.add_book(Title, Author, this.OwnerID).subscribe({
      next: data => {
        this.isSuccessful = true;
        this.getBooks();
      },
    });
    this.form ={
      Title: '',
      Author: '',
    };
    this.modalService.dismissAll(); //dismiss the modal
  }

  public open(content: any) {
    this.modalService.open(content, this.modalOptions).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  openDelete(targetModal: any, book: Book) {
    this.deleteID = book.id;
    this.modalService.open(targetModal, {
      backdrop: 'static',
      size: 'lg'
    });
  }

  openEdit(targetModal: any, book: Book){
    this.modalService.open(targetModal, {
      backdrop: 'static',
      size: 'lg'
    });
    this.editForm.patchValue( {
      id: book.id,
      Author: book.author,
      Title: book.title
    });
  }

  onDelete() {
    const deleteURL = 'https://localhost:7165/api/book/delete?id=' + this.deleteID;
    this.httpClient.delete(deleteURL)
      .subscribe((results) => {
        this.getBooks();
        this.modalService.dismissAll();
      });
  }

  onEdit(){
    const editURL = 'https://localhost:7165/api/book/editBook';
    this.httpClient.put(editURL, this.editForm.value)
      .subscribe((results) => {
        this.getBooks();
        this.modalService.dismissAll();
      });
  }

  timeConverter(d: Date) {
    var EditD = d.toString().replace('T', ' ');
    EditD = EditD.replace('.', '');
    return EditD.toString().slice(0,-7);
  }

  openBookReview(targetModal: any, book: BorrowedBook){
    this.reviewForm.bookID = book.bookID;
    this.modalService.open(targetModal, {
      backdrop: 'static',
      size: 'lg'
    });
  }
  sendBookReview(): void {
    const {bookReview, bookID} = this.reviewForm;
    this.authService.sendBookReview(bookID,this.OwnerID, bookReview).subscribe({
      next: data => {
        this.getBorrowedBooks();
      },
    });
    this.reviewForm ={
      bookReview: '',
      bookID: 0
    };
    this.modalService.dismissAll(); //dismiss the modal
  }
  openEditBookReview(targetModal: any, book: BorrowedBook){
    this.modalService.open(targetModal, {
      backdrop: 'static',
      size: 'lg'
    });
    this.editReview.patchValue({
      bookID: book.bookID,
      reviewerID: this.OwnerID,
      bookReview: book.bookReview,
    });
  }
  onEditBookReview(){
    console.log(this.editReview.value)
    this.authService.edit_review(this.editReview.value).subscribe({
      next: () => {
          this.getBorrowedBooks();
          this.modalService.dismissAll();
        },
      });
    }
    DeleteBookReview(deleteBookReviewID: number | null) {
      const deleteURL = 'https://localhost:7165/api/bookreview/delete?id=' + deleteBookReviewID;
      this.httpClient.delete(deleteURL)
        .subscribe((results) => {
          this.getBorrowedBooks();
          this.modalService.dismissAll();
        });
    }
    returnBorrowedBook(borrowedReviewID: number | null) {
      const deleteURL = 'https://localhost:7165/api/borrowed/delete?id=' + borrowedReviewID;
      this.httpClient.delete(deleteURL)
        .subscribe((results) => {
          this.getBorrowedBooks();
          this.modalService.dismissAll();
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
    myBooksonTableDataChange(event2: any){
      this.mybookPage = event2;
      this.getBooks()
    }
    onBorrowBooksTableDataChange(event3: any){
      this.borrowBooksPage = event3;
      this.getBorrowedBooks()
    }
}


