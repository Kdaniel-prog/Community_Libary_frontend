import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import {ModalDismissReasons, NgbModal, NgbModalOptions} from "@ng-bootstrap/ng-bootstrap";
import { User } from '../classes/User';
import { AuthService } from '../_services/auth.service';
import { TokenStorageService } from '../_services/token-storage.service';

export {User};

export class Book {
  constructor(
  public id: number | undefined,
  public title: String,
  public author: String,
  public ownerID: number
  ){
  }
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})


export class ProfileComponent implements OnInit {
  books: Book[] = [];
  editForm = new FormGroup({
    id: new FormControl(),
    Title: new FormControl(),
    Author: new FormControl(),
  });
  form: any ={
    Title: '',
    Author: '',
  }

  myBooks = false;
  private deleteID: number | undefined;
  private closeResult: string = "";
  errorMessage = '';
  modalOptions: NgbModalOptions | undefined;
  isSuccessful: boolean | undefined;
  user_data: User | undefined;
  OwnerID : any
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
    this.editForm = this.fb.group({
      id: [''],
      Author: [''],
      Title: ['']
    } );
  }

  getBooks() {
    this.httpClient.get<Book[]>('https://localhost:7165/api/book/mybooks?id='+this.OwnerID).subscribe(
      response => {
        response.map(
          res =>
          console.log(res.author),


        );
        this.books = response
        console.log(this.books );
      });
  }

  onSubmit(): void {
    const {Title, Author} = this.form;
    console.log(this.form);
    this.authService.add_book(Title, Author, this.OwnerID).subscribe({
      next: () => {
        this.isSuccessful = true;
        window.location.reload();
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
    const deleteURL = 'https://localhost:7165/api/books/' + this.deleteID + '/delete';
    this.httpClient.delete(deleteURL)
      .subscribe((results) => {
        this.ngOnInit();
        this.modalService.dismissAll();
      });
  }

  onEdit(){
    const editURL = 'https://localhost:7165/api/books/' + this.editForm.value.id + '/edit';
    console.log(this.editForm.value);
    this.httpClient.put(editURL, this.editForm.value)
      .subscribe((results) => {
        this.ngOnInit();
        this.modalService.dismissAll();
      });
  }


}


