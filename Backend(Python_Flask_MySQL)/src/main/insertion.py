import sys
import traceback
import os.path
sys.path.append(os.path.join(os.path.dirname(os.path.dirname(__file__)),'main'))
import execution
import logfile
import creation_ddl_update


class table_insertion:
    """"INSERTION OF VALUES INTO THE TABLES CREATED"""
    def __init__(self,table):
        """CLASS INITALIZATION"""
        self.obj2 = execution.execution()
        self.logs = logfile.logger()
        self.table=table
        #self.record_access()

    def record_access(self):
        """ACCESSING CSV RECORDS TO INSERT VALUES INTO THE TABLES"""
        try:
            del sys.path[:]
            sys.path.append(os.path.join(os.path.dirname(os.path.dirname(__file__)), 'files', 'records', self.table + '.csv'))
            for filepath in sys.path:
                self.record_insertion(self.table,filepath)
            return 0
        except Exception as e:
            self.logs.debug(repr(traceback.format_exception(*sys.exc_info())))
            return 1

    def record_insertion(self,table_name,file_path):
        """RECORD INSERTION INTO THE TABLES CREATED"""
        try:
            #print(file_path,table_name)
            with open(file_path, 'r') as read_file:
                data = read_file.readlines()
                for row in data:
                    print(row)
                    query = "INSERT INTO " + table_name + " VALUES " + "(" + row + ")"
                    print(query)
                    self.obj2.executes(query)
                self.logs.info(table_name + " Records Inserted")
                return 0
        except Exception as error:
            self.logs.debug(repr(traceback.format_exception(*sys.exc_info())))
            return 1

'''l_tables = creation_ddl_update.tables()
for table in l_tables:
    obj = table_insertion(table)
    t=obj.record_access()
'''