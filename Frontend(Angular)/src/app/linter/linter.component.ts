import { Component, OnInit } from '@angular/core';
import { FrontComponent } from '../front/front.component'
import { MyserviceService } from '../myservice.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-linter',
  templateUrl: './linter.component.html',
  styleUrls: ['./linter.component.css']
})
export class LinterComponent implements OnInit {
  name: any;
  pathdata : any;
  path : any;
  imgUrl:string = "http://127.0.0.1:5000/imgpath"
  cov: any;
  constructor(private service:MyserviceService,private router: Router,private http: HttpClient) 
  {}
  ngOnInit() 
  {
    this.service.getpath().subscribe((data) => {
      this.pathdata = data;
      })
    console.log(this.pathdata)
    this.service.getcov().subscribe((data) => {
      this.cov=data
    })
    
    console.log(this.cov)
    }
  lint(event : any){
    this.path = event.target.value;
    console.log(this.path)
    this.service.postpath(this.path).subscribe((data) =>{
       this.name = data
     })
    
    //this.http.post(this.imgUrl,this.path).subscribe((response) =>
    //{
    //  this.name=response
    //  console.log(response)
    //})
    //this.router.navigate(['/select']) 
  }

  pylint()
  {
    // (document.getElementById('pylintrep') as HTMLImageElement).src="C:\Users\k.a.ramasubramanian\Desktop\Training\grid\backend\Student_project\src\pylint report\\"+this.path+".png"
    const var1=document.getElementById('pylintrep') as HTMLImageElement
    var url=this.imgUrl
    var1.src=url
  }

}
