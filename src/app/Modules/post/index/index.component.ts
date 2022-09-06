import { Component, OnInit } from '@angular/core';
import { Post } from '../post';
import { PostService } from '../post.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {

  constructor(public postService: PostService) { }
  public ShowHide:boolean;
  posts: Post[] = [];

  message:any="";

  ngOnInit(): void {
    this.ShowHide=false;
    this.postService.getAll().subscribe((data: any)=>{
      this.ShowHide=true;
     this.posts = data.data
     
     this.message=this.postService.message;
    })
  }  

  deletePost(id:number){
    this.ShowHide=false;
    if(confirm("Are you sure to Detete! ")) {
    this.postService.delete(id).subscribe((res:any) => {
         this.posts = this.posts.filter(item => item.id !== id);
         this.ShowHide=true;
         this.postService.message=res.message;
         this.message=this.postService.message;
    })
  }
  }

}
