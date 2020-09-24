import { Component, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem, copyArrayItem } from '@angular/cdk/drag-drop';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FrontComponent } from '../front/front.component';
import { MyserviceService } from '../myservice.service';
import { FormControl } from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith, count} from 'rxjs/operators';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';


@Component(
{
  selector: 'app-adv-search',
  templateUrl: './adv-search.component.html',
  styleUrls: ['./adv-search.component.css']
})
export class AdvSearchComponent implements OnInit 
{
  myControl = new FormControl();
  public defaultColDef;
  public editType;
  public gridOptions;
  joinUrl:string="http://127.0.0.1:5000/joins"
  joincolUrl: string="http://127.0.0.1:5000/joincol"
  myUrl: string = "http://localhost:5000"
  colUrl : string = "http://127.0.0.1:5000/collist"
  queryUrl : string = "http://127.0.0.1:5000/query"
  value: boolean =false
  keys: any[] = [];
  values: any[] = [];
  dataa: any;
  tablename: string;
  rowData: any;
  columnDefs: any[] = [];
  column: any;
  k: any;
  postData: any;
  row: any;
  postDel: any;
  rawData: any[] = [];
  rowD: any;
  abcd: any;
  id: any;
  actualData: any[] = [];
  editedData: any[] = [];
  actualDatatype: any[] = [];
  editedDatatype: any[] = [];
  putDddata: any;
  delData: any;
  val: any;
  name: any;
  colname: Object;
  selectedaggcolumn: any;
  value1 : boolean = false;
  selectedtable: any;
  tableData: Object;
  dispvalue:boolean=false;
  todo = ['GROUP BY','HAVING','ORDER BY','JOIN','ANALYTICAL FUNCTIONS'];
  done= [];
  join=['INNER JOIN','LEFT JOIN','RIGHT JOIN']
  joinval:boolean=false
  agg=['AVG','SUM','MIN','MAX','COUNT']
  analtical=['AVG','SUM','MIN','MAX','COUNT','RANK','DENSE_RANK','ROW_NUMBER']
  ordername = ["ASCENDING", "DESCENDING"]
  compname = [ '=', '<>', '>', '<', '<=', '>=']
  aggval: boolean=false;
  selectedagg: any;
  res: any;
  selectedjoin: any;
  jointabval: boolean=false;
  jointable1: string;
  jointable2: string;
  selectedtable1: any;
  selectedtable2: any;
  commoncols: Object;
  commoncolumns:string[]=[]
  groupbycolval:boolean=false;
  groupbyselectedcols:any=[];
  seltab2: any;
  groupbyvalue: boolean=false;
  orderbyvalue: boolean=false;
  countvalue: boolean = false;
  selectedtable1columns: Object;
  selectedtable1columnsarray:any =[]
  selectedtable2columns: Object;
  selectedtable2columnsarray:any=[]
  removecols: any;
  filteredOptions: Observable<any>;
  selectedjoincol: string;
  joincolval: boolean =false;
  searchval: boolean =false;
  having: string = 'no';
  selectedcolumns=[]
  analticalval: boolean=false;
  selectedpartitioncolumn: any;
  selectedorderbycolumn: any;
  analticalfunction: any;
  analticalaggval: boolean = false;
  selectedanalticalaggcolumn: any;
  selectdorder: any;
  comparator: any;
  count_entered: any;
  dropDown: any;
  colname1: any;

  constructor(private service:MyserviceService,
    private table: FrontComponent,
    private router: Router,
    private http: HttpClient){}

