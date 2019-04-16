truncate table breakup_report_native;
INSERT INTO breakup_report_native (entity,branch,trans_date,unit,`group`,subgroup,ftd)
SELECT entity,`native`,transaction_date,unit,`group`,subgroup,SUM(net_amount) AS ftd FROM revenue_details_native -- where transaction_date 
-- between '2018-04-01' and '2018-12-26' -- and billed = 'ylk'
-- and unit = 'OPTICALS'
GROUP BY `native`,transaction_date,unit,`group`,subgroup ORDER BY `native`;