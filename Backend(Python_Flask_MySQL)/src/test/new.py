import unittest
from ut import *
#from src.Test import student_unittesting

tables="dimension_payment_details"
test_name = 'test_%s_creation' % tables
print(test_name)
test = test_creation(tables)
setattr(check_student, test_name, test)
test_name = 'test_%s_validation' % tables
print(test_name)
test2 = test_validations(tables)
setattr(check_student, test_name, test2)
test_name = 'test_%s_insertion' % tables
print(test_name)
test1 = test_insertion(tables)
setattr(check_student, test_name, test1)
#unittest.main()
with open(r"C:\Users\umapriya.krishnan\Desktop\student_project\Student_project-kanth_feature\src\main\templates\testing.html", 'r+') as f:
        f.seek(0)
        f.truncate()
        runner = unittest.TextTestRunner(f)
        unittest.main(testRunner=runner)
        #obj = student_unittesting.check_student()
#setattr(student_unittesting.check_student(),"table", "details_main")
#print(obj.table)
'''def gettable():
    tables="details_main"
    return tables'''
   # print(obj.table)
    #student_unittesting.check_student().tables=obj.table
    #obj1=student_unittesting.check_student()
#unittest.main(student_unittesting)
#suite = unittest.TestLoader().loadTestsFromModule(student_unittesting)
#unittest.TextTestRunner(verbosity=2).run(suite)
    