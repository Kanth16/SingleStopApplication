create table if not exists dimension_calender_details(TIME_ID VARCHAR(5) PRIMARY KEY,
                        HOLIDAY DATE,
                        ACTIVE_FLAG CHAR(1),
                        HOLIDAY_START_DATE DATETIME,
                        HOLIDAY_END_DATE  DATETIME);