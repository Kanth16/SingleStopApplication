import traceback
import sys,os.path
sys.path.append(os.path.join(os.path.dirname(os.path.dirname(__file__)),'main'))
import connection

class execution():
    def __init__(self):
        """Establish database connection"""
        self.mydb=connection.connect()
        self.mycursor=self.mydb.cursor()

    def executes(self, query):
        """SQL COMMAND EXECUTION"""
        try:
            self.mycursor.execute(query)
            if (query.split(" ")[0]=="CREATE" or query.split(" ")[0]=="INSERT" or query.split(" ")[0]=="DROP" or query.split(" ")[0]=="DELETE" or query.split(" ")[0]=="UPDATE" or query.split(" ")[0]=="ALTER"):
                self.mydb.commit()
                return self.mycursor
            else:
                return self.mycursor
        except Exception as e:
            return 0
