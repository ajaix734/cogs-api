const _ = require('./modules')._
const connections = require('./modules').connections
const files = require('./modules').sqls
const session = require('./modules').cookieSession

exports.adminMain = async (dbres, dbres2, branches, ftddate, vobres, breakupres, breakupmtdres) => {
    let entityWise = await filterEntity(dbres, dbres2, ftddate)
    let groupWise = await filterGroupwise(entityWise.aeharr, entityWise.ahcarr, dbres2, branches, ftddate, vobres, breakupres, breakupmtdres)
    return { alin: entityWise.alin, aeh: entityWise.aeh, ahc: entityWise.ahc, aehgroup: groupWise.aeh, ahcgroup: groupWise.ahc, branchwise: groupWise.branchwise }
}

exports.othersMain = async (cogs, revenue, individual, group, branches, ftddate, vobres, breakupres, breakupmtdres) => {
    let branchWise = [], seperatedBranchWise = [], groupWise = [], mtdpha = 0, mtdopt = 0, mtdot = 0, mtdlab = 0, mtdrev = 0, mtd = 0, tempObj = {}, tempcogsdata = null, temprevdata = null, branchname = null, ftdotcount = 0, mtdotcount = 0, cogsmtdotcount = 0
    let groupBranchArr = [], branchHeadings = [], ftdpha = 0, ftdopt = 0, ftdot = 0, ftdlab = 0, ftd = 0, ftdrev = 0, ftdpharev = 0, ftdoptrev = 0, ftdotrev = 0, ftdlabrev = 0, ftdconsultrev = 0, ftdotherrev = 0, ftdvobpha = 0, ftdvobcons = 0, ftdvoblab = 0, ftdvobopt = 0, ftdvobot = 0, ftdvobothers = 0, ftdvob = 0, cogsftdotcount = 0
    let shouldRemove = [], mappings = [], mtdpharev = 0, mtdoptrev = 0, mtdlabrev = 0, mtdotrev = 0, mtdconsultrev = 0, mtdothersrev = 0, mtdvob = 0, mtdvobpha = 0, mtdvobot = 0, mtdvobopt = 0, mtdvoblab = 0, mtdvobcons = 0, mtdvobothers = 0
    if (group.length !== 0) {
        group.forEach(element => {
            if (element.split('=')[1].length === 3) {
                groupBranchArr.push(element.split('=')[1])
                shouldRemove.push(element.split('=')[1])
            }
            else {
                groupBranchArr.push(element.split('=')[1].split('+'))
            }
            branchHeadings.push(element.split('=')[0])
        })
    }
    group.forEach(element => {
        let head = element.split('=')[0]
        let group = element.split('=')[1]
        let obj = {}
        obj["heading"] = head
        obj["branches"] = group
        mappings.push(obj)
    })
    groupBranchArr.forEach(group => {
        if (typeof (group) === 'string') {
            group = [group]
        }
        group.forEach(branch => {
            let tempFiltercogs = _.filter(cogs, { branch: branch, trans_date: ftddate })
            if (tempFiltercogs.length !== 0) {
                tempFiltercogs.forEach(element => {
                    ftdpha += element.pharmacy,
                        ftdopt += element.opticals,
                        ftdot += element.operation_theatre,
                        ftdlab += element.laboratory,
                        ftd += element.ftd
                })
            }
            else {
                ftdpha += 0,
                    ftdopt += 0,
                    ftdot += 0,
                    ftdlab += 0,
                    ftd += 0
            }
            let tempFilterrev = _.filter(revenue, { branch: branch, trans_date: ftddate })
            if (tempFilterrev.length !== 0) {
                tempFilterrev.forEach(element => {
                    ftdrev += element.ftd
                    // ftdpharev += element.pharmacy,
                    // ftdoptrev += element.opticals,
                    // ftdotrev += element.surgery,
                    // ftdlabrev += element.laboratory,
                    // ftdconsultrev += element.consultation,
                    // ftdotherrev += element.others
                })
            }
            else {
                ftdrev += 0
                // ftdpharev += 0,
                // ftdoptrev += 0,
                // ftdotrev += 0,
                // ftdlabrev += 0,
                // ftdconsultrev += 0,
                // ftdotherrev += 0
            }
            // let tempFiltervob = _.filter(vobres, { billed: branch, trans_date: ftddate })
            // if (tempFiltervob.length !== 0) {
            //     tempFiltervob.forEach(element => {
            //         ftdvob += element.ftd,
            //             ftdvobpha += element.pharmacy,
            //             ftdvobopt += element.opticals,
            //             ftdvobot += element.surgery,
            //             ftdvoblab += element.laboratory,
            //             ftdvobcons += element.consultation,
            //             ftdvobothers += element.others,
            //             tempObj.ftd_vob_percent = cogsPercent(tempObj.ftd, tempObj.ftdvob)
            //     })
            // }
            // else {
            //     ftdvob = 0,
            //         ftdvobpha = 0,
            //         ftdvobopt = 0,
            //         ftdvobot = 0,
            //         ftdvoblab = 0,
            //         ftdvobcons = 0,
            //         ftdvobothers = 0,
            //         tempObj.ftd_vob_percent = 0
            // }

            // let tempFiltersurgres = _.filter(surgres, { BILLED: branch, transaction_date: ftddate })
            // if (tempFiltersurgres.length !== 0) {
            //     tempFiltersurgres.forEach(element => {
            //         ftdotcount += element.count
            //     })
            // }
            // else {
            //     ftdotcount = 0
            // }
            // let tempFiltercogsCount = _.filter(countres, { branch: branch, trans_date: ftddate })
            // if (tempFiltercogsCount.length !== 0) {
            //     tempFiltercogsCount.forEach(element => {
            //         cogsftdotcount += element.count
            //     })
            // }
            // else {
            //     cogsftdotcount = 0
            // }
            tempObj.branch = branch
            tempObj.ftdpha = ftdpha,
                tempObj.ftdopt = ftdopt,
                tempObj.ftdlab = ftdlab,
                tempObj.ftdot = ftdot,
                tempObj.ftd = ftd,
                tempObj.ftdrev = ftdrev,
                tempObj.ftd_cogs_percent = cogsPercent(ftd, ftdrev)
            // tempObj.ftdpharev = ftdpharev,
            // tempObj.ftdotrev = ftdotrev,
            // tempObj.ftdoptrev = ftdoptrev,
            // tempObj.ftdlabrev = ftdlabrev,
            // tempObj.ftdconsultrev = ftdconsultrev,
            // tempObj.ftdotherrev = ftdotherrev,
            // tempObj.ftdvob = ftdvob,
            // tempObj.ftdvobpha = ftdvobpha,
            // tempObj.ftdvobopt = ftdvobopt,
            // tempObj.ftdvobot = ftdvobot,
            // tempObj.ftdvoblab = ftdvoblab,
            // tempObj.ftdvobcons = ftdvobcons,
            // tempObj.ftdvobothers = ftdvobothers,
            // tempObj.ftdotcount = ftdotcount,
            // tempObj.cogsftdotcount = cogsftdotcount
            _.filter(cogs, { branch: branch }).forEach(element => {
                mtdpha += element.pharmacy,
                    mtdopt += element.opticals,
                    mtdot += element.operation_theatre,
                    mtdlab += element.laboratory,
                    mtd += element.ftd
            })

            _.filter(revenue, { branch: branch }).forEach(element => {
                mtdrev += element.ftd
                // mtdpharev += element.pharmacy,
                // mtdoptrev += element.opticals,
                // mtdotrev += element.surgery,
                // mtdlabrev += element.laboratory,
                // mtdconsultrev += element.consultation,
                // mtdothersrev += element.others
            })
            // _.filter(vobres, { billed: branch }).forEach(element => {
            //     mtdvob += element.ftd,
            //         mtdvobpha += element.pharmacy,
            //         mtdvobopt += element.opticals,
            //         mtdvobot += element.surgery,
            //         mtdvoblab += element.laboratory,
            //         mtdvobcons += element.consultation,
            //         mtdvobothers += element.others
            // })
            // _.filter(surgres, { BILLED: branch }).forEach(element => {
            //     mtdotcount += element.count
            // })
            // _.filter(countres, { branch: branch }).forEach(element => {
            //     cogsmtdotcount += element.count
            // })
            tempObj.mtdpha = mtdpha,
                tempObj.mtdopt = mtdopt,
                tempObj.mtdot = mtdot,
                tempObj.mtdlab = mtdlab,
                tempObj.mtd = mtd,
                tempObj.mtdrev = mtdrev,
                // tempObj.mtdpharev = mtdpharev,
                // tempObj.mtdoptrev = mtdoptrev,
                // tempObj.mtdlabrev = mtdlabrev,
                // tempObj.mtdotrev = mtdotrev,
                // tempObj.mtdothersrev = mtdothersrev,
                // tempObj.mtdconsultrev = mtdconsultrev,
                tempObj.mtd_cogs_percent = cogsPercent(mtd, mtdrev)
            // tempObj.mtdvob = mtdvob,
            // tempObj.mtdvobpha = mtdvobpha,
            // tempObj.mtdvobopt = mtdvobopt,
            // tempObj.mtdvoblab = mtdvoblab,
            // tempObj.mtdvobot = mtdvobot,
            // tempObj.mtdvobothers = mtdvobothers,
            // tempObj.mtdvobcons = mtdvobcons,
            // tempObj.mtd_vob_percent = cogsPercent(mtd, mtdvob),
            // tempObj.mtdotcount = mtdotcount,
            // tempObj.cogsmtdotcount = cogsmtdotcount
        })
        groupWise.push(tempObj)
        tempObj = {}, mtdpha = 0, mtdopt = 0, mtdot = 0, mtdlab = 0, mtd = 0, mtdrev = 0, mtdpharev = 0, mtdoptrev = 0, mtdotrev = 0, mtdlabrev = 0, mtdconsultrev = 0, mtdothersrev = 0, mtdvob = 0, mtdvobpha = 0, mtdvobot = 0, mtdvobopt = 0, mtdvoblab = 0, mtdvobcons = 0, mtdvobothers = 0, mtdotcount = 0, cogsmtdotcount = 0, ftdpha = 0, ftdopt = 0, ftdot = 0, ftdlab = 0, ftd = 0, ftdrev = 0, ftdpharev = 0, ftdoptrev = 0, ftdotrev = 0, ftdlabrev = 0, ftdconsultrev = 0, ftdotherrev = 0, ftdvobpha = 0, ftdvobcons = 0, ftdvoblab = 0, ftdvobopt = 0, ftdvobot = 0, ftdvobothers = 0, ftdvob = 0, ftdotcount = 0, cogsftdotcount = 0
    })

    for (let i = 0; i < branchHeadings.length; i++) {
        groupWise[i].branch = branchHeadings[i]
    }

    individual.forEach(branch => {
        _.filter(branches, { code: branch }).forEach(ele => branchname = ele.branch)
        if (!shouldRemove.includes(branch)) {
            let tempFiltercogs = _.filter(cogs, { branch: branch, trans_date: ftddate })
            if (tempFiltercogs.length !== 0) {
                tempFiltercogs.forEach(element => {
                    tempObj.branch = branchname,
                        tempObj.code = branch,
                        tempObj.ftdpha = element.pharmacy,
                        tempObj.ftdopt = element.opticals,
                        tempObj.ftdot = element.operation_theatre,
                        tempObj.ftdlab = element.laboratory,
                        tempObj.ftd = element.ftd
                })
            }
            else {
                tempObj.branch = branchname,
                    tempObj.code = branch,
                    tempObj.ftdpha = 0,
                    tempObj.ftdopt = 0,
                    tempObj.ftdot = 0,
                    tempObj.ftdlab = 0,
                    tempObj.ftd = 0
            }
            let tempFileterev = _.filter(revenue, { branch: branch, trans_date: ftddate })
            if (tempFileterev.length !== 0) {
                tempFileterev.forEach(element => {
                    tempObj.ftdrev = element.ftd,
                        tempObj['ftdpharev'] = element.pharmacy,
                        tempObj['ftdoptrev'] = element.opticals,
                        tempObj['ftdotrev'] = element.surgery,
                        tempObj['ftdlabrev'] = element.laboratory,
                        tempObj['ftdconsultrev'] = element.consultation,
                        tempObj['ftdotherrev'] = element.others,
                        tempObj.ftd_cogs_percent = cogsPercent(tempObj.ftd, tempObj.ftdrev)
                })
            }
            else {
                tempObj.ftdrev = 0,
                    tempObj['ftdpharev'] = 0,
                    tempObj['ftdoptrev'] = 0,
                    tempObj['ftdotrev'] = 0,
                    tempObj['ftdlabrev'] = 0,
                    tempObj['ftdconsultrev'] = 0,
                    tempObj['ftdotherrev'] = 0,
                    tempObj.ftd_cogs_percent = 0
            }

            let tempFiltervob = _.filter(vobres, { billed: branch, trans_date: ftddate })
            if (tempFiltervob.length !== 0) {
                tempFiltervob.forEach(element => {
                    tempObj.ftdvob = element.ftd,
                        tempObj['ftdvobpha'] = element.pharmacy,
                        tempObj['ftdvobopt'] = element.opticals,
                        tempObj['ftdvobot'] = element.surgery,
                        tempObj['ftdvoblab'] = element.laboratory,
                        tempObj['ftdvobcons'] = element.consultation,
                        tempObj['ftdvobothers'] = element.others,
                        tempObj.ftd_vob_percent = cogsPercent(tempObj.ftd, tempObj.ftdvob)
                })
            }
            else {
                tempObj.ftdvob = 0,
                    tempObj['ftdvobpha'] = 0,
                    tempObj['ftdvobopt'] = 0,
                    tempObj['ftdvobot'] = 0,
                    tempObj['ftdvoblab'] = 0,
                    tempObj['ftdvobcons'] = 0,
                    tempObj['ftdvobothers'] = 0,
                    tempObj.ftd_vob_percent = 0
            }

            // let tempFiltersurgres = _.filter(surgres, { BILLED: branch, transaction_date: ftddate })
            // if (tempFiltersurgres.length !== 0) {
            //     tempFiltersurgres.forEach(element => {
            //         tempObj['ftdotcount'] = element.count
            //     })
            // }
            // else {
            //     tempObj.ftdotcount = 0
            // }
            // let tempFiltercogsCount = _.filter(countres, { branch: branch, trans_date: ftddate })
            // if (tempFiltercogsCount.length !== 0) {
            //     tempFiltercogsCount.forEach(element => {
            //         tempObj['cogsftdotcount'] = element.count
            //     })
            // }
            // else {
            //     tempObj.cogsftdotcount = 0
            // }

            let tempftdbreakup = _.filter(breakupres, { branch: branch, trans_date: ftddate })
            if (tempftdbreakup.length !== 0) {
                tempObj['ftdbreakup'] = tempftdbreakup
            }
            else {
                tempObj['ftdbreakup'] = 0
            }
            let tempmtdbreakup = _.filter(breakupmtdres, { branch: branch })
            if (tempmtdbreakup.length !== 0) {
                tempObj['mtdbreakup'] = tempmtdbreakup
            }
            else {
                tempObj['mtdbreakup'] = 0
            }

            _.filter(cogs, { branch: branch }).forEach(element => {
                mtdpha += element.pharmacy,
                    mtdopt += element.opticals,
                    mtdot += element.operation_theatre,
                    mtdlab += element.laboratory,
                    mtd += element.ftd
            })

            _.filter(revenue, { branch: branch }).forEach(element => {
                mtdrev += element.ftd,
                    mtdpharev += element.pharmacy,
                    mtdoptrev += element.opticals,
                    mtdotrev += element.surgery,
                    mtdlabrev += element.laboratory,
                    mtdconsultrev += element.consultation,
                    mtdothersrev += element.others
            })
            _.filter(vobres, { billed: branch }).forEach(element => {
                mtdvob += element.ftd,
                    mtdvobpha += element.pharmacy,
                    mtdvobopt += element.opticals,
                    mtdvobot += element.surgery,
                    mtdvoblab += element.laboratory,
                    mtdvobcons += element.consultation,
                    mtdvobothers += element.others
            })
            // _.filter(surgres, { BILLED: branch }).forEach(element => {
            //     mtdotcount += element.count
            // })
            // _.filter(countres, { branch: branch }).forEach(element => {
            //     cogsmtdotcount += element.count
            // })
            tempObj.mtdpha = mtdpha,
                tempObj.mtdopt = mtdopt,
                tempObj.mtdot = mtdot,
                tempObj.mtdlab = mtdlab,
                tempObj.mtd = mtd,
                tempObj.mtdrev = mtdrev,
                tempObj.mtdpharev = mtdpharev,
                tempObj.mtdoptrev = mtdoptrev,
                tempObj.mtdlabrev = mtdlabrev,
                tempObj.mtdotrev = mtdotrev,
                tempObj.mtdothersrev = mtdothersrev,
                tempObj.mtdconsultrev = mtdconsultrev,
                tempObj.mtd_cogs_percent = cogsPercent(mtd, mtdrev),
                tempObj.mtdvob = mtdvob,
                tempObj.mtdvobpha = mtdvobpha,
                tempObj.mtdvobopt = mtdvobopt,
                tempObj.mtdvoblab = mtdvoblab,
                tempObj.mtdvobot = mtdvobot,
                tempObj.mtdvobothers = mtdvobothers,
                tempObj.mtdvobcons = mtdvobcons,
                tempObj.mtd_vob_percent = cogsPercent(mtd, mtdvob),
                // tempObj.mtdotcount = mtdotcount,
                // tempObj.cogsmtdotcount = cogsmtdotcount
                branchWise.push(tempObj)
            tempObj = {}, mtdpha = 0, mtdopt = 0, mtdot = 0, mtdlab = 0, mtd = 0, mtdrev = 0, mtdpharev = 0, mtdoptrev = 0, mtdotrev = 0, mtdlabrev = 0, mtdconsultrev = 0, mtdothersrev = 0, mtdvob = 0, mtdvobpha = 0, mtdvobot = 0, mtdvobopt = 0, mtdvoblab = 0, mtdvobcons = 0, mtdvobothers = 0, mtdotcount = 0, cogsmtdotcount = 0

        }
        else {
            let tempFiltercogs = _.filter(cogs, { branch: branch, trans_date: ftddate })
            if (tempFiltercogs.length !== 0) {
                tempFiltercogs.forEach(element => {
                    tempObj.branch = branchname,
                        tempObj.code = branch,
                        tempObj.ftdpha = element.pharmacy,
                        tempObj.ftdopt = element.opticals,
                        tempObj.ftdot = element.operation_theatre,
                        tempObj.ftdlab = element.laboratory,
                        tempObj.ftd = element.ftd
                })
            }
            else {
                tempObj.branch = branchname,
                    tempObj.code = branch,
                    tempObj.ftdpha = 0,
                    tempObj.ftdopt = 0,
                    tempObj.ftdot = 0,
                    tempObj.ftdlab = 0,
                    tempObj.ftd = 0
            }
            let tempFileterev = _.filter(revenue, { branch: branch, trans_date: ftddate })
            if (tempFileterev.length !== 0) {
                tempFileterev.forEach(element => {
                    tempObj.ftdrev = element.ftd,
                        tempObj['ftdpharev'] = element.pharmacy,
                        tempObj['ftdoptrev'] = element.opticals,
                        tempObj['ftdotrev'] = element.surgery,
                        tempObj['ftdlabrev'] = element.laboratory,
                        tempObj['ftdconsultrev'] = element.consultation,
                        tempObj['ftdotherrev'] = element.others,
                        tempObj.ftd_cogs_percent = cogsPercent(tempObj.ftd, tempObj.ftdrev)
                })
            }
            else {
                tempObj.ftdrev = 0,
                    tempObj['ftdpharev'] = 0,
                    tempObj['ftdoptrev'] = 0,
                    tempObj['ftdotrev'] = 0,
                    tempObj['ftdlabrev'] = 0,
                    tempObj['ftdconsultrev'] = 0,
                    tempObj['ftdotherrev'] = 0,
                    tempObj.ftd_cogs_percent = 0
            }

            let tempFiltervob = _.filter(vobres, { billed: branch, trans_date: ftddate })
            if (tempFiltervob.length !== 0) {
                tempFiltervob.forEach(element => {
                    tempObj.ftdvob = element.ftd,
                        tempObj['ftdvobpha'] = element.pharmacy,
                        tempObj['ftdvobopt'] = element.opticals,
                        tempObj['ftdvobot'] = element.surgery,
                        tempObj['ftdvoblab'] = element.laboratory,
                        tempObj['ftdvobcons'] = element.consultation,
                        tempObj['ftdvobothers'] = element.others,
                        tempObj.ftd_vob_percent = cogsPercent(tempObj.ftd, tempObj.ftdvob)
                })
            }
            else {
                tempObj.ftdvob = 0,
                    tempObj['ftdvobpha'] = 0,
                    tempObj['ftdvobopt'] = 0,
                    tempObj['ftdvobot'] = 0,
                    tempObj['ftdvoblab'] = 0,
                    tempObj['ftdvobcons'] = 0,
                    tempObj['ftdvobothers'] = 0,
                    tempObj.ftd_vob_percent = 0
            }

            // let tempFiltersurgres = _.filter(surgres, { BILLED: branch, transaction_date: ftddate })
            // if (tempFiltersurgres.length !== 0) {
            //     tempFiltersurgres.forEach(element => {
            //         tempObj['ftdotcount'] = element.count
            //     })
            // }
            // else {
            //     tempObj.ftdotcount = 0
            // }
            // let tempFiltercogsCount = _.filter(countres, { branch: branch, trans_date: ftddate })
            // if (tempFiltercogsCount.length !== 0) {
            //     tempFiltercogsCount.forEach(element => {
            //         tempObj['cogsftdotcount'] = element.count
            //     })
            // }
            // else {
            //     tempObj.cogsftdotcount = 0
            // }
            let tempFilterbreakupftd = _.filter(breakupres, { branch: branch, trans_date: ftddate })
            if (tempFilterbreakupftd.length !== 0) {
                tempObj['ftdbreakup'] = tempFilterbreakupftd
            }
            else {
                tempObj['ftdbreakup'] = 0
            }
            let tempFilterbreakupmtd = _.filter(breakupmtdres, { branch: branch })
            if (tempFilterbreakupmtd.length !== 0) {
                tempObj['mtdbreakup'] = tempFilterbreakupmtd
            }
            else {
                tempObj['mtdbreakup'] = 0
            }
            _.filter(cogs, { branch: branch }).forEach(element => {
                mtdpha += element.pharmacy,
                    mtdopt += element.opticals,
                    mtdot += element.operation_theatre,
                    mtdlab += element.laboratory,
                    mtd += element.ftd
            })

            _.filter(revenue, { branch: branch }).forEach(element => {
                mtdrev += element.ftd,
                    mtdpharev += element.pharmacy,
                    mtdoptrev += element.opticals,
                    mtdotrev += element.surgery,
                    mtdlabrev += element.laboratory,
                    mtdconsultrev += element.consultation,
                    mtdothersrev += element.others
            })
            _.filter(vobres, { billed: branch }).forEach(element => {
                mtdvob += element.ftd,
                    mtdvobpha += element.pharmacy,
                    mtdvobopt += element.opticals,
                    mtdvobot += element.surgery,
                    mtdvoblab += element.laboratory,
                    mtdvobcons += element.consultation,
                    mtdvobothers += element.others
            })
            // _.filter(surgres, { BILLED: branch }).forEach(element => {
            //     mtdotcount += element.count
            // })
            // _.filter(countres, { branch: branch }).forEach(element => {
            //     cogsmtdotcount += element.count
            // })
            tempObj.mtdpha = mtdpha,
                tempObj.mtdopt = mtdopt,
                tempObj.mtdot = mtdot,
                tempObj.mtdlab = mtdlab,
                tempObj.mtd = mtd,
                tempObj.mtdrev = mtdrev,
                tempObj.mtdpharev = mtdpharev,
                tempObj.mtdoptrev = mtdoptrev,
                tempObj.mtdlabrev = mtdlabrev,
                tempObj.mtdotrev = mtdotrev,
                tempObj.mtdothersrev = mtdothersrev,
                tempObj.mtdconsultrev = mtdconsultrev,
                tempObj.mtd_cogs_percent = cogsPercent(mtd, mtdrev),
                tempObj.mtdvob = mtdvob,
                tempObj.mtdvobpha = mtdvobpha,
                tempObj.mtdvobopt = mtdvobopt,
                tempObj.mtdvoblab = mtdvoblab,
                tempObj.mtdvobot = mtdvobot,
                tempObj.mtdvobothers = mtdvobothers,
                tempObj.mtdvobcons = mtdvobcons,
                tempObj.mtd_vob_percent = cogsPercent(mtd, mtdvob),
                // tempObj.mtdotcount = mtdotcount,
                // tempObj.cogsmtdotcount = cogsmtdotcount
                seperatedBranchWise.push(tempObj)
            tempObj = {}, mtdpha = 0, mtdopt = 0, mtdot = 0, mtdlab = 0, mtd = 0, mtdrev = 0, mtdpharev = 0, mtdoptrev = 0, mtdotrev = 0, mtdlabrev = 0, mtdconsultrev = 0, mtdothersrev = 0, mtdvob = 0, mtdvobpha = 0, mtdvobot = 0, mtdvobopt = 0, mtdvoblab = 0, mtdvobcons = 0, mtdvobothers = 0, mtdotcount = 0, cogsmtdotcount = 0

        }
    })
    return { group: groupWise, branch: branchWise, mappings: mappings, specialBranch: _.uniqBy(seperatedBranchWise, 'code') }
}

