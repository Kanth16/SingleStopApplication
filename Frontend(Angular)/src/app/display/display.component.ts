import { Component, OnInit, ViewChild} from '@angular/core';
import { FrontComponent } from '../front/front.component'
import { MyserviceService } from '../myservice.service';
import { Router } from '@angular/router';
import { AgGridAngular } from 'ag-grid-angular';
import { DateAdapter } from '@angular/material/core';

@Component({
  selector: 'app-display',
  templateUrl: './display.component.html',
  styleUrls: ['./display.component.css']
})
export class DisplayComponent implements OnInit {
  @ViewChild('agGrid') agGrid: AgGridAngular;
  public gridApi;
  public gridOptions;
  public defaultColDef;

  keys: any[] = [];
  values: any[] = [];
  dataa: any;
  len: any;
  clickEvent: any;
  tablename: string;
  columnDefs: any[] = [];
  column: any;
  k: any;
  u: any;
  d: any;
  postData: any;
  row: any;
  postDel: any;
  rawData: any[] = [];
  actualData: any[] = [];
  editedData: any[] = [];
  sendData: any[] = []
  actualDatatype: any[] = [];
  editedDatatype: any[] = [];
  newActualType: any[] = [];
  newEditedType: any[] = [];
  val: any;
  dis: any[] = [];
  updateDis: any[] = [];
  compareData: any[] = []
  datePattern = /^\d{4}\-\d{1,2}\-\d{1,2}$/;
  varcharPattern = /^([0-9]+[a-zA-Z]+|[a-zA-Z]+[0-9]+)[0-9a-zA-Z]*$/;
  numberPattern = /^[0-9]+$/;
  charPattern = /^[A-Za-z. ]+$/;
  errorDataType = [];
  dataSend = [];
  singleRowValue = [];
  verifyValue = [];
  errorMsg = false;
  errorDisplay: string;
  delMsg = false;
  delEmpty = false;
  updateMsg = false;
  updateEmpty = false;
  updateValue: any;
  delValue: any;
  addData = [];
  postIdData: any;
  constructor(private service:MyserviceService,
              private table: FrontComponent,
              private router: Router)
            {
              this.router.routeReuseStrategy.shouldReuseRoute=()=>false;
            }
  display()
  {
    this.keys = [];
    this.tablename = this.table.tablename
    // to get rowdata to be dsiplayed in the grid
    this.service.getData(this.tablename).subscribe((data)=>
    {
      this.dataa = data;
      // to get the fields(column names) alone
      const data_length = this.dataa.length
      console.log(data_length)
      //for(var i in data)
      {
        var i = data_length-1
        this.val = data[i];
        for(var j in this.val)
        {
          var sub_val = this.val[j];
          this.actualData.push(sub_val)
          this.actualDatatype.push(typeof(sub_val))
          this.keys.push(j);
        }
        console.log(this.actualData)
        //break; 
      }
      console.log(this.dataa)
      console.log(this.actualData)
      // to get the column definitions in the pattern required for ag-grid
      var len = this.keys.length
      this.columnDefs.push({"field": this.keys[0], checkboxSelection: true, filter: true})
      for (this.k in this.keys)
      {
        if (this.k > 0 && this.keys[this.k] != "ACTIVE_FLAG")
        {
          this.columnDefs.push({"field": this.keys[this.k], filter: true});
        }
      }
      this.column = this.columnDefs
    });
  }
// This function is to get the actual values of the rows which are selected  
  onRowSelected(event)
  {
    this.updateEmpty = false;
    this.delEmpty = false;
    this.clickEvent = event.node.selected;              // returns true or false when a checkbox is checked and unchecked
    if (this.clickEvent)
    {
      console.log(this.clickEvent)
      const singleRowData = event.data                    // to get the data of the selected row
      this.singleRowValue = Object.values(singleRowData)  // gets the values alone
    // To convert date from the format of GMT to yyyy-mm-dd
    for(var dt in this.singleRowValue)
    {
      if (typeof(this.singleRowValue[dt]) == "string")
      {
        if (this.singleRowValue[dt].indexOf(" GMT") > -1)
        {
          this.singleRowValue[dt] = this.dateConversion(this.singleRowValue[dt])
        }
      }
    }
    // this for loop is to get the data type of all the values in the selected rows (before editing) with the replaced type for dates from string to date
    for (var a in this.singleRowValue)
    {
      if (typeof(this.singleRowValue[a]) == "string")
      {
        if (this.datePattern.test(this.singleRowValue[a]))
        {
          this.actualDatatype[a]= "date"
        }
      }
    }
    for (this.d in this.actualDatatype)
    {
      // if(this.actualDatatype[this.d] == "object" && (this.actualDatatype[this.d-1] == "number"))
      // {
      //   this.actualDatatype[this.d] = "number"
      // }
      // else if(this.actualDatatype[this.d] == "object" && this.actualDatatype[this.d-1] == "string") 
      // {
      //   this.actualDatatype[this.d] = "char"
      // }
      // if (this.singleRowValue[this.d] == null)
      // {
      //   this.singleRowValue[this.d] = "NULL"
      // } 
    }
  }
  }
  //To get the row data after editing it
  public editedRow(editedRow): void
  {
    this.row = editedRow.data;    //to get the row data which has been edited
    //To get the values and data types of the edited row
    for (var i in this.row)
    {
      var value = this.row[i];
      this.editedData.push(value);
      this.editedDatatype.push(typeof(value))
    }
    //To convert the date from "GMT" format to yyyy-dd-mm after editing is completed
    for(var b in this.editedData)
    {
      if (typeof(this.editedData[b]) == 'string')
      {
        if (this.editedData[b].indexOf("GMT") > -1)
        {
          this.editedData[b] = this.dateConversion(this.editedData[b])
        }
      }
    }
    // Validation of datatypes of values to be updated
    for (var c in this.actualDatatype)
    {
      if (typeof(this.editedData[c]) == "string")
      {
        if (this.datePattern.test(this.editedData[c]))
        {
          this.editedDatatype[c] = "date"
        }
      }
      {
        if (this.actualDatatype[c] == "number"  && this.editedDatatype[c] == "string")
        {
          if(this.numberPattern.test(this.editedData[c]))
          {
            this.editedData[c] = Number(this.editedData[c])
            this.editedDatatype[c] = "number"
          }
        }
        if ((typeof(this.singleRowValue[c]) == "string"))
        {
          if ((this.actualDatatype[c] == "string" || this.actualDatatype[c] == "varchar") && (this.singleRowValue[c].toString()).match(this.varcharPattern)!= null)
          {
            if (this.varcharPattern.test(this.editedData[c]))
            {
              this.actualDatatype[c] = "varchar"
              this.editedDatatype[c] = "varchar"
            }
            else
            {
              this.actualDatatype[c] = "varchar"
            }
          }
          else  if ((this.actualDatatype[c] == "string" || this.actualDatatype[c] == "char"  )) // && this.singleRowValue[c].match(this.charPattern)!= null)
          {
            if (this.editedData[c].match(this.charPattern)!= null)
            {
              this.editedDatatype[c] = "char"
              this.actualDatatype[c] = "char"
            }
              else
              {
                console.log(this.singleRowValue[c])
                this.actualDatatype[c] = "char"
              }
            }
          }
        }
      if (this.actualDatatype[c] == "number" && this.editedDatatype[c] != "number")
      {
      this.errorDataType.push("Integer")
      }
      if (this.actualDatatype[c] == "char" && this.editedDatatype[c] != "char")
      {
      this.errorDataType.push("char")
      }
      if (this.actualDatatype[c] == "varchar" && this.editedDatatype[c] != "varchar")
      {
      this.errorDataType.push("varchar(alpha-numeric)")
      }
      if (this.actualDatatype[c] == "date" && this.editedDatatype[c] != "date")
      {
      this.errorDataType.push("date")
      }
    }
        console.log(this.actualDatatype, this.editedDatatype)
    // comparing the arrays with data type of the selected row before and after editing
    if (JSON.stringify(this.editedDatatype) != JSON.stringify(this.actualDatatype))
    {
      if (this.errorDataType[0] != "Male/Female")
      {
        this.errorMsg = true
        this.errorDisplay = this.errorDataType[0]
       // window.alert("Invalid Entry!! \nplease enter a valid data which consist of " + this.errorDataType + " only")
        this.errorDataType = []
        this.editedData = []
        this.editedDatatype = []
      }
    }
    else
    {
      this.errorMsg = false

      if (this.editedData[0] != this.singleRowValue[0])
      {
        this.addData.push(this.editedData[0])
        this.addData.push(this.singleRowValue[0])
      }
      this.sendData.push(this.singleRowValue[0])
      for (this.u in this.editedData)
      {
        if (this.u>0)
        {
          this.sendData.push(this.editedData[this.u])
        }
      }
      this.editedData = []
      this.editedDatatype = []
      this.errorDataType = []
    }
  }
  updateRow() 
  {
    if (JSON.stringify(this.sendData) == JSON.stringify(this.singleRowValue))
    {
      this.sendData = []
    }
    if (this.addData.length != 0)
    {
      this.service.postIdData(this.addData, this.tablename).subscribe((data)=>
      {
        this.postIdData=data;
      })
      this.service.postData(this.sendData, this.tablename).subscribe((data)=>
      {
        this.postData=data;
      })
    }
    else
    {
      this.service.postData(this.sendData, this.tablename).subscribe((data)=>
      {
        this.postData=data;
      })
    }
    this.clickEvent = false
    const actLen = this.actualData.length
    if (this.sendData.length == 0)
    {
      const len = this.addData.length
      for (var ed = 0; ed<len-1;)
      {
        this.updateDis.push(this.addData[ed])
        ed = ed+actLen
      }
    }
    else
    {
    const len = this.sendData.length
    for (var ed = 0; ed<len-1;)
    {
      this.updateDis.push(this.sendData[ed])
      ed = ed+actLen
    }
  }
    if (this.updateDis.length == 0 && this.addData.length ==0)
    {
      this.updateEmpty = true;
    }
    else
    {
      this.updateMsg = true;
      this.updateValue = this.removeDuplicates(this.updateDis)
      alert("Row with " + this.keys[0] + ": " + this.updateValue + " has been updated successfully")
      this.row = {}
      this.updateDis = []
      this.sendData = []
      this.addData = []
      this.actualData = []
      this.actualDatatype = []
      this.display()
    }
  }
  //To delete the selected rows
  delete()
  {
    this.row = this.agGrid.api.getSelectedRows();
    for (var i in this.row)
    {
      var values = this.row[i];
      for (var j in values)
      {
        var dt = values[j];
        this.rawData.push(dt)
      }
  }
    const len = this.rawData.length
    const actLen = this.actualData.length
    for (var ed = 0; ed<len;)
    {
      this.dis.push(this.rawData[ed])
      ed = ed+actLen
    }
    this.service.postDel(this.rawData, this.tablename).subscribe((data)=>
    {
      this.postDel = data;
    })
    if (this.dis.length == 0)
    {
      this.delEmpty = true;
      //window.alert("No rows are selected \nSelect any row to delete")
    }
    else
    {
    this.delMsg = true;
    this.delValue = this.dis
    window.alert("Row with " + this.keys[0] + ": " + this.delValue + " has been deleted successfully")
    this.row = {}
    this.rawData = []
    this.actualData = []
    this.dis = []
    this.display()
    }
  }
  //To convert the date to yyyy-dd-mm format
  dateConversion(str)
  {
    var mnths =
    {
      Jan: "01", Feb: "02", Mar: "03", Apr: "04", May: "05", Jun: "06", Jul: "07", Aug: "08", Sep: "09", Oct: "10", Nov: "11", Dec: "12"
    },
      date = str.split(" ");
      return [date[3], mnths[date[2]], date[1]].join("-");
  }
  removeDuplicates(array)
  {
    return array.filter((a, b) => array.indexOf(a) === b)
  };

  onGridReady(params) 
  {
    this.gridApi = params.api;
  }

  ngOnInit(): void
 {
    this.display()
    this.gridOptions = 
    {
      defaultColDef:
      {
        flex: 1,
        minWidth: 110,
        editable: true,
        resizable: true
      },
      singleClickEdit: false,
      undoRedoCellEditing: true,
      paginationPageSize: 10,
      editType: 'fullRow',      
    }  
  }
}
