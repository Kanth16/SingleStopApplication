create table if not exists fact_payment(STUDENT_ID BIGINT NOT NULL,
                     FEE_ID    VARCHAR(10)   NOT NULL,
                     PAYMENT_ID VARCHAR(9),
                     ACTIVE_FLAG CHAR(1),
                     PAYMENT_FACT_START_DATE DATETIME,
                     PAYMENT_FACT_END_DATE   DATETIME,
					 FOREIGN KEY (STUDENT_ID) REFERENCES details_main (STUDENT_ID) ON DELETE CASCADE ON UPDATE CASCADE,
					 FOREIGN KEY(FEE_ID) REFERENCES dimension_payment_details(FEE_ID) ON DELETE CASCADE ON UPDATE CASCADE);