let filterEntity = async (dbres, dbres2, ftddate) => {
    let tempObj = {}, pha = 0, opt = 0, lab = 0, ot = 0, total = 0, rev = 0, aeharr = [], aehrevarr = [], ahcrevarr = [], ahcarr = [], alin = {}
    aeharr = _.filter(dbres, { entity: 'AEH' })
    _.filter(aeharr, { trans_date: ftddate }).forEach(element => {
        pha += element.pharmacy;
        opt += element.opticals;
        lab += element.laboratory;
        ot += element.operation_theatre;
        total += element.ftd
    })
    aehrevarr = _.filter(dbres2, { entity: 'AEH' })
    _.filter(aehrevarr, { trans_date: ftddate }).forEach(element => {
        rev += element.ftd
    })
    tempObj.AEH = { branch: 'AEH', ftdpha: pha, ftdopt: opt, ftdlab: lab, ftdot: ot, ftd: total, ftdrev: rev, ftd_cogs_percent: cogsPercent(total, rev) }
    pha = 0, opt = 0, lab = 0, ot = 0, total = 0, rev = 0
    aeharr.forEach(element => {
        pha += element.pharmacy;
        opt += element.opticals;
        lab += element.laboratory;
        ot += element.operation_theatre;
        total += element.ftd
    })
    aehrevarr.forEach(element => {
        rev += element.ftd
    })
    tempObj.AEH.mtdpha = pha, tempObj.AEH.mtdopt = opt, tempObj.AEH.mtdlab = lab, tempObj.AEH.mtdot = ot, tempObj.AEH.mtd = total, tempObj.AEH.mtdrev = rev, tempObj.AEH.mtd_cogs_percent = cogsPercent(total, rev)
    pha = 0, opt = 0, lab = 0, ot = 0, total = 0, rev = 0
    ahcarr = _.filter(dbres, { entity: 'AHC' })
    _.filter(ahcarr, { trans_date: ftddate }).forEach(element => {
        pha += element.pharmacy;
        opt += element.opticals;
        lab += element.laboratory;
        ot += element.operation_theatre;
        total += element.ftd
    })
    ahcrevarr = _.filter(dbres2, { entity: 'AHC' })
    _.filter(ahcrevarr, { trans_date: ftddate }).forEach(element => {
        rev += element.ftd
    })
    tempObj.AHC = {
        branch: 'AHC', ftdpha: pha, ftdopt: opt, ftdlab: lab, ftdot: ot, ftd: total, ftdrev: rev, ftd_cogs_percent: cogsPercent(total, rev)
    }
    pha = 0, opt = 0, lab = 0, ot = 0, total = 0, rev = 0
    ahcarr.forEach(element => {
        pha += element.pharmacy;
        opt += element.opticals;
        lab += element.laboratory;
        ot += element.operation_theatre;
        total += element.ftd
    })
    ahcrevarr.forEach(element => {
        rev += element.ftd
    })
    tempObj.AHC.mtdpha = pha, tempObj.AHC.mtdopt = opt, tempObj.AHC.mtdlab = lab, tempObj.AHC.mtdot = ot, tempObj.AHC.mtd = total, tempObj.AHC.mtdrev = rev, tempObj.AHC.mtd_cogs_percent = cogsPercent(total, rev)
    for (let key in tempObj.AEH) {
        alin[key] = tempObj.AEH[key]
    }
    for (let key in tempObj.AHC) {
        if (key === 'ftd_cogs_percent') {
            alin[key] = cogsPercent(alin.ftd, alin.ftdrev)
        } else if (key === 'mtd_cogs_percent') {
            alin[key] = cogsPercent(alin.mtd, alin.mtdrev)
        }
        else {
            alin['branch'] = 'All India'
            alin[key] += tempObj.AHC[key]
        }
    }

    return { 'alin': alin, 'aeharr': aeharr, 'ahcarr': ahcarr, 'aeh': tempObj.AEH, 'ahc': tempObj.AHC }
}

