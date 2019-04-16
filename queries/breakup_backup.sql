truncate table breakup_report;
INSERT INTO breakup_report (entity,branch,trans_date,unit,`group`,subgroup,ftd)
SELECT entity,billed,transaction_date,unit,`group`,subgroup,SUM(net_amount) AS ftd FROM revenue_details -- where transaction_date 
-- between '2018-04-01' and '2018-12-26' -- and billed = 'ylk'
-- and unit = 'OPTICALS'
GROUP BY `billed`,transaction_date,unit,`group`,subgroup ORDER BY `billed`;