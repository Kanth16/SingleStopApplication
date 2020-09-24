create table if not exists dimension_course_details(COURSE_ID VARCHAR(9) NOT NULL PRIMARY KEY,
                        COURSE_NAME VARCHAR(20),
                        ACTIVE_FLAG CHAR(1),
                        COURSE_START_DATE DATETIME,
                        COURSE_END_DATE   DATETIME);