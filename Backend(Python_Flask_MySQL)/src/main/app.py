from flask import Flask, jsonify, render_template, request, redirect, url_for, send_file
from flask_mysqldb import  MySQL
import MySQLdb
from flask_cors import CORS
import sys, os.path
import json
from decimal import Decimal
import re
from os import listdir
sys.path.append(os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))),'test'))
from insertion import table_insertion
from creation_ddl_update import table_creation_updation
from ut import *

app = Flask(__name__)
app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = 'mysql'
app.config['MYSQL_DB'] = 'student'
app.config['MYSQL_CURSORCLASS'] = 'DictCursor'
app.config['JSON_SORT_KEYS'] = False

CORS(app)
mysql=MySQL(app)
tablename = ''
tablename1 = ''
tablename2 = ''
groupcolumnname = []
aggcolumn=[]
func = ''
agg=''
response=''
having = ''
selectedcolumns1=[]
selectedcolumns2=[]
jointype=''
joincol=''
count_value = ''
comparator = ''
order =''

@app.route('/creation',methods=["POST", "GET"])
def creation():
    try:
        if request.method == 'POST':
            result = request.data
            result=result.decode("utf-8")
            table_name=result.split(":")[0].replace("{", "").replace("'","").replace("}","").replace('"','')
            t=table_name.split(".")
            file_name=t[0]
            file_path=os.path.join(os.path.dirname(os.path.dirname(__file__)),'files','ddl', file_name + '.sql')
            obj=table_creation_updation(file_name)
            t=obj.create_table(file_name,file_path)
        return "true"
    except Exception as e:
        return e

@app.route('/insertion',methods=["POST", "GET"])
def output():
    try:
        if request.method == 'POST':
            result = request.data
            result=result.decode("utf-8")
            table_name=result.split(":")[0].replace("{", "").replace("'","").replace("}","").replace('"','')
            t=table_name.split(".")
            file_name=t[0]
            cur = mysql.connection.cursor()
            cur.execute("SHOW TABLES")
            tab = cur.fetchall()
            dbtables=[]
            for i in tab:
                dbtab=str(list(i.values())).replace("['","").replace("']","")
                dbtables.append(dbtab)
            if file_name in dbtables:
                file_path=os.path.join(os.path.dirname(os.path.dirname(__file__)),'files','records', file_name + '.csv')
                file_sql=os.path.join(os.path.dirname(os.path.dirname(__file__)),'files','ddl', file_name + '.sql')
                obj1=table_creation_updation(file_name)
                update=obj1.ddl_updates(file_name,file_sql)
                if update == "equal":
                    obj=table_insertion(file_name)
                    t=obj.record_insertion(file_name,file_path)
                    mysql.connection.commit()
                    response="true"
                else:
                    update=="updated"
                    obj=table_insertion(file_name)
                    t=obj.record_insertion(file_name,file_path)
                    mysql.connection.commit()
                    response="true"
            else:
                response="false"
        return response
    except Exception as err:
        return err

@app.route('/tables')
def tables():
    ''' To get the tables present in the selected db'''
    cur = mysql.connection.cursor()
    cur.execute("SHOW TABLES")
    fetchdata = cur.fetchall()
    tables = jsonify(fetchdata)
    return tables
    cur.close()

@app.route('/testing', methods=["POST", "GET"])
def testing():
    ''' To perform unittesting to check if the table creation and value insertion are done properly'''
    if request.method == 'POST':
      flag = True
      op = request.json
      x = list(op.values())
      table_name=x[0]
      test_name = 'test_%s_creation' % table_name
      test = test_creation(table_name)
      setattr(check_student, test_name, test)
      test_name = 'test_%s_validation' % table_name
      test2 = test_validations(table_name)
      setattr(check_student, test_name, test2)
      test_name = 'test_%s_insertion' % table_name
      test1 = test_insertion(table_name)
      setattr(check_student, test_name, test1)
      filepath = os.path.join(os.path.dirname(os.path.dirname(__file__)),'files','output.html')
      with open (filepath, "r+") as data:
        data.seek(0)
        data.truncate()
        runner = unittest.TextTestRunner(data, verbosity= 2)
        unittest.main(testRunner=runner, exit = False)
      with open (filepath, "r+") as rd:
          readData = rd.read()
          rd.truncate()
      return jsonify(readData)

