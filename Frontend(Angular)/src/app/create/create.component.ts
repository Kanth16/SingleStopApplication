import { Component, OnInit } from '@angular/core';
import { MyserviceService } from '../myservice.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit {
file:any;
myurl:string= "http://127.0.0.1:5000/creation";
  constructor( private service:MyserviceService,private http: HttpClient,private router: Router) { }
  handle(evt){
    var files = evt.target.files
    this.file=files[0].name
  }
  sqlupload(){
    console.log(this.file)
    if (!this.validateFile(this.file)) {
      alert("Selected file format is not supported")
  }  
    else{
      this.http.post(this.myurl,this.file).subscribe((response)=>{
        alert("SQL file has been uploaded successfully!");
        window.location.reload()
        console.log(response)
      },
       (err)=>{
        alert("error")
         console.log(err)
    
       }
      )
    }  
  }
  validateFile(name: String) {
    var ext = name.substring(name.lastIndexOf('.') + 1);
    if (ext.toLowerCase() == 'sql') {
        return true
    }
    else {
        return false
    }
  }
  route(){
    this.router.navigate(['/files'])
  }
  ngOnInit(): void {
  }

}
