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

def test_creation(table):
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
        mycursor.execute("select column_name from information_schema.columns where table_name='" + tables + "' limit 1")
        data = mycursor.fetchone()
        data = str(data).split(",")[0].replace("(", "").replace("'", "")
        mycursor.execute("select column_name from information_schema.columns where table_name='test_" + tables + "'limit 1")
        data1 = mycursor.fetchone()
        data1 = str(data1).split(",")[0].replace("(", "").replace("'", "")
        mycursor.execute("select * from " + schema_test[3] + ".test_" + tables + " where " + data1 + " not in (select " + data + " from " + schema_prod[3] + "." + tables + ")")
        comp = mycursor.fetchall()
        mycursor.execute("select * from " + schema_prod[3] + "." + tables + " where " + data + " not in (select " + data1 + " from "+ schema_test[3] + ".test_" + tables + ")")
        comp1 = mycursor.fetchall()
        self.assertEqual(comp == [], True, msg=tables + " " + str(comp))
        self.assertEqual(comp1 == [], True, msg=tables + " " + str(comp1))
    return test

def test_validations(table):
    def test(self):
        mydb = connection.connect()
        mycursor = mydb.cursor()
        del sys.path[:]
        sys.path.append(os.path.join(os.path.dirname(os.path.dirname(__file__)), 'files', 'ddl', tables +'.sql'))
        for file_path in sys.path:
            mycursor.execute("desc " + tables)
            data = mycursor.fetchall()
            b = []
            for i in data:
                a = list(i)
                b.append((str(a[0]) + " " + str(a[1])).upper())
            with open(file_path, 'r') as datas:
                lines = datas.readlines()
                line1 = "".join(lines)
                line1 = re.sub(' +', ' ', line1)
                line1=line1.replace("\n", "").split(tables)[1].replace("NOT NULL", "").replace("PRIMARY KEY", "").strip("(").strip(" (").replace(");", "").split("FOREIGN KEY")[0].split(",")
                c = []
                for i in line1:
                    c.append(i.rstrip().lstrip())
                if ("" in c):
                    c.remove("")
            self.assertEqual((collections.Counter(b) == collections.Counter(c)),True) #,msg=table +" "+str(set(c)-set(b)))
    return test

if __name__=="__main__":
    #tables=input()
    tables="details_main"
    test_name = 'test_%s_creation' % tables
    print(test_name)
    test = test_creation(tables)
    setattr(check_student, test_name, test)
    # test_name = 'test_%s_validation' % tables
    # print(test_name)
    # test2 = test_validations(tables)
    # setattr(check_student, test_name, test2)
    test_name = 'test_%s_insertion' % tables
    print(test_name)
    test1 = test_insertion(tables)
    setattr(check_student, test_name, test1)
    unittest.main()