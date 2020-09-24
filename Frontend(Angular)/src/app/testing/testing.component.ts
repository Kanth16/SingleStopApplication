import { Component, OnInit } from '@angular/core';
import { FrontComponent } from '../front/front.component';
import { MyserviceService } from '../myservice.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-testing',
  templateUrl: './testing.component.html',
  styleUrls: ['./testing.component.css']
})
export class TestingComponent implements OnInit {
  tablename: string;
  result;
  path;
  getResult;
  

  constructor(private service:MyserviceService,
    private table: FrontComponent,
    private router: Router,
    private http:HttpClient ) {
      this.router.routeReuseStrategy.shouldReuseRoute=()=>false;
    }

  //   test()
  //    {
  //     this.tablename = this.table.tablename
  //     console.log(this.tablename)
  //     this.service.posttable(this.tablename).subscribe((data)=>{
  //     this.path=data
  //    console.log(this.path)
  //  });
  //   }

    ngOnInit(): void 
    {
      this.tablename = this.table.tablename
      console.log(this.tablename)
      this.service.posttable(this.tablename).subscribe((data)=>{
      this.path=data
     console.log(this.path)
   });
}
}