  drop2(event: any) {
      if (event.previousContainer === event.container) {
        moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      } else {
        copyArrayItem(
          event.previousContainer.data,
          event.container.data,
          event.previousIndex,
          event.currentIndex
        );
      }
    }   
  drop(event: CdkDragDrop<string[]>) 
  {
    if (event.previousContainer === event.container) 
    {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } 
    else 
    {
      transferArrayItem(event.previousContainer.data,
                          event.container.data,
                          event.previousIndex,
                          event.currentIndex);                    
    }
    console.log(this.done);
    if(this.done != null)
    {
      this.value=true
      this.value1=true
    }
    else
    {
      this.orderbyvalue=false
      this.groupbyvalue=false
      this.aggval=false
      this.value = false
      this.groupbycolval=false
      this.aggval=false
      this.value1=false
      this.groupbycolval=false
      this.dispvalue=false
      this.value = false
      this.jointabval=false
      this.searchval=false
      this.joincolval=false
      this.countvalue = false
    }
    if (this.done.indexOf('GROUP BY') != -1 && this.done.indexOf('HAVING') == -1)
    {
      console.log("having false")
      this.having = "no"
      this.groupbyvalue=true
      this.aggval=true
      this.groupbycolval=false
      this.orderbyvalue=false
      this.searchval=false
      this.jointabval=false
      this.countvalue = false
    }
    else if (this.done.indexOf('GROUP BY') != -1 && this.done.indexOf('HAVING') != -1)
    {
      console.log("having true")
      this.having = "yes" 
      this.groupbyvalue=true
      this.aggval=true
      this.groupbycolval=false
      this.groupbyvalue=true
      this.orderbyvalue=false
      this.searchval=false
      this.jointabval=false 
    }
    else if(this.done[0]=='ORDER BY')
    {
      this.orderbyvalue=true
      this.groupbyvalue=false
      this.groupbycolval=false
      this.jointabval=false
      this.searchval=false
      this.aggval = false
      this.countvalue = false
    }
    else 
    {
      this.orderbyvalue=false
      this.groupbyvalue=false
      this.aggval=false
      this.value = false
      this.groupbycolval=false
      this.aggval=false
      this.value1=false
      this.searchval=false
      this.groupbycolval=false
      this.dispvalue=false
      this.countvalue = false
    }
    if(this.done[0]=='JOIN')
    {
      this.joinval=true
      this.value = false
      this.aggval=false
      this.countvalue = false
    }
    // else
    // {
    //   this.joinval=false
    //   this.searchval=false
    //   this.joincolval=false
    //   this.countvalue = false
    //   this.aggval=false
    // }
    if(this.done[0]=='ANALYTICAL FUNCTIONS')
    {
      this.analticalval=true
      this.value1=true
      this.jointabval=false
      this.countvalue = false
    }
    // else{
    //   this.analticalval=false
    //   this.analticalaggval = false
    //   this.countvalue = false
    //   this.aggval=false
    // }
    if(this.done.indexOf('GROUP BY') != -1 && this.done.indexOf('ORDER BY') != -1 && this.done.indexOf('JOIN') == -1 && this.done.length >1)
    {
      this.groupbyvalue=true
      this.orderbyvalue=true
      this.aggval=true
    }
    if(this.done.indexOf('GROUP BY') != -1 && this.done.indexOf('ORDER BY') != -1 && this.done.indexOf('JOIN') != -1 && this.done.length >1)
    {
      this.value1=true
      this.joinval=true
      this.groupbyvalue=true
      this.orderbyvalue=true
      this.analticalaggval=false
      this.aggval=false
    }
  }  
  selagg(event: any)
  {
    this.selectedagg=event.target.value
    console.log(this.selectedagg)
    if ((this.selectedagg == "COUNT" || this.selectedagg == "SUM" || this.selectedagg == "AVG" || this.selectedagg == "MIN" || this.selectedagg == "MAX") && this.having == "yes")
    {
      this.countvalue = true
    }
    else{
      this.countvalue = false
      this.comparator = "no"
      this.count_entered = 0
    }
  }
  seljoin(event:any)
  {
    this.selectedjoin=event.target.value
    console.log(this.selectedjoin)
    if (this.selectedjoin == 'INNER JOIN')
    {
      console.log(this.selectedjoin)
      this.jointabval=true
      this.jointable1='TABLE1'
      this.jointable2='TABLE2'
    }
    else
    {
      console.log(this.selectedjoin)
      this.jointabval=true
      this.jointable1='LEFT TABLE'
      this.jointable2='RIGHT TABLE'
    }
  }
  drop1(event: CdkDragDrop<string[]>) 
  {
    if (event.previousContainer == event.container) 
    {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } 
    else 
    {
      transferArrayItem(event.previousContainer.data,
                          event.container.data,
                          event.previousIndex,
                          event.currentIndex);                    
    }
    console.log(this.groupbyselectedcols)
  }
  seljointab1(event : any)
  { 
    this.selectedtable1columnsarray=[]
    this.selectedtable1=event.target.value
    console.log(this.selectedtable1)
    this.service.getcol(this.selectedtable1).subscribe((data) =>{
      this.selectedtable1columns=data
      console.log(this.selectedtable1columns)
      for (let index = 0; index < Object.keys(this.selectedtable1columns).length; index++) 
      {
        this.selectedtable1columnsarray.push(Object.values(this.selectedtable1columns[index]).toString())
      }
      console.log(this.selectedtable1columnsarray)
    })
  }
  seljointab2(event : any)
  {
    this.selectedtable2columnsarray=[]
    this.selectedtable2=event.target.value
    console.log(this.selectedtable2)
    this.service.getcol(this.selectedtable2).subscribe((data) =>{
      this.selectedtable2columns=data
      console.log(this.selectedtable2columns)
      this.joincolval=true
      this.searchval=true
      for (let index = 0; index < Object.keys(this.selectedtable2columns).length; index++) 
      {
        var temp=Object.values(this.selectedtable2columns[index]).toString()
        this.selectedtable2columnsarray.push(temp)
      }
      console.log(this.selectedtable2columnsarray)

    })
    this.service.getjoincols(this.selectedtable1,this.selectedtable2).subscribe((data) => 
    {
        this.commoncols=data
        console.log(this.commoncols)
        for (let index = 0; index < Object.keys(this.commoncols).length; index++) 
      {
        var temp=Object.values(this.commoncols[index]).toString()
        this.commoncolumns.push(temp)
      }
    })
  }
  selectedorder(event: any)
  {
    const temp = event.target.value
    if(temp == "ASCENDING")
    {
      this.selectdorder = "asc"
    }
    else
    {
      this.selectdorder = "desc"
    }
  }
  selectedcomparator(event: any)
  {
    const comp = event.target.value
    this.comparator = comp
    console.log(this.comparator)
    console.log(this.count_entered)
  }
  resetdrag()
  {
    console.log(this.done)
    this.todo.push(this.done.pop())
    this.value=false
    this.orderbyvalue=false
    this.groupbyvalue=false
    this.aggval=false
    this.value = false
    this.groupbycolval=false
    this.aggval=false
    this.value1=false
    this.searchval=false
    this.groupbycolval=false
    this.dispvalue=false
    this.countvalue = false
    this.joinval = false
    this.analticalval = false
    this.jointabval = false
    this.joincolval = false
    console.log(this.done)
  }
  removeselectedcols1(cols)
  {
    const index: number = this.selectedtable1columnsarray.indexOf(cols);
    if (index !== -1) 
    {
        this.selectedtable1columnsarray.splice(index, 1);
    }
  }
  removeselectedcols2(cols)
  {
    console.log(cols)
    const index: number = this.selectedtable2columnsarray.indexOf(cols);
    if (index !== -1) 
    {
        this.selectedtable2columnsarray.splice(index, 1);
    }
  }
  removecolumnsjoin(cols)
  {
    console.log(cols)
    const index: number = this.selectedcolumns.indexOf(cols);
    if (index !== -1) 
    {
        this.selectedcolumns.splice(index, 1);
    }
  }
  seltab(event:any)
  {
    this.selectedtable = event.target.value
    console.log(this.selectedtable)
    this.service.getcol(this.selectedtable).subscribe((data)=>
    {  
      this.colname = data;
      this.colname1 = Object.assign(this.colname)
      console.log(this.colname1, this.colname)
    })

    if (this.done[0] == "GROUP BY" || this.done[1] == "GROUP BY")
    {
      this.groupbycolval = true
      this.groupbyselectedcols = []
    }
    else
    {
      this.groupbycolval = false
    }
  }
  selcol(event : any)
  {
    this.selectedaggcolumn=event.target.value
    console.log(this.selectedaggcolumn)
  }
  selanaltics(event : any)
  {
    this.analticalfunction=event.target.value
    console.log(this.analticalfunction)
    if(this.analticalfunction == 'MIN' || this.analticalfunction == 'MAX' || this.analticalfunction == 'SUM' || this.analticalfunction == 'COUNT' || this.analticalfunction == 'AVG')
    {
      this.analticalaggval = true
    }
    else
    {
      this.analticalaggval = false
    }
  }
  selanalticalagg(event : any)
  {
    this.selectedanalticalaggcolumn=event.target.value
    console.log(this.selectedanalticalaggcolumn)
  }
  selpartitioncol(event : any)
  {
    this.selectedpartitioncolumn=event.target.value
    console.log(this.selectedpartitioncolumn)
  }
  selorderbycol(event : any)
  {
    this.selectedorderbycolumn=event.target.value
    console.log(this.selectedorderbycolumn)
  }
  
