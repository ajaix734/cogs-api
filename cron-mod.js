const connections = require('./modules').connections
const cron = require('./modules').cron
const files = require('./modules').sqls

exports.schedule = cron.schedule('45 22 * * *', () => {
    connections.ideamed.getConnection((err, con) => {
        if (err) console.log('Connection Error.')
        con.query(files.cogsbackup, (ideaerr, ideares) => {
            if (ideaerr) console.error(ideaerr)
            console.log('Connected to Ideamed.')
            console.log('Inserting Records for Cogs table.Please Wait...')
            con.beginTransaction(err => {
                if (err) console.error(err)
                ideares.forEach(record => {
                    connections.scm_root.query('insert into cogs_details set ?', record, (error) => {
                        if (error) {
                            return con.rollback(function () {
                                console.error(error)
                            });
                        }
                        con.commit(function (err) {
                            if (err) {
                                return con.rollback(function () {
                                    console.error(err)
                                });
                            }
                        });
                    })
                })
                connections.scm_root.query(files.cogsreport, (errs) => {
                    if (errs) console.error(errs)
                    console.log('Finished loading Cogs.')
                    console.log('Generated Cogs Report table.')
                })
            })
        })
    })
    connections.ideamed.getConnection((err, con) => {
        if (err) console.log('Connection Error.')
        con.query(files.revenuebackup, (ideaerr, ideares) => {
            if (ideaerr) console.error(ideaerr)
            console.log('Connected to Ideamed.')
            console.log('Inserting Records for Revenue table.Please Wait...')
            con.beginTransaction(err => {
                if (err) console.error(err)
                ideares.forEach(record => {
                    connections.scm_root.query('insert into revenue_details set ?', record, (error) => {
                        if (error) {
                            return con.rollback(function () {
                                console.error(error)
                            });
                        }
                        con.commit(function (err) {
                            if (err) {
                                return con.rollback(function () {
                                    console.error(err)
                                });
                            }
                        });
                    })
                })
                connections.scm_root.query(files.revenuereport, (errs) => {
                    if (errs) console.error(errs)
                    connections.scm_root.query(files.breakupReport, (berrs) => {
                        if (berrs) console.error(berrs)
                        console.log('Finished loading Revenue & breakup.')
                        console.log('Generated Revenue & breakup Report table.')
                    })
                })
            })
        })
    })

    connections.ideamed.getConnection((err, con) => {
        if (err) console.log('Connection Error.')
        con.query(files.nativerevenuebackup, (ideaerr, ideares) => {
            if (ideaerr) console.error(ideaerr)
            console.log('Connected to Ideamed.')
            console.log('Inserting Records for Native Revenue table.Please Wait...')
            con.beginTransaction(err => {
                if (err) console.error(err)
                ideares.forEach(record => {
                    connections.scm_root.query('insert into revenue_details_native set ?', record, (error) => {
                        if (error) {
                            return con.rollback(function () {
                                console.error(error)
                            });
                        }
                        con.commit(function (err) {
                            if (err) {
                                return con.rollback(function () {
                                    console.error(err)
                                });
                            }
                        });
                    })
                })
                connections.scm_root.query(files.nativerevenuereport, (errs) => {
                    if (errs) console.error(errs)
                    connections.scm_root.query(files.nativebreakupReport, (berrs) => {
                        if (berrs) console.error(berrs)
                        console.log('Finished loading Native Revenue & Native breakup.')
                        console.log('Generated Native Revenue & Native breakup Report table.')
                    })
                })
            })
        })
    })

    connections.ideamed.getConnection((err, con) => {
        if (err) console.log('Connection Error.')
        con.query(files.vobbackup, (ideaerr, ideares) => {
            if (ideaerr) console.error(ideaerr)
            console.log('Connected to Ideamed.')
            console.log('Inserting Records for VOB table.Please Wait...')
            con.beginTransaction(err => {
                if (err) console.error(err)
                ideares.forEach(record => {
                    connections.scm_root.query('insert into vob set ?', record, (error) => {
                        if (error) {
                            return con.rollback(function () {
                                console.error(error)
                            });
                        }
                        con.commit(function (err) {
                            if (err) {
                                return con.rollback(function () {
                                    console.error(err)
                                });
                            }
                        });
                    })
                })
                connections.scm_root.query(files.vobreport, (errs) => {
                    if (errs) console.error(errs)
                    console.log('Finished loading VOB.')
                    console.log('Generated VOB Report table.')
                })
            })
        })
    })
})