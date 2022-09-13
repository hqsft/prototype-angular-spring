import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import {  Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Post } from './post';
import { DataService } from './../../Services/data.service'
@Injectable({
  providedIn: 'root'
})
export class PostService {

  constructor(private httpClient: HttpClient,private ds: DataService) { }

  showMsg: boolean = false;
  message:any="";

  //private apiURL = "https://jsonplaceholder.typicode.com";
  private apiURL = "http://localhost:9006/csaic/api";
  private springURL = "https://csacangular.hsoftcloud.com/angularAPI/api";

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' +  localStorage.getItem('token'),
      //"Content-Type": "multipart/form-data"
    })
  }
  httpOptions2 = {
    headers: new HttpHeaders({
      
      'Authorization': 'Bearer ' +  localStorage.getItem('token'),
      "Content-Type": "multipart/form-data",
    
    })
  }

  errorHandler(error:any) {
    let errorMessage = '';
    if(error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(errorMessage);
 }


 // @return response()
   
   getAll(): Observable<any> {  
    return this.httpClient.get(this.springURL + '/post',this.httpOptions)  
    .pipe(
      catchError(this.errorHandler)
    )
  }
//Create Post
  create(post:Post): Observable<any> {  
    return this.httpClient.post<any>(this.springURL + '/post', post, this.httpOptions)  
    .pipe(
      catchError(this.errorHandler)
    )
  }  
//Find Post
  find(id:number): Observable<any> {  
    return this.httpClient.get(this.springURL + '/post/' + id,this.httpOptions)  
    .pipe(
      catchError(this.errorHandler)
    )
  }
  //Update Post
  update(id:number, post:Post): Observable<any> {  
    return this.httpClient.put(this.springURL + '/post/' + id, JSON.stringify(post), this.httpOptions) 
    .pipe( 
      catchError(this.errorHandler)
    )
  }
//Delete Post
  delete(id:number){
    return this.httpClient.delete(this.springURL + '/post/' + id, this.httpOptions)  
    .pipe(
      catchError(this.errorHandler)
    )
  }


  







}
function token(token: any) {
  throw new Error('Function not implemented.');
}

