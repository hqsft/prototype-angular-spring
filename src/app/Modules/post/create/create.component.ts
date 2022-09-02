import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PostService } from '../post.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit {

  constructor(public postService: PostService, private router: Router) { }
  public ShowHide: boolean;
  form!: FormGroup;
  public value: any;
  ngOnInit(): void {
    this.ShowHide = true;
    this.form = new FormGroup({
      title: new FormControl('', [Validators.required]),
      body: new FormControl('', Validators.required)
    });

  }

  get f() {
    return this.form.controls;
  }

  submit() {
    this.ShowHide = false;

    this.value = {
      'id': "",
      'title': this.form.value.title,
      'body': this.form.value.title,
      'published': false
    }
    this.postService.create(this.value).subscribe((res: any) => {
      ;


      this.router.navigateByUrl('post/index');
      this.postService.message = res.data;
      this.ShowHide = true;
    })
  }



}
