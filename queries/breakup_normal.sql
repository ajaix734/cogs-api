select entity,branch,trans_date,unit,`group`,`subgroup`,ftd from breakup_report where trans_date between ? and ? and branch in (?);