@app.route('/select/<string:tablename>')
def select(tablename):
    ''' To display the data whenever a table is selected - only active rows will be displayed'''
    try:  
        cur = mysql.connection.cursor()     
        sql = ("SELECT * FROM {} WHERE ACTIVE_FLAG = 'Y'" .format(tablename))
        cur.execute(sql)
        fetchdata=cur.fetchall()         # fetches all the rows from the database which satisfies the given condition
        response=jsonify(fetchdata)      # converting the result to a format accepted by flask for return
        cur.close()
        return response
    except MySQLdb.Error as err:
        return str(err)

@app.route('/update/<string:tablename>', methods = ["POST", "GET"])
def update(tablename):
    '''To update the changes made in the table '''
    if request.method == "POST":
        receivedData = request.json             # gets the posted data in the form of json object
        x = list(receivedData.values())         # the values from the json object are stored in a list
        print(x)
        cur = mysql.connection.cursor()
        query = ("SELECT * FROM {}" .format(tablename))
        cur.execute(query)
        fetchdata = cur.fetchall()
        colName = list(fetchdata[0].keys())     # to get the column names alone
        print(colName)
        actualLength = len(colName)             #length of single row of the table (or) no. of columns in a table
        dataLength = len(x[0])                  # length of number of values posted from the frontend - in order to verify the number of rows to be updated
        n = dataLength/actualLength             # the lengths are compared on order to perform update of multiple rows
        updateList = x[0][::actualLength]
        col = colName*int(n)
        #query = "SET foreign_key_checks=0"
        cur.execute(query)
        ind, count = 0, 0
        print(actualLength, dataLength)
        for i in (range(1, (dataLength))):
            print(col[i])
            count+=1
            if count%actualLength == 0:
                ind+=1
            if col[i] != col[0]:
                sql = "update {} set {} = %s where {} = %s" .format(tablename, col[i], col[0])
                cur.execute(sql, [x[0][i], updateList[ind]])
                print(sql)
            s = updateList[ind]
            for i in range (0, actualLength):
                if colName[i].count("START_DATE") > 0:
                    sql = "update {} set {} = curdate() where {} = %s;" .format(tablename, colName[i], colName[0])
                    cur.execute(sql, [s])
                    print((sql, [s]))
        mysql.connection.commit()
        cur.close()
    return "True"

@app.route('/updateID/<string:tablename>', methods = ["POST", "GET"])
def updateID(tablename):
    if request.method == "POST":
        receivedData1 = request.get_json()
        rowData = receivedData1['addData']
        cur = mysql.connection.cursor()
        query = ("SELECT * FROM {}" .format(tablename))
        cur.execute(query)
        fetchdata = cur.fetchall()
        colName = list(fetchdata[0].keys())
        #query = "SET foreign_key_checks=0"
        cur.execute(query)
        for i in range(0, len(rowData), 2):
            sql = ("update {} set {} = %s  where {} = %s ;" .format(tablename, colName[0], colName[0]))
            cur.execute(sql, [rowData[i], rowData[i+1]])
        mysql.connection.commit()
        cur.close()
    return "True"

@app.route('/s_delete/<string:tablename>', methods=["POST", "GET"])
def s_delete(tablename):
    ''' To do soft deletion on the rows selected in the table - a flag is set to indicate that the row is inactive '''
    if request.method == 'POST':
        receivedData = request.json
        x = list(receivedData.values())
        cur = mysql.connection.cursor()
        query = ("SELECT * FROM {}" .format(tablename))
        cur.execute(query)
        fetchdata = cur.fetchall()
        colName = list(fetchdata[0].keys())
        actualLength = len(colName)
        dataLength = len(x[0])
        query = "SET foreign_key_checks=0"
        cur.execute(query)
        for i in range(0, dataLength, actualLength):
            sql = ("update {} set ACTIVE_FLAG = 'N' where {} = %s ;" .format(tablename, colName[0]))
            cur.execute(sql, [x[0][i]])
            s = x[0][i]
            for i in range (0, actualLength):
                if colName[i].count("END_DATE") > 0:
                    sql = "update {} set {} = curdate() where {} = %s;" .format(tablename, colName[i], colName[0])
                    cur.execute(sql, [s])
        mysql.connection.commit()
        cur.close()
    return "True"

