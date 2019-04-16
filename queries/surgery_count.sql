SELECT BILLED, COUNT(*) AS `count`,transaction_date FROM revenue_details 
WHERE TRANSACTION_DATE BETWEEN ? AND ? AND ITEMNAME IN (SELECT servicename FROM surgery_mapping)
GROUP BY BILLED,transaction_date ORDER BY billed