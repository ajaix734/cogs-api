const connections = require('./modules').connections
const cron = require('./modules').cron
const files = require('./modules').sqls

exports.schedule = cron.schedule('04 12 * * *', async () => {
    console.log('connecting to Ideamed.')
    connections.ideamed.query(files.cogsbackup, (cogserr, cogsres) => {
        if (cogserr) console.error(cogserr)
        console.log('Inserting records for Cogs.Please wait.')
        cogsres.forEach(record => {
            connections.local.query('insert into cogs_details set ?', [record], (inserr) => {
                if (inserr) console.error(inserr)
            })
        })
        connections.local.query(files.cogsreport, (reperr) => {
            if (reperr) console.error(reperr)
            console.log('Finished loading Cogs.')
            console.log('Generated Cogs Report table.')
        })
    })
    connections.ideamed.query(files.revenuebackup, (reverr, revres) => {
        if (reverr) console.error(reverr)
        console.log('Inserting records for Revenue.Please wait.')
        revres.forEach(record => {
            connections.local.query('insert into revenue_details set ?', [record], (revinserr) => {
                if (revinserr) console.error(revinserr)
            })
        })
        connections.local.query(files.revenuereport, (revreperr) => {
            if (revreperr) console.error(revreperr)
            console.log('Finished loading Revenue.')
            console.log('Generated Revenue Report table.')
        })
    })
    connections.ideamed.query(files.vobbackup, (voberr, vobres) => {
        if (voberr) console.error(voberr)
        console.log('Inserting records for VOB.Please wait.')
        vobres.forEach(record => {
            connections.local.query('insert into vob set ?', [record], (vobinserr) => {
                if (vobinserr) console.error(vobinserr)
            })
        })
        connections.local.query(files.vobreport, (vobreperr) => {
            if (vobreperr) console.error(vobreperr)
            console.log('Finished loading VOB.')
            console.log('Generated VOB Report table.')
        })
    })
})
// exports.schedule = cron.schedule(' 02 12 * * *', () => {
//     main()
// })
// async function main() {
//     async function cogs() {
//         const ideamed = connections.ideamed.promise()
//         const local = connections.local.promise()
//         const [rows, cogsres] = await ideamed.query(files.cogsbackup)
//         cogsres.forEach(record => {
//             local.query('insert into cogs_details set ?', [record], (error) => {
//                 if (error) console.error(error)
//             })
//         })
//         return true
//     }
//     async function revenue() {
//         const ideamed = connections.ideamed.promise()
//         const local = connections.local.promise()
//         const [rows, cogsres] = await ideamed.query(files.revenuebackup)
//         cogsres.forEach(record => {
//             local.query('insert into revenue_details set ?', [record], (error) => {
//                 if (error) console.error(error)
//             })
//         })
//         return true
//     }
//     async function vob() {
//         const ideamed = connections.ideamed.promise()
//         const local = connections.local.promise()
//         const [rows, cogsres] = await ideamed.query(files.vobbackup)
//         cogsres.forEach(record => {
//             local.query('insert into vob set ?', [record], (error) => {
//                 if (error) console.error(error)
//             })
//         })
//         return true
//     }
//     async function cogsReport(done) {
//         const local = connections.local.promise()
//         local.query(files.cogsreport, (error, res) => {
//             if (error) console.error(error)
//             else {
//                 console.log('Generating Cogs Report Table.')
//             }
//         })
//     }
//     async function revenueReport(done) {
//         const local = connections.local.promise()
//         local.query(files.revenuereport, (error, res) => {
//             if (error) console.error(error)
//             else {
//                 console.log('Generating Revenue Report Table.')
//             }
//         })
//     }
//     async function vobReport(done) {
//         const local = connections.local.promise()
//         local.query(files.vobreport, (error, res) => {
//             if (error) console.error(error)
//             else {
//                 console.log('Generating VOB Report Table.')
//             }
//         })
//     }
//     console.log('Inserting records for COGS Table.Please wait.')
//     const cogsDone = await cogs()
//     console.log('Inserting records for REVENUE Table.Please wait.')
//     const revenueDone = await revenue()
//     console.log('Inserting records for VOB Table.Please wait.')
//     const vobDone = await vob()
//     await cogsReport(cogsDone)
//     await revenueReport(revenueDone)
//     await vobReport(vobDone)
// }