@app.route('/joins',methods=["GET","POST"])
def joinss():
    global tablename1,tablename2,selectedcolumns1,selectedcolumns2,selectedcolumns,jointype,joincol,response
    if request.method=='POST':
        selectedcolumns1=[]
        selectedcolumns2=[]
        selectedcolumns=[]
        columns=[]
        joincol=[]
        cur = mysql.connection.cursor()
        joindata=request.get_json()
        tablename1=joindata['tablename1']
        jointype=joindata['jointype']
        cur = mysql.connection.cursor()
        sql = ("select column_name from information_schema.columns where table_schema = 'student' and table_name=" + "'" + tablename1 + "'")
        cur.execute(sql)
        fetchdata=cur.fetchall()
        for i in fetchdata:
            selectedcolumns1.append(i['COLUMN_NAME'])
        tablename2=joindata['tablename2']
        sql = ("select column_name from information_schema.columns where table_schema = 'student' and table_name=" + "'" + tablename2 + "'")
        cur.execute(sql)
        fetchdata=cur.fetchall()
        for i in fetchdata:
            selectedcolumns2.append(i['COLUMN_NAME'])
        for i in joindata['selectedcolumns']:
            if i in selectedcolumns1:
                selectedcolumns.append("a."+i)
            elif i in selectedcolumns2:
                selectedcolumns.append("b."+i)
        for i in selectedcolumns:
            a = list(i)
            columns.append("".join(a))
        selectedcolumns = ",".join(columns)
        for i in joindata['joincol']:
            if(joindata['joincol'].index(i) == len(joindata['joincol'])-1):
                joincol.append(("a."+i+" = "+"b."+i))
            else:
                joincol.append(("a."+i+" = "+"b."+i+" and"))
        columns=[]
        for i in joincol:
            a = list(i)
            columns.append("".join(a))
        joincol = " ".join(columns)
        sql="SELECT "+selectedcolumns+" FROM "+tablename1+" a "+jointype+" "+tablename2+" b on "+joincol
        cur.execute(sql)
        fetchdata=cur.fetchall()
        response = jsonify(fetchdata)
    return response

@app.route('/multiquery',methods=["GET","POST"])
def multi():
    global tablename,groupcolumnname,func,agg,response,aggcolumn, orderbycol,sel,order
    if request.method == 'POST':
        groupcolumnname=[]
        columns=[]
        cur = mysql.connection.cursor()
        querydata=request.get_json()
        print(querydata)
        tablename=querydata['tablename']
        func=querydata['func']
        order=querydata['selectedorder']
        if 'GROUP BY' in func:
            for cols in querydata['columnname']:
                groupcolumnname.append(cols['COLUMN_NAME'])
        print(groupcolumnname)
        if func.count('GROUP BY') > 0 and func.count('ORDER BY') > 0:
            orderbycol=querydata['orderbycol']
            aggcolumn=querydata['aggcolumn']
            agg=querydata['agg']
            for i in groupcolumnname:
                a = list(i)
                columns.append("".join(a))
            groupcolumnname = ",".join(columns)
            sql="SELECT "+ groupcolumnname + "," + agg+"("+aggcolumn+") from "+tablename+" GROUP BY "+groupcolumnname+" ORDER BY "+orderbycol+" "+order
            print(sql)
            cur.execute(sql)
            fetchdata=cur.fetchall()
            response=jsonify(fetchdata)
    return response

