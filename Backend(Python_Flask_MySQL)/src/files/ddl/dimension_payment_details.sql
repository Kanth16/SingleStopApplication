create table if not exists dimension_payment_details(FEE_ID VARCHAR(10) NOT NULL PRIMARY KEY,
                        FEES   BIGINT,
                        FEES_TYPE  VARCHAR(15),
                        ACTIVE_FLAG CHAR(1),
                        PAYMENT_START_DATE DATETIME,
                        PAYMENT_END_DATE   DATETIME);