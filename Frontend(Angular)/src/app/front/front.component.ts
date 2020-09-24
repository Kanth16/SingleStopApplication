import { Component, OnInit } from '@angular/core';
import { MyserviceService } from '../myservice.service';
import { Router } from '@angular/router';
import {MatCardModule} from '@angular/material/card';

@Component({
  selector: 'app-front',
  templateUrl: './front.component.html',
  styleUrls: ['./front.component.css']
})
export class FrontComponent implements OnInit {

  tableData: any;
  tablename: string;
  dataa: any;
  value: boolean = true;
  dropDown:any;
  opened:boolean = false;
  
   constructor ( private service:MyserviceService,
                  private router: Router) {
      this.displayTable()
     }
  
    displayTable(){      
      this.service.getTable().subscribe((data) => {
      this.tableData = data;
      })
    } 
         submit(tablename){
         this.tablename = tablename
         console.log(tablename)
         //this.router.navigate(['/select']) 
       }
       reset(){
        this.dropDown = document.getElementById("tname");
        this.dropDown.selectedIndex = 0;
        // this.router.navigate(['/'])      
       }
         
       lint()
       {
         this.value=false
         this.router.navigateByUrl("linter")
       }
       adv()
       {
        this.value=false
        this.router.navigateByUrl("search")
       }

    ngOnInit(): void {  }
  }
  
