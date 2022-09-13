import { Component, OnInit } from '@angular/core';
import { Post } from '../post';
import { PostService } from '../post.service';
import Swal from 'sweetalert2/dist/sweetalert2.js'
@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']

})
export class IndexComponent implements OnInit {

  constructor(public postService: PostService) { }
  public ShowHide:boolean;
  posts: Post[] = [];

  title = 'datatables';
  dtOptions: DataTables.Settings = {};

  message:any="";

  ngOnInit(): void {
    this.ShowHide=false;
    // this.dtOptions = {
    //   pagingType: 'full_numbers',
    //   pageLength: 5,
    //   processing: true
    // };
    this.postService.getAll().subscribe((data: any)=>{
      this.ShowHide=true;
     this.posts = data.data
     
     setTimeout(()=>{   
      $('#datatableexample').DataTable( {
        pagingType: 'full_numbers',
        pageLength: 10,
        processing: true,
        lengthMenu : [10, 25, 50]
    } );
    }, 1);
     
    // this.message=this.postService.message;
    })
   
    // location.reload();
  }  

  deletePost(id:number){
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.ShowHide=false;
           this.postService.delete(id).subscribe((res:any) => {
         this.posts = this.posts.filter(item => item.id !== id);
         this.ShowHide=true;
        //  this.postService.message=res.message;
        //  this.message=this.postService.message;
        Swal.fire(
          'Deleted!',
          this.message,
          'success'
        )
    })
    
      }
    })

  }}