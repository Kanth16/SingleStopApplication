create table if not exists dimension_grade_details(GRADE_ID CHAR(2) NOT NULL PRIMARY KEY,
                        GRADE_DESCRIPTION    CHAR(20),
                        ACTIVE_FLAG CHAR(1),
                        GRADE_START_DATE DATETIME,
                        GRADE_END_DATE   DATETIME);