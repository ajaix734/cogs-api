truncate table revenue_report;
INSERT INTO revenue_report (entity,branch,trans_date,surgery,pharmacy,opticals,laboratory,consultation,others,ftd)
SELECT entity,`billed`,transaction_date,
SUM( IF( unit='SURGERY', net_amount,0) ) AS surgery, 
SUM( IF( unit='PHARMACY', net_amount,0) ) AS pharmacy,  
SUM( IF( unit='OPTICALS', net_amount ,0) ) AS opticals, 
SUM( IF( unit='LABORATORY', net_amount,0 ) ) AS laboratory,
SUM( IF( unit='CONSULTATION', net_amount,0 ) ) AS consultation,
SUM( IF( unit NOT IN ('SURGERY','PHARMACY','OPTICALS','LABORATORY','CONSULTATION'), net_amount,0 ) ) AS others,
SUM(net_amount) AS ftd
FROM revenue_details
GROUP BY `billed`,transaction_date ORDER BY `billed`;