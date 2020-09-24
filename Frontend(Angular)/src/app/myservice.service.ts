import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class MyserviceService {
  myUrl: string = "http://localhost:5000";
  pathUrl:string = "http://127.0.0.1:5000/paths"
  imgUrl:string = "http://127.0.0.1:5000/imgpath"
  colUrl : string = "http://127.0.0.1:5000/collist"
  queryUrl : string = "http://127.0.0.1:5000/query"
  tableUrl: string = "http://127.0.0.1:5000/tables ";
  tes:string= "http://127.0.0.1:5000/testing";
  covUrl:string = "http://127.0.0.1:5000/coverage"
  joincolUrl: string="http://127.0.0.1:5000/joincol"
  allcolUrl: string="http://127.0.0.1:5000/allcol";
  joinUrl:string="http://127.0.0.1:5000/joins";
  analticalUrl: string = "http://127.0.0.1:5000/analtical";
  multiqueryUrl:string = "http://127.0.0.1:5000/multiquery";
  multiqueryjoinUrl:string = "http://127.0.0.1:5000/multiqueryjoin";
  
  constructor( private http: HttpClient, private router: Router) { }

  getTable()
  {
    return this.http.get(this.myUrl + '/tables')
  }

    getData(tablename)
  {
    return this.http.get(this.myUrl+"/select/"+tablename)
  }

  posttable(tablename)
  {
    return this.http.post(this.myUrl+'/testing',
    {
      tablename
    })
  }

  postData(rowData, tablename)
  {
    return this.http.post(this.myUrl + "/update/" + tablename,
      {
        rowData
      })
  }
  postIdData(addData, tablename)
  {
    return this.http.post(this.myUrl + "/updateID/" + tablename,
    {
      addData
    });
  }
  
  postDel(delData, tablename)
  {
    return this.http.post(this.myUrl + "/s_delete/" + tablename,
    {
      delData
    })
  }
  postpath(path)
  {
    return this.http.post(this.imgUrl,{
      path
    })
  }
  getpath(){
    return this.http.get(this.pathUrl)
  }

  getcol(tablename){
    return this.http.get(this.colUrl+"/"+tablename)
  }
  getcov(){
    return this.http.get(this.covUrl)
  }
  
  getjoincols(tablename1,tablename2){
    return this.http.get(this.joincolUrl+"/"+tablename1+"/"+tablename2)
  }
  
  getallcols(tablename1,tablename2){
    return this.http.get(this.allcolUrl+"/"+tablename1+"/"+tablename2)
  }
  getpathData(path){
    return  this.http.get(this.pathUrl+"/"+path)
  }
  
  postquery(tablename,columnname,func,aggcolumn,agg, having, comparator, count_val){
    return this.http.post(this.queryUrl,{
      tablename,columnname,func,aggcolumn,agg, having, comparator, count_val
    })
  }
  getquery(){
  return this.http.get(this.queryUrl)
  }
  postjoin(tablename1,tablename2,selectedcolumns,jointype,joincol)
  {
    return this.http.post(this.joinUrl,
    {
      tablename1,tablename2,selectedcolumns,jointype,joincol
    })
  }
  getTest(tablename)
  {
    return this.http.get(this.myUrl+'/testing/' + tablename)
  }
  postanaltics(tablename,func,partitioncol,ordercol,aggcol)
  {
    return this.http.post(this.analticalUrl,{
      tablename,func,partitioncol,ordercol,aggcol
    })
  }
  postmultiquery(tablename,columnname,func,aggcolumn,agg, orderbycol,selectedorder)
  {
    return this.http.post(this.multiqueryUrl,
    {
      tablename,columnname,func,aggcolumn,agg, orderbycol,selectedorder
    })
  }
  postmultiqueryjoin(tablename1,tablename2,selectedcolumns,jointype,joincol,groupbytable,groupbycolumnname,orderbycol,selectedorder)
  {
    return this.http.post(this.multiqueryjoinUrl,
      {
        tablename1,tablename2,selectedcolumns,jointype,joincol,groupbytable,groupbycolumnname,orderbycol,selectedorder
      })
  }  
  }