  query()
  {
    console.log(this.count_entered)
    console.log(this.done)
    console.log(this.done.length)
    if(this.done[0]=='ORDER BY' && this.done.length == 1)
    {
      console.log("order by function")
      this.comparator = "no"
      this.count_entered = 0
      console.log(this.selectedorderbycolumn)
      this.service.postquery(this.selectedtable,this.selectedorderbycolumn,this.done,this.selectdorder,this.selectedagg, this.having, this.comparator, this.count_entered).subscribe((data) =>
      {
        this.name=data
        console.log(data)
      })
      this.http.get(this.queryUrl).subscribe((data)=>{
        this.rowData = data
      })
    }
    else if(this.done.indexOf('GROUP BY') != -1 && this.done.indexOf('HAVING') == -1 && this.done.indexOf('JOIN') == -1 && this.done.indexOf('ORDER BY') == -1)
    {
      this.having = "no"
      this.comparator = "no"
      this.count_entered = 0
      console.log(this.groupbyselectedcols)
      console.log(this.selectedaggcolumn)
      console.log(this.done)
      console.log(this.selectedtable)
      console.log(this.having)
      this.service.postquery(this.selectedtable,this.groupbyselectedcols,this.done,this.selectedaggcolumn,this.selectedagg, this.having,this.comparator, this.count_entered).subscribe((data) =>
      {
        this.name=data
        console.log(data)
      }) 
      this.http.get(this.queryUrl).subscribe((data)=>{
        this.rowData = data
      })
    }
    else if(this.done[0]=='GROUP BY' && this.done[1] == "HAVING")
    {
      console.log(this.groupbyselectedcols)
      console.log(this.selectedaggcolumn)
      console.log(this.done[1])
      console.log(this.selectedtable)
      console.log(this.having)
      console.log(this.comparator)
      console.log(this.count_entered)
      this.service.postquery(this.selectedtable,this.groupbyselectedcols,this.done[0],this.selectedaggcolumn,this.selectedagg, this.having, this.comparator, this.count_entered).subscribe((data) =>
      {
        this.name=data
      }) 
      this.http.get(this.queryUrl).subscribe((data)=>{
        this.rowData = data
      })
    }
    else if(this.done[1]=='GROUP BY' && this.done[0] == "HAVING")
    {
      console.log(this.groupbyselectedcols)
      console.log(this.selectedaggcolumn)
      console.log(this.done[1])
      console.log(this.selectedtable)
      console.log(this.having)
      console.log(this.comparator)
      console.log(this.count_entered)
      this.service.postquery(this.selectedtable,this.groupbyselectedcols,this.done[1],this.selectedaggcolumn,this.selectedagg, this.having, this.comparator, this.count_entered).subscribe((data) =>
      {
        this.name=data
        console.log(data)
      }) 
      this.http.get(this.queryUrl).subscribe((data)=>{
        this.rowData = data
      })
    }
    else if(this.done[0]=='JOIN' && this.done.length == 1)
    {
      let missing=[],missing2=[]
      console.log(this.selectedtable1columnsarray)
      console.log(this.selectedtable2columnsarray)
      missing = this.selectedtable1columnsarray.filter(item => this.selectedtable2columnsarray.indexOf(item) < 0);
      console.log(missing);
      missing2 = this.selectedtable2columnsarray.filter(item => this.selectedtable1columnsarray.indexOf(item) < 0);
      console.log(missing2);
      if (missing.length >0 || missing2.length >0) 
      {
        alert("TWO TABLES NOT SHARING SAME COLUMNS TO JOIN")
      }
      else
      {
        this.service.postjoin(this.selectedtable1,this.selectedtable2,this.selectedcolumns,this.selectedjoin,this.selectedtable1columnsarray).subscribe((data) =>
        {
          this.name=data
        })
        this.http.get(this.queryUrl).subscribe((data)=>{
          this.rowData = data
        })
      }
    }
    else if(this.done[0]=='ANALYTICAL FUNCTIONS' && this.done.length == 1)
    {
      this.service.postanaltics(this.selectedtable,this.analticalfunction,this.selectedpartitioncolumn,this.selectedorderbycolumn,this.selectedanalticalaggcolumn).subscribe((data) => {
        this.name=data
      })
    }
    else if(this.done.length >1)
    {
      console.log(this.done.length)
      if(this.done.indexOf('JOIN') == -1)
      {
      this.service.postmultiquery(this.selectedtable,this.groupbyselectedcols,this.done,this.selectedaggcolumn,this.selectedagg, this.selectedorderbycolumn,this.selectdorder).subscribe((data) => {
        this.name = data
      })
      }
      else if(this.done.indexOf('JOIN') != -1)
    {
      console.log(this.done.indexOf('JOIN'))
       this.service.postmultiqueryjoin(this.selectedtable1,this.selectedtable2,this.selectedcolumns,this.selectedjoin,this.selectedtable1columnsarray,this.selectedtable,this.groupbyselectedcols,this.selectedorderbycolumn,this.selectdorder).subscribe((data) =>{
         this.name = data
       })
    } 
  }
    this.display() 
  }
  display()
  {
    this.dispvalue=true
    this.keys = [];
    this.tablename = this.selectedtable
    this.http.get(this.queryUrl).subscribe((data)=>{
    this.rowData = data
    })
    console.log(this.rowData)
    this.service.getquery().subscribe((data)=>
    {  
      this.dataa = data;
      for(var i in data)
      {
        var key = i;
        this.val = data[i];
        for(var j in this.val)
        {
          var sub_val = this.val[j];
          this.actualData.push(sub_val)
          this.actualDatatype.push(typeof(sub_val))
          this.keys.push(j);      
        }
        break;
      }
      for (this.k in this.keys)
      {
        this.columnDefs.push({"field": this.keys[this.k], filter: true});    
      } 
      this.column = this.columnDefs
      console.log(this.column)
      console.log(typeof(this.column))
    });
    
    this.column=null
    this.columnDefs=[]
  }
  ngOnInit(): void 
  {
    this.service.getTable().subscribe((data) => 
    {
      this.tableData = data;
      //console.log(JSON.stringify(this.tableData))
    })
    this.gridOptions = {
      defaultColDef:
      {
        flex: 1,
        minWidth: 110,
        editable: true,
        resizable: true
      },
      undoRedoCellEditing: true,
      paginationPageSize: 10,
      editType: 'fullRow',      
    }  

  }
}