@app.route("/multiqueryjoin",methods = ["GET","POST"])
def multijoin():
    global tablename1,tablename2,selectedcolumns1,selectedcolumns2,selectedcolumns,columns,groupcolumnname,jointype,joincol,orderbycol,response,order
    if request.method=='POST':
        selectedcolumns1=[]
        selectedcolumns2=[]
        selectedcolumns=[]
        groupcolumnname=[]
        columns=[]
        joincol=[]
        columns=[]
        cur = mysql.connection.cursor()
        joindata=request.get_json()
        print(joindata)
        tablename1=joindata['tablename1']
        jointype=joindata['jointype']
        cur = mysql.connection.cursor()
        sql = ("select column_name from information_schema.columns where table_schema = 'student' and table_name=" + "'" + tablename1 + "'")
        cur.execute(sql)
        fetchdata=cur.fetchall()
        print(type(fetchdata))
        for i in fetchdata:
            selectedcolumns1.append(i['COLUMN_NAME'])
        print(selectedcolumns1)
        tablename2=joindata['tablename2']
        sql = ("select column_name from information_schema.columns where table_schema = 'student' and table_name=" + "'" + tablename2 + "'")
        cur.execute(sql)
        fetchdata=cur.fetchall()
        print(fetchdata)
        for i in fetchdata:
            selectedcolumns2.append(i['COLUMN_NAME'])
        print(selectedcolumns2)
        for i in joindata['selectedcolumns']:
            if i in selectedcolumns1:
                selectedcolumns.append("a."+i)
            elif i in selectedcolumns2:
                selectedcolumns.append("b."+i)
        for i in selectedcolumns:
            a = list(i)
            columns.append("".join(a))
        selectedcolumns = ",".join(columns)
        print(selectedcolumns)
        print(len(joindata['joincol']))
        for i in joindata['joincol']:
            if(joindata['joincol'].index(i) == len(joindata['joincol'])-1):
                joincol.append(("a."+i+" = "+"b."+i))
            else:
                joincol.append(("a."+i+" = "+"b."+i+" and"))
        columns=[]
        for i in joincol:
            a = list(i)
            columns.append("".join(a))
        joincol = " ".join(columns)
        print(joincol)
        groupbytable=joindata['groupbytable']
        for cols in joindata['groupbycolumnname']:
            if groupbytable == tablename1:
                groupcolumnname.append("a."+cols['COLUMN_NAME'])
            elif groupbytable == tablename2:
                groupcolumnname.append("b."+cols['COLUMN_NAME'])
        columns=[]
        for i in groupcolumnname:
            a = list(i)
            columns.append("".join(a))
        groupcolumnname = ",".join(columns)
        order=joindata['selectedorder']
        orderbycol=joindata['orderbycol']
        sql="SELECT "+selectedcolumns+" FROM "+tablename1+" a "+jointype+" "+tablename2+" b on "+joincol+" GROUP BY "+groupcolumnname+" ORDER BY "+orderbycol+" "+order
        print(sql)
        cur.execute(sql)
        fetchdata=cur.fetchall()
        print(fetchdata)
        response = jsonify(fetchdata)
    return response

@app.route('/paths')
def paths():
    file_paths=os.listdir(os.path.dirname(__file__))
    file_paths.remove("__init__.py")
    file_paths.remove("__pycache__")
    paths=jsonify(file_paths)
    return paths

@app.route('/imgpath',methods = ["GET","POST"])
def ddl():
    if request.method == 'POST' :
        files=request.data
        filename1=files.decode("utf-8")
        filename2=filename1.split(":")[1].replace("{","").replace("'","").replace("}","").replace('"','')
        filepath2=os.path.join(os.path.dirname(os.path.dirname(__file__)),'pylint_report',str(filename2)+".png")
        del sys.path[:]
        sys.path.append(filepath2)
        return "True"
    elif request.method == 'GET':
        return send_file(sys.path[0],mimetype='image/png')
    else:
        filepath2='error'
    return jsonify(filepath2)

@app.route('/collist/<string:tablename>')
def colnames(tablename):
    cur = mysql.connection.cursor()
    sql = ("select distinct column_name from information_schema.columns where table_schema = 'student' and table_name=" + "'" + tablename + "'")
    cur.execute(sql)
    fetchdata=cur.fetchall()
    response=jsonify(fetchdata)
    cur.close()
    return response
    
