import unittest
import sys
import os.path
import collections
import re
sys.path.append(os.path.join(os.path.dirname(os.path.dirname(__file__)),'main'))
import connection
import execution
import creation_ddl_update
import devconfig

class check_student(unittest.TestCase):
    pass

def test_dbconnect():
    def test(self):
        mydb=connection.connect()
        self.assertEqual(mydb.is_connected(),True)
        return test

def test_creation(tables):
    def test(self):
        mydb = connection.connect()
        mycursor = mydb.cursor()
        mycursor.execute("show tables")
        table = mycursor.fetchall()
        dbtables=[]
        for i in table:
            dbtables.append("".join(list(i)))
        self.assertEqual(tables in dbtables ,True)
    return test

def test_insertion(table):
    def test(self):
        mydb = connection.connect()
        mycursor = mydb.cursor()
        schema_prod = devconfig.Dev("dev").connect_db()
        schema_test = devconfig.Dev("test").connect_db()
        mycursor.execute("select distinct column_name from information_schema.columns where table_name='" + table + "'")
        data = mycursor.fetchall()
        data_cp = []
        for i in data:
            a = list(i)
            data_cp.append("".join(a))
        data_cp = data_cp[:len(data_cp) - 3]
        data_cp = ",".join(data_cp)
        mycursor.execute("select distinct column_name from information_schema.columns where table_name='test_" + table + "'")
        data1 = mycursor.fetchall()
        data1_cp = []
        for i in data1:
            a = list(i)
            data1_cp.append("".join(a))
        data1_cp = data1_cp[:len(data1_cp) - 3]
        data1_cp = ",".join(data1_cp)
        if "dimension" in table:
            temp=data_cp.split(",")
            temp1=data1_cp.split(",")
            #mycursor.execute("select "+data_cp+" from " + schema_test[3] + ".test_" + table + " where " + temp1[0] + " not in (select " + temp[0] + " from " + schema_prod[3] + "." + table + ")")
            mycursor.execute("select "+data_cp+" from " + schema_test[3] + ".test_" + table )
            comp = mycursor.fetchall()
            #mycursor.execute("select "+data1_cp+" from " + schema_prod[3] + "." + table + " where " + temp[0] + " not in (select " + temp1[0] + " from "+ schema_test[3] + ".test_" + table + ")")
            mycursor.execute("select "+data1_cp+" from " + schema_prod[3] + "." + table)
            comp1 = mycursor.fetchall()
        else:
            mycursor.execute("select "+data1_cp+" from "+schema_test[3] + ".test_" + table)
            comp=mycursor.fetchall()
            mycursor.execute("select "+data_cp+" from " + schema_prod[3] + "."+table)
            comp1 = mycursor.fetchall() 
        diff=list(set(comp1)-set(comp))
        diff1 = list(set(comp)- set(comp1))
        self.assertEqual(diff==diff1, True,msg=table+ " " + str(set(diff)-set(diff1)))
    return test

def test_validations(table):
    def test(self):
        mydb = connection.connect()
        mycursor = mydb.cursor()
        del sys.path[:]
        sys.path.append(os.path.join(os.path.dirname(os.path.dirname(__file__)), 'files', 'ddl', table +'.sql'))
        for file_path in sys.path:
            mycursor.execute("desc " + table)
            data = mycursor.fetchall()
            b = []
            for i in data:
                a = list(i)
                b.append((str(a[0]) + " " + str(a[1])).upper().replace("B'","").replace("'",""))
            #print(b)
            with open(file_path, 'r') as datas:
                lines = datas.readlines()
                line1 = "".join(lines)
                line1 = re.sub(' +', ' ', line1)
                line1=line1.replace("\n","").split(table)[1].replace("NOT NULL", "").replace("PRIMARY KEY", "").strip("(").strip(" (").replace(");", "").split("FOREIGN KEY")[0].split(",")
                c = []
                for i in line1:
                    c.append(i.rstrip().lstrip())
                if ("" in c):
                    c.remove("")
            #print(c)
            self.assertEqual((collections.Counter(b) == collections.Counter(c)),True,msg=table +" "+str(set(c)-set(b)))
    return test

# if __name__=="__main__":
#     tables=input()
#     test_name = 'test_%s_creation' % tables
#     print(test_name)
#     test = test_creation(tables)
#     setattr(check_student, test_name, test)
#     test_name = 'test_%s_validation' % tables
#     print(test_name)
#     test2 = test_validations(tables)
#     setattr(check_student, test_name, test2)
#     test_name = 'test_%s_insertion' % tables
#     print(test_name)
#     test1 = test_insertion(tables)
#     setattr(check_student, test_name, test1)
#     unittest.main(verbosity=2)