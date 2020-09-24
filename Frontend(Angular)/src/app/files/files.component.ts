import { Component, OnInit } from '@angular/core';
import { MyserviceService } from '../myservice.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
@Component({
  selector: 'app-files',
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.css']
})
export class FilesComponent implements OnInit {
file:string;
path:File=null;
post:any;
value:boolean=false;
url:string= "http://127.0.0.1:5000/insertion";
  tablename: any;
  constructor( private service:MyserviceService,private http: HttpClient,private router: Router) { }
  handleFileSelect(evt) {
    var files = evt.target.files; // FileList object
    console.log(files)
    console.log(files[0].name);
    this.file=files[0].name
    this.tablename = this.file.split(".")
    console.log(this.tablename)
    console.log(evt.target.value)
    this.path=<File>evt.target.result;
    console.log(this.path)
  }
  validateFile(name: String) {
    var ext = name.substring(name.lastIndexOf('.') + 1);
    if (ext.toLowerCase() == 'csv') {
        return true
    }
    else {
        return false
    }
  }
  up(){
    console.log(this.file)
    if (!this.validateFile(this.file)) {
      alert("Selected file format is not supported")
  }    
   else{
    this.http.post(this.url,this.file).subscribe((response)=>{
      console.log(response)
      if(response == true){
        alert("CSV file has been uploaded successfully into the table: " + this.tablename[0] )
        window.location.reload()
      }
      else{
        alert( "Table " + this.tablename[0] + " doesn't exist...Click  on \"CREATE\" to create a new table")
        this.value=true
      }
    },
     (err)=>{
      alert("error")
       console.log(err)  
     }
    )
   }
  }
  createcomp(){
       this.router.navigate(["/create"])
  }

  ngOnInit(): void {
  }

}
