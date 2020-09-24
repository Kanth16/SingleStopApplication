create table if not exists dimension_exam_details(EXAM_ID INT NOT NULL PRIMARY KEY,
                        EXAM_TYPE   VARCHAR(3),
                        EXAM_DESCRIPTION    VARCHAR(15),
                        ACTIVE_FLAG CHAR(1),
                        EXAM_START_DATE DATETIME,
                        EXAM_END_DATE   DATETIME);