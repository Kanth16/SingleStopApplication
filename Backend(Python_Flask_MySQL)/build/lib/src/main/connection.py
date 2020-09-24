import mysql.connector
import sys,os.path
sys.path.append(os.path.join(os.path.dirname(os.path.dirname(__file__)),'config'))
import devconfig


def connect():
    obj=devconfig.Dev("dev")
    host, user, pwd, db = obj.connect_db()
    mydb = mysql.connector.connect(host=host, user=user, password=pwd, database=db)
    #print(host, user, pwd, db)
    return mydb

connect()