@app.route('/analtical',methods=["GET","POST"])
def analtics():
    global tablename,response,func,partitioncol,orderbycol,selectedcolumns,aggcolumn
    if request.method == 'POST':
        selectedcolumns=[]
        columns=[]
        cur = mysql.connection.cursor()
        data=request.get_json()
        tablename=data['tablename']
        func=data['func']
        partitioncol=data['partitioncol']
        selectedcolumns.append(partitioncol)
        orderbycol=data['ordercol']
        selectedcolumns.append(orderbycol)
        if func == 'MIN' or func == 'MAX' or func == 'AVG' or func == 'SUM' or func == 'COUNT': 
            aggcolumn=data['aggcol']
            selectedcolumns.append(aggcolumn)
            selectedcolumns=list(set(selectedcolumns))
            for i in selectedcolumns:
                a = list(i)
                columns.append("".join(a))
            selectedcolumns = ",".join(columns)
            sql="SELECT "+selectedcolumns+","+func+"("+aggcolumn+") over( PARTITION BY "+partitioncol+" ORDER BY "+orderbycol+")  as \"" + func +"\" from "+tablename
            print(sql)
            cur.execute(sql)
            fetchdata=cur.fetchall()
            response=jsonify(fetchdata)
        elif func == 'ROW_NUMBER' or func == 'RANK' or func == 'DENSE_RANK':
            selectedcolumns=list(set(selectedcolumns))
            for i in selectedcolumns:
                a = list(i)
                columns.append("".join(a))
            selectedcolumns = ",".join(columns)
            sql="SELECT "+selectedcolumns+","+func+"() over( PARTITION BY "+partitioncol+" ORDER BY "+orderbycol+") as \"" + func +"\" from "+tablename
            print(sql)
            cur.execute(sql)
            fetchdata=cur.fetchall()
            response=jsonify(fetchdata)
        cur.close()
    return response

@app.route('/query',methods = ["GET","POST"])
def queryexec():
    global tablename,groupcolumnname,func,agg,response,aggcolumn, having, comparator, count_value
    if request.method == 'POST':
        columns=[]
        groupcolumnname=[]
        tabledata=request.get_json()
        print(tabledata)
        tablename = tabledata['tablename']
        having = tabledata['having']
        func = tabledata['func']
        aggcolumn=tabledata['aggcolumn']
        comparator = tabledata['comparator']
        count_value = tabledata['count_val']
        if func == 'GROUP BY':
            agg=tabledata['agg']
            for cols in tabledata['columnname']:
                groupcolumnname.append(cols['COLUMN_NAME'])
            for i in groupcolumnname:
                a = list(i)
                columns.append("".join(a))
            groupcolumnname = ",".join(columns)
        if func == ['GROUP BY']:
            agg=tabledata['agg']
            for cols in tabledata['columnname']:
                groupcolumnname.append(cols['COLUMN_NAME'])
            for i in groupcolumnname:
                a = list(i)
                columns.append("".join(a))
            groupcolumnname = ",".join(columns)        
        cur = mysql.connection.cursor()
        if comparator == "no" :
            if func == ['GROUP BY'] :
                print("groupby")
                sql="SELECT "+ groupcolumnname + "," + agg+"("+aggcolumn+") from "+tablename+" GROUP BY "+groupcolumnname
                print(sql)
                cur.execute(sql)
                fetchdata=cur.fetchall()
                response=jsonify(fetchdata)
                cur.execute(sql)
                fetchdata=cur.fetchall()
                for i in fetchdata:
                    for key,val in i.items():
                        i[key]=str(val)
                response=jsonify(fetchdata)
            elif func == ['ORDER BY']:
                print("orderby")
                column_name = tabledata['columnname']
                sql="SELECT * FROM "+tablename+" order by "+column_name + " " + aggcolumn
                cur.execute(sql)
                print(sql)
                fetchdata=cur.fetchall()
                response=jsonify(fetchdata)
        else:
            print("groupby, having and others")
            sql=("SELECT " + groupcolumnname + "," + agg + "(" + aggcolumn +") FROM "+tablename+" GROUP BY "+groupcolumnname+" having " + agg + "(" +aggcolumn+")"  + " " + comparator + " {}" .format(count_value))
            print(sql)
            cur.execute(sql)
            fetchdata=cur.fetchall()
            for i in fetchdata:
                for key,val in i.items():
                    i[key]=str(val)
            response=jsonify(fetchdata)
    return response

app.run(debug= True)