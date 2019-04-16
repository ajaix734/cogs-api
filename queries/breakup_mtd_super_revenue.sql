SELECT entity,branch,unit,`group`,subgroup,SUM(ftd) AS mtd FROM breakup_report_native
WHERE trans_date BETWEEN ? AND ? 
GROUP BY unit,`group`,subgroup,branch ORDER BY branch