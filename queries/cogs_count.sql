SELECT branch,COUNT(*) AS `count`,trans_date FROM cogs_details 
WHERE trans_date BETWEEN ? AND ? AND item_code IN (SELECT itemcode FROM surgery_mapping)
GROUP BY branch,trans_date ORDER BY branch