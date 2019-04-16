truncate table revenue_report_native;
INSERT INTO revenue_report_native (entity,branch,trans_date,surgery,pharmacy,opticals,laboratory,consultation,others,ftd)
SELECT entity,`native`,transaction_date,
SUM( IF( unit='SURGERY', net_amount,0) ) AS surgery, 
SUM( IF( unit='PHARMACY', net_amount,0) ) AS pharmacy,  
SUM( IF( unit='OPTICALS', net_amount ,0) ) AS opticals, 
SUM( IF( unit='LABORATORY', net_amount,0 ) ) AS laboratory,
SUM( IF( unit='CONSULTATION', net_amount,0 ) ) AS consultation,
SUM( IF( unit NOT IN ('SURGERY','PHARMACY','OPTICALS','LABORATORY','CONSULTATION'), net_amount,0 ) ) AS others,
SUM(net_amount) AS ftd
FROM revenue_details_native
GROUP BY `native`,transaction_date ORDER BY `native`;