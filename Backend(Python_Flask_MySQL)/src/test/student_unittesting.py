import unittest
import sys
import os.path
import collections
import re
sys.path.append(os.path.join(os.path.dirname(os.path.dirname(__file__)),'main'))
import connection
import devconfig

def gettables():
    table=input()
    return table
    
class check_student(unittest.TestCase):
    def __init__(self,*args, **kwargs):
        super(check_student, self).__init__(*args, **kwargs)
        #tables = gettables()
        self.tables = tables
    
    def test_creation(self):
        mydb = connection.connect()
        mycursor = mydb.cursor()
        mycursor.execute("show tables")
        table = mycursor.fetchall()
        dbtables=[]
        for i in table:
            dbtables.append("".join(list(i)))
        self.assertEqual(self.tables in dbtables ,True)
        return True
    def test_insertion(self):
        mydb = connection.connect()
        mycursor = mydb.cursor()
        schema_prod = devconfig.Dev("dev").connect_db()
        schema_test = devconfig.Dev("test").connect_db()
        mycursor.execute("select column_name from information_schema.columns where table_name='" +self.tables + "' limit 1")
        data = mycursor.fetchone()
        data = str(data).split(",")[0].replace("(", "").replace("'", "")
        mycursor.execute("select column_name from information_schema.columns where table_name='test_" +self.tables + "'limit 1")
        data1 = mycursor.fetchone()
        data1 = str(data1).split(",")[0].replace("(", "").replace("'", "")
        mycursor.execute("select * from " + schema_test[3]+".test_"+self.tables + " where " + data1 + " not in (select " + data + " from " + schema_prod[3] + "." +self.tables + ")")
        comp = mycursor.fetchall()
        mycursor.execute("select * from " + schema_prod[3]+"."+self.tables+ " where " + data + " not in (select " + data1 + " from "+ schema_test[3] + ".test_"+self.tables+")")
        comp1 = mycursor.fetchall()
        self.assertEqual(comp == [], True,msg=self.tables + " " + str(comp))
        self.assertEqual(comp1 == [], True,msg=self.tables + " " + str(comp1))

    def test_validations(self):
        mydb = connection.connect()
        mycursor = mydb.cursor()
        del sys.path[:]
        sys.path.append(os.path.join(os.path.dirname(os.path.dirname(__file__)), 'files', 'ddl', self.tables +'.sql'))
        for file_path in sys.path:
            mycursor.execute("desc "+self.tables)
            data = mycursor.fetchall()
            b = []
            for i in data:
                a = list(i)
                b.append((str(a[0]) + " " + str(a[1]).replace("b'","'")).upper().replace("'",""))
            with open(file_path, 'r') as datas:
                lines = datas.readlines()
                line1 = "".join(lines)
                line1 = re.sub(' +', ' ', line1)
                line1=line1.replace("\n", "").split(self.tables)[1].replace("NOT NULL", "").replace("PRIMARY KEY", "").strip("(").strip(" (").replace(");", "").split("FOREIGN KEY")[0].split(",")
                c = []
                for i in line1:
                    c.append(i.rstrip().lstrip())
                if ("" in c):
                    c.remove("")
            self.assertEqual((collections.Counter(b) == collections.Counter(c)),True,msg=self.tables +" "+str(set(c)-set(b)))

if __name__=='__main__':
    tables = gettables()
    unittest.main()
    # with open(r"C:\Users\umapriya.krishnan\Desktop\student_project\Student_project-kanth_feature\src\test\testing.txt", 'r+') as f:
    #     f.seek(0)
    #     f.truncate()
    #     runner = unittest.TextTestRunner(f)
    #     unittest.main(testRunner=runner)