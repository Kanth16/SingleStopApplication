import sys
import traceback
import os.path
import time
sys.path.append(os.path.join(os.path.dirname(os.path.dirname(__file__)),'main'))
# print(sys.path)
import logfile
import execution

class table_creation_updation:
    """TABLE CREATION AND CHANGES DONE IF DDL UPDATED"""
    def __init__(self,tables):
        """CONNECTION WITH THE DATABASE IS ESTABLISHED AND THE ATTRIBUTES, FUNCTIONS FOR TABLE CREATION ARE INVOKED"""
        self.obj2 = execution.execution()
        self.logs=logfile.logger()
        self.tables=tables

    def fileaccess(self):
        """ACCESSING SQL FILES TO CREATE TABLES"""
        try:
            del sys.path[:]
            sys.path.append(os.path.join(os.path.dirname(os.path.dirname(__file__)), 'files', 'ddl', tables + '.sql'))
            for file_path in sys.path:
                self.create_table(tables,file_path)
            #self.ddl_updates(table, file_path)
            return sys.path
        except Exception as e:
            self.logs.debug(repr(traceback.format_exception(*sys.exc_info())))
            return 1

    def create_table(self,table,file_path):
        """TABLE CREATION"""
        try:
            time1=time.time()
            sqlfile = open(file_path,'r')
            sqlfile = sqlfile.read()
            command = sqlfile.split(';')[0]
            self.obj2.executes(command)
            time2=round(time.time()-time1,2)
            time2=(str(time2))
            self.logs.info(command+" "+table+".sql"+" "+time2+"s "+table+" Table CREATED")
            return 0
        except Exception as e:
            self.logs.debug(repr(traceback.format_exception(*sys.exc_info())))
            return 1



    def ddl_updates(self, table, filepath):
        """CHANGE THE EXISTING DESCRIPTION OF THE EXISTING TABLE WITH THE CHANGES MADE IN THE DDL QUERY """
        try:
            mycursor=self.obj2.executes("show create table " + table)
            db_table = mycursor.fetchone()[1].lstrip(table).strip("ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci").replace("`", "").replace("\n","").replace("  ", "").replace(table.lower() + " (", "").replace(", ", " ,").lower().replace("not null", "").split("key")[0].replace("default null", "").split(",")
            sqlfile = open(filepath).read().split("exists")[1].replace("\n", "").split()
            sqlfile = " ".join(sqlfile).replace(table + "(", "").lower().replace("not null", "").split("foreign key")[0].replace("primary key", "").replace(");", "").split(",")
            print(sqlfile)
            for i, j in zip(sqlfile, db_table):
                if i.strip() != j.strip():
                    self.obj2.executes("alter table " + table + " rename to " + table + "_bak")
                    self.create_table(table, filepath)
                    self.obj2.executes("select distinct column_name from information_schema.columns where table_name=" + "'" + table + "_bak'")
                    column = mycursor.fetchall()
                    columns = []
                    for i in column:
                        a = list(i)
                        columns.append("".join(a))
                    column = ",".join(columns)
                    column1 = "(" + column + ")"
                    self.obj2.executes("INSERT INTO " + table + " " + column1 + " SELECT " + column + " FROM " + table + "_bak")
                    self.obj2.executes("SET foreign_key_checks=0")
                    self.obj2.executes("drop table " + table + "_bak")
                    self.logs.info(table + " UPDATED")
                    retu="updated"
                else:
                    retu="equal"    
            return retu

        except Exception as e:
            self.logs.debug(repr(traceback.format_exception(*sys.exc_info())))
            return 1

def tables():
    """GETTING THE LIST OF TABLES"""
    try:
        del sys.path[:]
        sys.path.append(os.listdir(os.path.join(os.path.dirname(os.path.dirname(__file__)), 'files', 'ddl')))
        tables = []
        for i in sys.path:
            for j in i:
                table = "".join(j)
                table = table.split(".")[0]
                tables.append(table)
            return tables
    except Exception as e:
        logs = logfile.logger()
        logs.debug(repr(traceback.format_exception(*sys.exc_info())))
        return 1

'''table="dimension_exam_details"
file_path=os.path.join(os.path.dirname(os.path.dirname(__file__)), 'files', 'ddl', table + '.sql')
print(file_path)
obj=table_creation_updation(table)
r=obj.ddl_updates(table,file_path)
print(r)'''



