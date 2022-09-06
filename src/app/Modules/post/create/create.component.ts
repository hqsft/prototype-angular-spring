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
  file: File = null;
  fileName: any;
  downloadFile: any;
  status:any
  id: any
  constructor(public postService: PostService, private router: Router) { }
  public ShowHide: boolean;
  form!: FormGroup;
  public value: any;
  ngOnInit(): void {
    this.ShowHide = true;

    this.form = new FormGroup({
      title: new FormControl('', [Validators.required]),
      body: new FormControl('', Validators.required),
      // status: new FormControl('', Validators.required),
      project: new FormControl('', Validators.required),
      organisation: new FormControl('', Validators.required),
      //email: new FormControl('', Validators.required),

      
  email: new FormControl('',[
  Validators.required,
   Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")])
    });

    this.getFile()

  }

  get f() {
    return this.form.controls;
  }

  uploadFile(event) {
    this.file = event.target.files[0];
    console.log("file name", this.file.name)

  }

  // onFIleUpload(){
  //   console.log("file name", this.file.name)
  //   // const ResponceID = 46
  //   const formdata = new FormData();
  //   formdata.append(
  //     "file",
  //     this.file,      
  //   )
  //   this.postService.createAttachment(this.id,this.file)
  //   .subscribe(response => {
      
  //     })     
  // }
getFile(){
  // this.ShowHide=false;
    // this.postService.getAttachment(this.id).subscribe((data: any)=>{
    //   this.ShowHide=true;
    
    // })
}

// deleteFile(){
  
//   this.ShowHide=false;
//   if(confirm("Are you sure to Detete! ")) {
//   this.postService.deleteAttachemet(this.id).subscribe((res:any) => {
//       //  this.posts = this.posts.filter(item => item.id !== id);
//       //  this.ShowHide=true;
//       //  this.postService.message=res.message;
//       //  this.message=this.postService.message;
//   })
// }
// }

downloadFileCtrl(FileImage) {
  console.log("download file", FileImage)
  // this.downloadFile = "http://localhost:9006/nofaapi/nofa/attachements/downloadAttachementFile?file=" + FileImage;

}

fieldsChange(values:any):void {
  
this.status = values.currentTarget.checked
// console.log("get VALUE",this.status);

}

  submit() {
    this.ShowHide = false;

    this.value = {     
      'title': this.form.value.title,
      'project': this.form.value.project,
      'organisation': this.form.value.organisation,
      'email': this.form.value.email,
      'body': this.form.value.body,
      'published': this.status,      
    }
    this.postService.create(this.value).subscribe((res: any) => {
;
      this.router.navigateByUrl('post/index');
      this.postService.message = res.data;
      this.ShowHide = true;
    })
  }



}