truncate table vob_report;
INSERT INTO vob_report (entity,billed,trans_date,surgery,pharmacy,opticals,laboratory,consultation,others,ftd)
SELECT entity,billed,trans_date,
SUM( IF( unit='SURGERY', net_amount,0) ) AS surgery, 
SUM( IF( unit='PHARMACY', net_amount,0) ) AS pharmacy,  
SUM( IF( unit='OPTICALS', net_amount ,0) ) AS opticals, 
SUM( IF( unit='LABORATORY', net_amount,0 ) ) AS laboratory,
SUM( IF( unit='CONSULTATION', net_amount,0 ) ) AS consultation,
SUM( IF( unit NOT IN ('SURGERY','PHARMACY','OPTICALS','LABORATORY','CONSULTATION'), net_amount,0 ) ) AS others,
SUM(net_amount) AS ftd
FROM vob
GROUP BY `billed`,trans_date ORDER BY `billed`;