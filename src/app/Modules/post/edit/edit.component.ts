import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Post } from '../post';
import { PostService } from '../post.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {

  id!: number;
  post!: Post;
  form!: FormGroup;
  public isPublish:boolean
    
  constructor(
    public postService: PostService,
    private route: ActivatedRoute,
    private router: Router
  ) { }
  public ShowHide:boolean;

  ngOnInit(): void {
    this.ShowHide=false;
    this.id = this.route.snapshot.params['postId'];
    this.postService.find(this.id).subscribe((data: any)=>{
      this.post = data;
      // console.log("post", this.post.published)
      this.isPublish  = this.post.published;
      console.log(this.isPublish)
      this.ShowHide=true;
    });

    console.log("cond2")
    this.form = new FormGroup({
      title: new FormControl('', [Validators.required]),
      project: new FormControl('', Validators.required),
      organisation: new FormControl('', Validators.required),
      email: new FormControl('', Validators.required),
      body: new FormControl('', Validators.required),
      published: new FormControl(),
    });

  }

  get f(){
    return this.form.controls;
  }

  
  submit(){
    this.ShowHide=false;
    console.log(this.form.value);
    if(confirm("Are you sure to Update!")) {
      this.postService.update(this.id, this.form.value).subscribe((res:any) => {
        //console.log(res);
        //alert(res.data);
        this.ShowHide=true;
        this.router.navigateByUrl('post/index');
        this.postService.message=res.data;
        this.postService.showMsg=true;
   })
    }
    
    
  }

}