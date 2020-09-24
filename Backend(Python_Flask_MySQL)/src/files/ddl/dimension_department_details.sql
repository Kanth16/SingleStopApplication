create table if not exists dimension_department_details(DEP_ID VARCHAR(9) NOT NULL PRIMARY KEY,
                        DEP_NAME VARCHAR(50),
                        ACTIVE_FLAG CHAR(1),
                        DEP_START_DATE DATETIME,
                        DEP_END_DATE   DATETIME);