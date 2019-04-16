truncate table cogs_report;
INSERT INTO cogs_report (entity,branch,trans_date,pharmacy,opticals,laboratory,operation_theatre,ftd)
SELECT entity,branch,trans_date,
SUM( IF( top='PHARMACY', actual_value,0) ) AS pharmacy,  
SUM( IF( top='OPTICALS', actual_value ,0) ) AS opticals, 
SUM( IF( top='LABORATORY', actual_value,0 ) ) AS laboratory,
SUM( IF( top='OPERATION THEATRE', actual_value,0 ) ) AS ot,
SUM( IF( top='PHARMACY', actual_value,0) )+SUM( IF( top='OPTICALS', actual_value ,0) )+SUM( IF( top='LABORATORY', actual_value,0 ) )+SUM( IF( top='OPERATION THEATRE', actual_value,0 ) ) AS ftd 
FROM cogs_details
GROUP BY branch,trans_date ORDER BY branch;