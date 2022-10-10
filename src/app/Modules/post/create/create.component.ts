import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PostService } from '../post.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import Swal from 'sweetalert2/dist/sweetalert2.js'
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
   
    if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      this.file = file
      console.log("files", this.file.name)
  }
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
downloadFileCtrl(FileImage) {
  console.log("download file", FileImage)
  // this.downloadFile = "http://localhost:9006/nofaapi/nofa/attachements/downloadAttachementFile?file=" + FileImage;

}

fieldsChange(values:any):void {
  
this.status = values.currentTarget.checked
// console.log("get VALUE",this.status);

}

  submit() {
    
    Swal.fire({
      title: 'Do you want to save the changes?',
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: 'Save',
      denyButtonText: `Don't save`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.ShowHide = false;
         const uploadData: any = new FormData(); // Create Form Data object to upload the file in POST FORM
    console.log("dfs",  this.form.value.title)
    uploadData.append('title', this.form.get('title').value);
    uploadData.append('project', this.form.get('project').value);
    uploadData.append('organisation', this.form.get('organisation').value);
    uploadData.append('email', this.form.get('email').value);
    uploadData.append('body', this.form.get('body').value);     
    uploadData.append('published', true);
    uploadData.append('files', this.file);

    this.postService.create(uploadData).subscribe((res:any) => {      
      this.router.navigateByUrl('post/index');
          Swal.fire('Saved!', '', 'success')
          this.ShowHide = true;
    })

        // this.postService.create(this.value).subscribe((res: any) => {
    
        //   this.router.navigateByUrl('post/index');
        //   Swal.fire('Saved!', '', 'success')
        //   this.ShowHide = true;
        // })

      } else if (result.isDenied) {
        Swal.fire('Changes are not saved', '', 'info')
      }
    })
  }



}