let filterGroupwise = async (aeh, ahc, dbres2, branches, ftddate, vobres, breakupres, breakupmtdres) => {
    let ftdpha = 0, ftdopt = 0, ftdlab = 0, ftdot = 0, ftd = 0, mtdpha = 0, mtdopt = 0, mtdlab = 0, mtdot = 0, mtd = 0, aehtempObj = {}, ahctempObj = {}, branchObj = {}, ftdrev = 0, mtdrev = 0, branchName = null, ftdpharev = 0, ftdoptrev = 0, ftdotrev = 0, ftdlabrev = 0, ftdconsultrev = 0, ftdothersrev = 0, mtdpharev = 0, mtdoptrev = 0, mtdotrev = 0, mtdlabrev = 0, mtdconsultrev = 0, mtdothersrev = 0, code = null, ftdotcount = 0, mtdotcount = 0, cogsftdotcount = 0, cogsmtdotcount = 0, aehftdbreakup = 0, aehmtdbreakup = 0, ahcftdbreakup = 0, ahcmtdbreakup = 0
    let aehGroups = ['Chennai Main Hospital', 'Chennai Branches', 'Kanchi + Vellore', 'Kum + Ney + Vil', 'Dha + Salem + Krish', 'Erode + Hosur', 'Jaipur', 'Madurai KK Nagar']
    let ahcGroups = ['Chennai branches', 'Tirunelveli', 'Tuticorin + Madurai', 'Trichy', 'Thanjavur', 'Tiruppur', 'Andaman', 'Karnataka', 'Banglore', 'Hubli + Mysore', 'Telangana', 'Hyderabad', 'Andhra Pradesh', 'Rest of India(incl. Jaipur)', 'Trivandrum', 'Kolkata', 'Pune', 'Ahmedabad', 'Indore', 'Odisha']
    let aehgroupedBranches = {
        'Chennai Main Hospital': ["CMH"],
        'Chennai Branches': ["ANN", "ASN", "AVD", "NLR", "PMB", "PRR", "TLR", "TRC", "VLC"],
        'Kanchi + Vellore': ["KNP", "VLR"],
        'Kum + Ney + Vil': ["KBK", "NVL", "VPM"],
        'Dha + Salem + Krish': ["DHA", "SLM", "KSN"],
        'Erode + Hosur': ["ERD", "HSR"],
        'Jaipur': ["JPR"],
        'Madurai KK Nagar': ["MDU"]
    }
    let ahcgroupedBranches = {
        'Chennai branches': ["TBM", "ADY", "EGM", "MGP", "NWP", "PDY"],
        'Tirunelveli': ["TVL"],
        'Tuticorin + Madurai': ["TCN", "APM"],
        'Trichy': ["TRI"],
        'Thanjavur': ["TNJ"],
        'Tiruppur': ['TPR'],
        'Andaman': ["AMN"],
        'Karnataka': ["BMH", "WFD", "KML", "CLR", "INR", "PNR", "YLK", "HUB", "MCC", "MYS"],
        'Banglore': ["BMH", "WFD", "KML", "CLR", "INR", "PNR", "YLK"],
        'Hubli + Mysore': ["HUB", "MCC", "MYS"],
        'Telangana': ["DNR", "HMH", "MDA", "SNR", "HIM", "SBD"],
        'Hyderabad': ["DNR", "HMH", "MDA", "SNR", "HIM", "SBD"],
        'Andhra Pradesh': ["VMH", "NEL", "GUN", "TPT", "RAJ"],
        'Rest of India(incl. Jaipur)': ["TVM", "KOL", "KAS", "PUN", "AHM", "IND", "CTK", "BHU", "JPR"],
        'Trivandrum': ["TVM"],
        'Kolkata': ["KOL", "KAS"],
        'Pune': ["PUN"],
        'Ahmedabad': ["AHM"],
        'Indore': ["IND"],
        'Odisha': ["CTK", "BHU"]
    }
    let ftdvobot = 0, ftdvobopt = 0, ftdvobpha = 0, ftdvoblab = 0, ftdvobcons = 0, ftdvobothers = 0, ftdvob = 0, mtdvobot = 0, mtdvobopt = 0, mtdvoblab = 0, mtdvobpha = 0, mtdvobcons = 0, mtdvobothers = 0, mtdvob = 0
    aehGroups.forEach(group => {
        aehtempObj[group] = {}
        aehgroupedBranches[group].forEach(branch => {
            _.filter(aeh, { branch: branch, trans_date: ftddate }).forEach(element => {
                ftdpha += element.pharmacy;
                ftdopt += element.opticals;
                ftdlab += element.laboratory;
                ftdot += element.operation_theatre;
                ftd += element.ftd
            })
            aehtempObj[group].ftdpha = ftdpha, aehtempObj[group].ftdopt = ftdopt, aehtempObj[group].ftdlab = ftdlab, aehtempObj[group].ftdot = ftdot, aehtempObj[group].ftd = ftd
            _.filter(aeh, { branch: branch }).forEach(element => {
                mtdpha += element.pharmacy;
                mtdopt += element.opticals;
                mtdlab += element.laboratory;
                mtdot += element.operation_theatre;
                mtd += element.ftd
            })
            aehtempObj[group].mtdpha = mtdpha, aehtempObj[group].mtdopt = mtdopt, aehtempObj[group].mtdlab = mtdlab, aehtempObj[group].mtdot = mtdot, aehtempObj[group].mtd = mtd
            _.filter(dbres2, { branch: branch, trans_date: ftddate }).forEach(element => {
                ftdrev += element.ftd
            })
            aehtempObj[group].ftdrev = ftdrev, aehtempObj[group].ftd_cogs_percent = cogsPercent(ftd, ftdrev)
            _.filter(dbres2, { branch: branch }).forEach(element => {
                mtdrev += element.ftd
            })
            aehtempObj[group].mtdrev = mtdrev, aehtempObj[group].mtd_cogs_percent = cogsPercent(mtd, mtdrev), aehtempObj[group].branch = group
        })
        ftdpha = 0, ftdopt = 0, ftdlab = 0, ftdot = 0, ftd = 0, mtdpha = 0, mtdopt = 0, mtdlab = 0, mtdot = 0, mtd = 0, ftdrev = 0, mtdrev = 0
    })
    for (let key in aehgroupedBranches) {
        branchObj[key] = []
        aehgroupedBranches[key].forEach(branch => {
            _.filter(branches, { code: branch }).forEach(element => { branchName = element.branch, code = element.code })
            _.filter(aeh, { branch: branch, trans_date: ftddate }).forEach(element => {
                ftdpha = element.pharmacy;
                ftdopt = element.opticals;
                ftdlab = element.laboratory;
                ftdot = element.operation_theatre;
                ftd = element.ftd
            })
            _.filter(aeh, { branch: branch }).forEach(element => {
                mtdpha += element.pharmacy;
                mtdopt += element.opticals;
                mtdlab += element.laboratory;
                mtdot += element.operation_theatre;
                mtd += element.ftd
            })
            _.filter(dbres2, { branch: branch, trans_date: ftddate }).forEach(element => {
                ftdrev = element.ftd,
                    ftdpharev = element.pharmacy,
                    ftdoptrev = element.opticals,
                    ftdotrev = element.surgery,
                    ftdlabrev = element.laboratory,
                    ftdconsultrev = element.consultation,
                    ftdothersrev = element.others
            })
            _.filter(dbres2, { branch: branch }).forEach(element => {
                mtdrev += element.ftd,
                    mtdpharev += element.pharmacy,
                    mtdoptrev += element.opticals,
                    mtdotrev += element.surgery,
                    mtdlabrev += element.laboratory,
                    mtdconsultrev += element.consultation,
                    mtdothersrev += element.others
            })
            _.filter(vobres, { billed: branch, trans_date: ftddate }).forEach(element => {
                ftdvob = element.ftd,
                    ftdvobpha = element.pharmacy,
                    ftdvobopt = element.opticals,
                    ftdvobot = element.surgery,
                    ftdvoblab = element.laboratory,
                    ftdvobcons = element.consultation,
                    ftdvobothers = element.others
            })
            _.filter(vobres, { billed: branch }).forEach(element => {
                mtdvob += element.ftd,
                    mtdvobpha += element.pharmacy,
                    mtdvobopt += element.opticals,
                    mtdvobot += element.surgery,
                    mtdvoblab += element.laboratory,
                    mtdvobcons += element.consultation,
                    mtdvobothers += element.others
            })
            let tempftdbreakup = _.filter(breakupres, { branch: branch })
            if (tempftdbreakup.length !== 0) {
                aehftdbreakup = tempftdbreakup
            }
            else {
                aehftdbreakup = 0
            }
            let tempmtdbreakup = _.filter(breakupmtdres, { branch: branch })
            if (tempmtdbreakup.length !== 0) {
                aehmtdbreakup = tempmtdbreakup
            }
            else {
                aehmtdbreakup = 0
            }
            // _.filter(surgres, { BILLED: branch, transaction_date: ftddate }).forEach(element => {
            //     ftdotcount = element.count
            // })
            // _.filter(surgres, { BILLED: branch }).forEach(element => {
            //     mtdotcount += element.count
            // })
            // _.filter(countres, { branch: branch, trans_date: ftddate }).forEach(element => {
            //     cogsftdotcount = element.count
            // })
            // _.filter(countres, { branch: branch }).forEach(element => {
            //     cogsmtdotcount += element.count
            // })
            branchObj[key].push({ branch: branchName, code: code, ftdpha: ftdpha, ftdopt: ftdopt, ftdlab: ftdlab, ftdot: ftdot, ftd: ftd, ftdrev: ftdrev, ftdpharev: ftdpharev, ftdoptrev: ftdoptrev, ftdotrev: ftdotrev, ftdlabrev: ftdlabrev, ftdconsultrev: ftdconsultrev, ftdothersrev: ftdothersrev, ftd_cogs_percent: cogsPercent(ftd, ftdrev), mtdpha: mtdpha, mtdopt: mtdopt, mtdlab: mtdlab, mtdot: mtdot, mtd: mtd, mtdrev: mtdrev, mtdpharev: mtdpharev, mtdoptrev: mtdoptrev, mtdotrev: mtdotrev, mtdlabrev: mtdlabrev, mtdconsultrev: mtdconsultrev, mtdothersrev: mtdothersrev, mtd_cogs_percent: cogsPercent(mtd, mtdrev), ftdvobpha: ftdvobpha, ftdvobot: ftdvobot, ftdvobopt: ftdvobopt, ftdvoblab: ftdvoblab, ftdvobcons: ftdvobcons, ftdvobothers: ftdvobothers, ftdvob: ftdvob, ftd_vob_percent: cogsPercent(ftd, ftdvob), mtdvobpha: mtdvobpha, mtdvobopt: mtdvobopt, mtdvoblab: mtdvoblab, mtdvobot: mtdvobot, mtdvobcons: mtdvobcons, mtdvobothers: mtdvobothers, mtdvob: mtdvob, mtd_vob_percent: cogsPercent(mtd, mtdvob), ftdbreakup: aehftdbreakup, mtdbreakup: aehmtdbreakup })
            ftdpha = 0, ftdopt = 0, ftdlab = 0, ftdot = 0, ftd = 0, mtdpha = 0, mtdopt = 0, mtdlab = 0, mtdot = 0, mtd = 0, ftdrev = 0, mtdrev = 0, ftdpharev = 0, ftdoptrev = 0, ftdotrev = 0, ftdlabrev = 0, ftdconsultrev = 0, ftdothersrev = 0, mtdpharev = 0, mtdoptrev = 0, mtdotrev = 0, mtdlabrev = 0, mtdconsultrev = 0, mtdothersrev = 0, code = null, ftdvobot = 0, ftdvobopt = 0, ftdvobpha = 0, ftdvoblab = 0, ftdvobcons = 0, ftdvobothers = 0, ftdvob = 0, mtdvobot = 0, mtdvobopt = 0, mtdvoblab = 0, mtdvobpha = 0, mtdvobcons = 0, mtdvobothers = 0, mtdvob = 0, ftdotcount = 0, mtdotcount = 0, cogsftdotcount = 0, cogsmtdotcount = 0, aehftdbreakup = 0, aehmtdbreakup = 0
        })
    }
    for (let key in ahcgroupedBranches) {
        branchObj[key] = []
        ahcgroupedBranches[key].forEach(branch => {
            _.filter(branches, { code: branch }).forEach(element => { branchName = element.branch, code = element.code })
            _.filter(ahc, { branch: branch, trans_date: ftddate }).forEach(element => {
                ftdpha = element.pharmacy;
                ftdopt = element.opticals;
                ftdlab = element.laboratory;
                ftdot = element.operation_theatre;
                ftd = element.ftd
            })
            _.filter(ahc, { branch: branch }).forEach(element => {
                mtdpha += element.pharmacy;
                mtdopt += element.opticals;
                mtdlab += element.laboratory;
                mtdot += element.operation_theatre;
                mtd += element.ftd
            })
            _.filter(dbres2, { branch: branch, trans_date: ftddate }).forEach(element => {
                ftdrev = element.ftd,
                    ftdpharev = element.pharmacy,
                    ftdoptrev = element.opticals,
                    ftdotrev = element.surgery,
                    ftdlabrev = element.laboratory,
                    ftdconsultrev = element.consultation,
                    ftdothersrev = element.others
            })
            _.filter(dbres2, { branch: branch }).forEach(element => {
                mtdrev += element.ftd,
                    mtdpharev += element.pharmacy,
                    mtdoptrev += element.opticals,
                    mtdotrev += element.surgery,
                    mtdlabrev += element.laboratory,
                    mtdconsultrev += element.consultation,
                    mtdothersrev += element.others
            })
            _.filter(vobres, { billed: branch, trans_date: ftddate }).forEach(element => {
                ftdvob = element.ftd,
                    ftdvobpha = element.pharmacy,
                    ftdvobopt = element.opticals,
                    ftdvobot = element.surgery,
                    ftdvoblab = element.laboratory,
                    ftdvobcons = element.consultation,
                    ftdvobothers = element.others
            })
            _.filter(vobres, { billed: branch }).forEach(element => {
                mtdvob += element.ftd,
                    mtdvobpha += element.pharmacy,
                    mtdvobopt += element.opticals,
                    mtdvobot += element.surgery,
                    mtdvoblab += element.laboratory,
                    mtdvobcons += element.consultation,
                    mtdvobothers += element.others
            })
            let tempfilterftdbreakup = _.filter(breakupres, { branch: branch })
            if (tempfilterftdbreakup.length !== 0) {
                ahcftdbreakup = tempfilterftdbreakup
            }
            else {
                ahcftdbreakup = 0
            }
            let tempfiltermtdbreakup = _.filter(breakupmtdres, { branch: branch })
            if (tempfiltermtdbreakup.length !== 0) {
                ahcmtdbreakup = tempfiltermtdbreakup
            }
            else {
                ahcmtdbreakup = 0
            }
            // _.filter(surgres, { BILLED: branch, transaction_date: ftddate }).forEach(element => {
            //     ftdotcount = element.count
            // })
            // _.filter(surgres, { BILLED: branch }).forEach(element => {
            //     mtdotcount += element.count
            // })
            // _.filter(countres, { branch: branch, trans_date: ftddate }).forEach(element => {
            //     cogsftdotcount = element.count
            // })
            // _.filter(countres, { branch: branch }).forEach(element => {
            //     cogsmtdotcount += element.count
            // })
            branchObj[key].push({ branch: branchName, code: code, ftdpha: ftdpha, ftdopt: ftdopt, ftdlab: ftdlab, ftdot: ftdot, ftd: ftd, ftdrev: ftdrev, ftdpharev: ftdpharev, ftdoptrev: ftdoptrev, ftdotrev: ftdotrev, ftdlabrev: ftdlabrev, ftdconsultrev: ftdconsultrev, ftdothersrev: ftdothersrev, ftd_cogs_percent: cogsPercent(ftd, ftdrev), mtdpha: mtdpha, mtdopt: mtdopt, mtdlab: mtdlab, mtdot: mtdot, mtd: mtd, mtdrev: mtdrev, mtdpharev: mtdpharev, mtdoptrev: mtdoptrev, mtdotrev: mtdotrev, mtdlabrev: mtdlabrev, mtdconsultrev: mtdconsultrev, mtdothersrev: mtdothersrev, mtd_cogs_percent: cogsPercent(mtd, mtdrev), ftdvobpha: ftdvobpha, ftdvobot: ftdvobot, ftdvobopt: ftdvobopt, ftdvoblab: ftdvoblab, ftdvobcons: ftdvobcons, ftdvobothers: ftdvobothers, ftdvob: ftdvob, ftd_vob_percent: cogsPercent(ftd, ftdvob), mtdvobpha: mtdvobpha, mtdvobopt: mtdvobopt, mtdvoblab: mtdvoblab, mtdvobot: mtdvobot, mtdvobcons: mtdvobcons, mtdvobothers: mtdvobothers, mtdvob: mtdvob, mtd_vob_percent: cogsPercent(mtd, mtdvob), ftdbreakup: ahcftdbreakup, mtdbreakup: ahcmtdbreakup })
            ftdpha = 0, ftdopt = 0, ftdlab = 0, ftdot = 0, ftd = 0, mtdpha = 0, mtdopt = 0, mtdlab = 0, mtdot = 0, mtd = 0, ftdrev = 0, mtdrev = 0, ftdpharev = 0, ftdoptrev = 0, ftdotrev = 0, ftdlabrev = 0, ftdconsultrev = 0, ftdothersrev = 0, mtdpharev = 0, mtdoptrev = 0, mtdotrev = 0, mtdlabrev = 0, mtdconsultrev = 0, mtdothersrev = 0, code = null, ftdvobot = 0, ftdvobopt = 0, ftdvobpha = 0, ftdvoblab = 0, ftdvobcons = 0, ftdvobothers = 0, ftdvob = 0, mtdvobot = 0, mtdvobopt = 0, mtdvoblab = 0, mtdvobpha = 0, mtdvobcons = 0, mtdvobothers = 0, mtdvob = 0, ftdotcount = 0, mtdotcount = 0, cogsftdotcount = 0, cogsmtdotcount = 0, ahcftdbreakup = 0, ahcmtdbreakup = 0
        })
    }

    ahcGroups.forEach(group => {
        ahctempObj[group] = {}
        ahcgroupedBranches[group].forEach(branch => {
            _.filter(ahc, { branch: branch, trans_date: ftddate }).forEach(element => {
                ftdpha += element.pharmacy;
                ftdopt += element.opticals;
                ftdlab += element.laboratory;
                ftdot += element.operation_theatre;
                ftd += element.ftd
            })
            ahctempObj[group].ftdpha = ftdpha, ahctempObj[group].ftdopt = ftdopt, ahctempObj[group].ftdlab = ftdlab, ahctempObj[group].ftdot = ftdot, ahctempObj[group].ftd = ftd
            _.filter(ahc, { branch: branch }).forEach(element => {
                mtdpha += element.pharmacy;
                mtdopt += element.opticals;
                mtdlab += element.laboratory;
                mtdot += element.operation_theatre;
                mtd += element.ftd
            })
            ahctempObj[group].mtdpha = mtdpha, ahctempObj[group].mtdopt = mtdopt, ahctempObj[group].mtdlab = mtdlab, ahctempObj[group].mtdot = mtdot, ahctempObj[group].mtd = mtd
            _.filter(dbres2, { branch: branch, trans_date: ftddate }).forEach(element => {
                ftdrev += element.ftd
            })
            ahctempObj[group].ftdrev = ftdrev, ahctempObj[group].ftd_cogs_percent = cogsPercent(ftd, ftdrev)
            _.filter(dbres2, { branch: branch }).forEach(element => {
                mtdrev += element.ftd
            })
            ahctempObj[group].mtdrev = mtdrev, ahctempObj[group].mtd_cogs_percent = cogsPercent(mtd, mtdrev), ahctempObj[group].branch = group
        })
        ftdpha = 0, ftdopt = 0, ftdlab = 0, ftdot = 0, ftd = 0, mtdpha = 0, mtdopt = 0, mtdlab = 0, mtdot = 0, mtd = 0, ftdrev = 0, mtdrev = 0
    })
    return { aeh: aehtempObj, ahc: ahctempObj, branchwise: branchObj }
}

let cogsPercent = (cogs, revenue) => {
    if ((cogs !== 0 && revenue !== 0) || (cogs === 0 && revenue !== 0)) {
        return (cogs / revenue) * 100;
    }
    else if ((revenue === 0) || (cogs === 0 && revenue === 0)) {
        return 0;
    }
}