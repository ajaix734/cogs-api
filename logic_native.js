const _ = require('./modules')._
const connections = require('./modules').connections
const files = require('./modules').sqls
const session = require('./modules').cookieSession

exports.adminMainNative = async (dbres2, branches, ftddate, breakupres, breakupmtdres) => {
    let entityWise = await filterEntity(dbres2, ftddate)
    let groupWise = await filterGroupwise(entityWise.aeharr, entityWise.ahcarr, dbres2, branches, ftddate, breakupres, breakupmtdres)
    return { alin: entityWise.alin, aeh: entityWise.aeh, ahc: entityWise.ahc, aehgroup: groupWise.aeh, ahcgroup: groupWise.ahc, branchwise: groupWise.branchwise }
}

exports.othersMainNative = async (revenue, individual, group, branches, ftddate, breakupres, breakupmtdres) => {
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
            let tempFilterrev = _.filter(revenue, { branch: branch, trans_date: ftddate })
            if (tempFilterrev.length !== 0) {
                tempFilterrev.forEach(element => {
                    ftdrev += element.ftd
                    ftdpharev += element.pharmacy,
                        ftdoptrev += element.opticals,
                        ftdotrev += element.surgery,
                        ftdlabrev += element.laboratory,
                        ftdconsultrev += element.consultation,
                        ftdotherrev += element.others
                })
            }
            else {
                ftdrev += 0
                ftdpharev += 0,
                    ftdoptrev += 0,
                    ftdotrev += 0,
                    ftdlabrev += 0,
                    ftdconsultrev += 0,
                    ftdotherrev += 0
            }
            tempObj.branch = branch,
                tempObj.ftdrev = ftdrev,
                tempObj.ftdpharev = ftdpharev,
                tempObj.ftdotrev = ftdotrev,
                tempObj.ftdoptrev = ftdoptrev,
                tempObj.ftdlabrev = ftdlabrev,
                tempObj.ftdconsultrev = ftdconsultrev,
                tempObj.ftdotherrev = ftdotherrev

            _.filter(revenue, { branch: branch }).forEach(element => {
                mtdrev += element.ftd
                mtdpharev += element.pharmacy,
                    mtdoptrev += element.opticals,
                    mtdotrev += element.surgery,
                    mtdlabrev += element.laboratory,
                    mtdconsultrev += element.consultation,
                    mtdothersrev += element.others
            })
            tempObj.mtdrev = mtdrev,
                tempObj.mtdpharev = mtdpharev,
                tempObj.mtdoptrev = mtdoptrev,
                tempObj.mtdlabrev = mtdlabrev,
                tempObj.mtdotrev = mtdotrev,
                tempObj.mtdothersrev = mtdothersrev,
                tempObj.mtdconsultrev = mtdconsultrev
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
            let tempFileterev = _.filter(revenue, { branch: branch, trans_date: ftddate })
            if (tempFileterev.length !== 0) {
                tempFileterev.forEach(element => {
                    tempObj.branch = branchname,
                        tempObj.code = branch,
                        tempObj.ftdrev = element.ftd,
                        tempObj['ftdpharev'] = element.pharmacy,
                        tempObj['ftdoptrev'] = element.opticals,
                        tempObj['ftdotrev'] = element.surgery,
                        tempObj['ftdlabrev'] = element.laboratory,
                        tempObj['ftdconsultrev'] = element.consultation,
                        tempObj['ftdotherrev'] = element.others
                })
            }
            else {
                tempObj.branch = branchname,
                    tempObj.code = branch,
                    tempObj.ftdrev = 0,
                    tempObj['ftdpharev'] = 0,
                    tempObj['ftdoptrev'] = 0,
                    tempObj['ftdotrev'] = 0,
                    tempObj['ftdlabrev'] = 0,
                    tempObj['ftdconsultrev'] = 0,
                    tempObj['ftdotherrev'] = 0
            }
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
            _.filter(revenue, { branch: branch }).forEach(element => {
                mtdrev += element.ftd,
                    mtdpharev += element.pharmacy,
                    mtdoptrev += element.opticals,
                    mtdotrev += element.surgery,
                    mtdlabrev += element.laboratory,
                    mtdconsultrev += element.consultation,
                    mtdothersrev += element.others
            })
            tempObj.mtdrev = mtdrev,
                tempObj.mtdpharev = mtdpharev,
                tempObj.mtdoptrev = mtdoptrev,
                tempObj.mtdlabrev = mtdlabrev,
                tempObj.mtdotrev = mtdotrev,
                tempObj.mtdothersrev = mtdothersrev,
                tempObj.mtdconsultrev = mtdconsultrev
            branchWise.push(tempObj)
            tempObj = {}, mtdpha = 0, mtdopt = 0, mtdot = 0, mtdlab = 0, mtd = 0, mtdrev = 0, mtdpharev = 0, mtdoptrev = 0, mtdotrev = 0, mtdlabrev = 0, mtdconsultrev = 0, mtdothersrev = 0, mtdvob = 0, mtdvobpha = 0, mtdvobot = 0, mtdvobopt = 0, mtdvoblab = 0, mtdvobcons = 0, mtdvobothers = 0, mtdotcount = 0, cogsmtdotcount = 0

        }
        else {
            let tempFileterev = _.filter(revenue, { branch: branch, trans_date: ftddate })
            if (tempFileterev.length !== 0) {
                tempFileterev.forEach(element => {
                    tempObj.branch = branchname,
                        tempObj.code = branch,
                        tempObj.ftdrev = element.ftd,
                        tempObj['ftdpharev'] = element.pharmacy,
                        tempObj['ftdoptrev'] = element.opticals,
                        tempObj['ftdotrev'] = element.surgery,
                        tempObj['ftdlabrev'] = element.laboratory,
                        tempObj['ftdconsultrev'] = element.consultation,
                        tempObj['ftdotherrev'] = element.others
                })
            }
            else {
                tempObj.branch = branchname,
                    tempObj.code = branch,
                    tempObj.ftdrev = 0,
                    tempObj['ftdpharev'] = 0,
                    tempObj['ftdoptrev'] = 0,
                    tempObj['ftdotrev'] = 0,
                    tempObj['ftdlabrev'] = 0,
                    tempObj['ftdconsultrev'] = 0,
                    tempObj['ftdotherrev'] = 0
            }
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

            _.filter(revenue, { branch: branch }).forEach(element => {
                mtdrev += element.ftd,
                    mtdpharev += element.pharmacy,
                    mtdoptrev += element.opticals,
                    mtdotrev += element.surgery,
                    mtdlabrev += element.laboratory,
                    mtdconsultrev += element.consultation,
                    mtdothersrev += element.others
            })
            tempObj.mtdrev = mtdrev,
                tempObj.mtdpharev = mtdpharev,
                tempObj.mtdoptrev = mtdoptrev,
                tempObj.mtdlabrev = mtdlabrev,
                tempObj.mtdotrev = mtdotrev,
                tempObj.mtdothersrev = mtdothersrev,
                tempObj.mtdconsultrev = mtdconsultrev
            seperatedBranchWise.push(tempObj)
            tempObj = {}, mtdpha = 0, mtdopt = 0, mtdot = 0, mtdlab = 0, mtd = 0, mtdrev = 0, mtdpharev = 0, mtdoptrev = 0, mtdotrev = 0, mtdlabrev = 0, mtdconsultrev = 0, mtdothersrev = 0, mtdvob = 0, mtdvobpha = 0, mtdvobot = 0, mtdvobopt = 0, mtdvoblab = 0, mtdvobcons = 0, mtdvobothers = 0, mtdotcount = 0, cogsmtdotcount = 0

        }
    })
    return { group: groupWise, branch: branchWise, mappings: mappings, specialBranch: _.uniqBy(seperatedBranchWise, 'code') }
}

let filterEntity = async (dbres2, ftddate) => {
    let tempObj = {}, pha = 0, opt = 0, lab = 0, ot = 0, total = 0, rev = 0, aeharr = [], aehrevarr = [], ahcrevarr = [], ahcarr = [], alin = {}
    aehrevarr = _.filter(dbres2, { entity: 'AEH' })
    _.filter(aehrevarr, { trans_date: ftddate }).forEach(element => {
        pha += element.pharmacy;
        opt += element.opticals;
        lab += element.laboratory;
        ot += element.surgery;
        total += element.ftd
    })
    tempObj.AEH = { branch: 'AEH', ftdpharev: pha, ftdoptrev: opt, ftdlabrev: lab, ftdotrev: ot, ftdrev: total }
    pha = 0, opt = 0, lab = 0, ot = 0, total = 0
    aehrevarr.forEach(element => {
        pha += element.pharmacy;
        opt += element.opticals;
        lab += element.laboratory;
        ot += element.surgery;
        total += element.ftd
    })
    tempObj.AEH.mtdpharev = pha, tempObj.AEH.mtdoptrev = opt, tempObj.AEH.mtdlabrev = lab, tempObj.AEH.mtdotrev = ot, tempObj.AEH.mtdrev = total
    pha = 0, opt = 0, lab = 0, ot = 0, total = 0
    ahcrevarr = _.filter(dbres2, { entity: 'AHC' })
    _.filter(ahcrevarr, { trans_date: ftddate }).forEach(element => {
        pha += element.pharmacy;
        opt += element.opticals;
        lab += element.laboratory;
        ot += element.surgery;
        total += element.ftd
    })
    tempObj.AHC = {
        branch: 'AHC', ftdpharev: pha, ftdoptrev: opt, ftdlabrev: lab, ftdotrev: ot, ftdrev: total
    }
    pha = 0, opt = 0, lab = 0, ot = 0, total = 0
    ahcrevarr.forEach(element => {
        pha += element.pharmacy;
        opt += element.opticals;
        lab += element.laboratory;
        ot += element.surgery;
        total += element.ftd
    })
    tempObj.AHC.mtdpharev = pha, tempObj.AHC.mtdoptrev = opt, tempObj.AHC.mtdlabrev = lab, tempObj.AHC.mtdotrev = ot, tempObj.AHC.mtdrev = total
    for (let key in tempObj.AEH) {
        alin[key] = tempObj.AEH[key]
    }
    for (let key in tempObj.AHC) {
        alin['branch'] = 'All India'
        alin[key] += tempObj.AHC[key]
    }

    return { 'alin': alin, 'aeharr': aeharr, 'ahcarr': ahcarr, 'aeh': tempObj.AEH, 'ahc': tempObj.AHC }
}

let filterGroupwise = async (aeh, ahc, dbres2, branches, ftddate, breakupres, breakupmtdres) => {
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
            _.filter(dbres2, { branch: branch, trans_date: ftddate }).forEach(element => {
                ftdpha += element.pharmacy;
                ftdopt += element.opticals;
                ftdlab += element.laboratory;
                ftdot += element.surgery;
                ftd += element.ftd
            })
            aehtempObj[group].ftdpharev = ftdpha, aehtempObj[group].ftdoptrev = ftdopt, aehtempObj[group].ftdlabrev = ftdlab, aehtempObj[group].ftdotrev = ftdot, aehtempObj[group].ftdrev = ftd
            _.filter(dbres2, { branch: branch }).forEach(element => {
                mtdpha += element.pharmacy;
                mtdopt += element.opticals;
                mtdlab += element.laboratory;
                mtdot += element.surgery;
                mtd += element.ftd
            })
            aehtempObj[group].mtdpharev = mtdpha, aehtempObj[group].mtdoptrev = mtdopt, aehtempObj[group].mtdlabrev = mtdlab, aehtempObj[group].mtdotrev = mtdot, aehtempObj[group].mtdrev = mtd, aehtempObj[group].branch = group
        })
        ftdpha = 0, ftdopt = 0, ftdlab = 0, ftdot = 0, ftd = 0, mtdpha = 0, mtdopt = 0, mtdlab = 0, mtdot = 0, mtd = 0
    })
    for (let key in aehgroupedBranches) {
        branchObj[key] = []
        aehgroupedBranches[key].forEach(branch => {
            _.filter(branches, { code: branch }).forEach(element => { branchName = element.branch, code = element.code })
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
            branchObj[key].push({ branch: branchName, code: code, ftdrev: ftdrev, ftdpharev: ftdpharev, ftdoptrev: ftdoptrev, ftdotrev: ftdotrev, ftdlabrev: ftdlabrev, ftdconsultrev: ftdconsultrev, ftdothersrev: ftdothersrev, mtdrev: mtdrev, mtdpharev: mtdpharev, mtdoptrev: mtdoptrev, mtdotrev: mtdotrev, mtdlabrev: mtdlabrev, mtdconsultrev: mtdconsultrev, mtdothersrev: mtdothersrev, ftdbreakup: aehftdbreakup, mtdbreakup: aehmtdbreakup })
            ftdpha = 0, ftdopt = 0, ftdlab = 0, ftdot = 0, ftd = 0, mtdpha = 0, mtdopt = 0, mtdlab = 0, mtdot = 0, mtd = 0, ftdrev = 0, mtdrev = 0, ftdpharev = 0, ftdoptrev = 0, ftdotrev = 0, ftdlabrev = 0, ftdconsultrev = 0, ftdothersrev = 0, mtdpharev = 0, mtdoptrev = 0, mtdotrev = 0, mtdlabrev = 0, mtdconsultrev = 0, mtdothersrev = 0, code = null, ftdvobot = 0, ftdvobopt = 0, ftdvobpha = 0, ftdvoblab = 0, ftdvobcons = 0, ftdvobothers = 0, ftdvob = 0, mtdvobot = 0, mtdvobopt = 0, mtdvoblab = 0, mtdvobpha = 0, mtdvobcons = 0, mtdvobothers = 0, mtdvob = 0, ftdotcount = 0, mtdotcount = 0, cogsftdotcount = 0, cogsmtdotcount = 0, aehftdbreakup = 0, aehmtdbreakup = 0
        })
    }
    for (let key in ahcgroupedBranches) {
        branchObj[key] = []
        ahcgroupedBranches[key].forEach(branch => {
            _.filter(branches, { code: branch }).forEach(element => { branchName = element.branch, code = element.code })
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
            branchObj[key].push({ branch: branchName, code: code, ftdrev: ftdrev, ftdpharev: ftdpharev, ftdoptrev: ftdoptrev, ftdotrev: ftdotrev, ftdlabrev: ftdlabrev, ftdconsultrev: ftdconsultrev, ftdothersrev: ftdothersrev, mtdrev: mtdrev, mtdpharev: mtdpharev, mtdoptrev: mtdoptrev, mtdotrev: mtdotrev, mtdlabrev: mtdlabrev, mtdconsultrev: mtdconsultrev, mtdothersrev: mtdothersrev, ftdbreakup: ahcftdbreakup, mtdbreakup: ahcmtdbreakup })
            ftdpha = 0, ftdopt = 0, ftdlab = 0, ftdot = 0, ftd = 0, mtdpha = 0, mtdopt = 0, mtdlab = 0, mtdot = 0, mtd = 0, ftdrev = 0, mtdrev = 0, ftdpharev = 0, ftdoptrev = 0, ftdotrev = 0, ftdlabrev = 0, ftdconsultrev = 0, ftdothersrev = 0, mtdpharev = 0, mtdoptrev = 0, mtdotrev = 0, mtdlabrev = 0, mtdconsultrev = 0, mtdothersrev = 0, code = null, ftdvobot = 0, ftdvobopt = 0, ftdvobpha = 0, ftdvoblab = 0, ftdvobcons = 0, ftdvobothers = 0, ftdvob = 0, mtdvobot = 0, mtdvobopt = 0, mtdvoblab = 0, mtdvobpha = 0, mtdvobcons = 0, mtdvobothers = 0, mtdvob = 0, ftdotcount = 0, mtdotcount = 0, cogsftdotcount = 0, cogsmtdotcount = 0, ahcftdbreakup = 0, ahcmtdbreakup = 0
        })
    }

    ahcGroups.forEach(group => {
        ahctempObj[group] = {}
        ahcgroupedBranches[group].forEach(branch => {
            _.filter(dbres2, { branch: branch, trans_date: ftddate }).forEach(element => {
                ftdpha += element.pharmacy;
                ftdopt += element.opticals;
                ftdlab += element.laboratory;
                ftdot += element.surgery;
                ftd += element.ftd
            })
            ahctempObj[group].ftdpharev = ftdpha, ahctempObj[group].ftdoptrev = ftdopt, ahctempObj[group].ftdlabrev = ftdlab, ahctempObj[group].ftdotrev = ftdot, ahctempObj[group].ftdrev = ftd
            _.filter(dbres2, { branch: branch }).forEach(element => {
                mtdpha += element.pharmacy;
                mtdopt += element.opticals;
                mtdlab += element.laboratory;
                mtdot += element.surgery;
                mtd += element.ftd
            })
            ahctempObj[group].mtdpharev = mtdpha, ahctempObj[group].mtdoptrev = mtdopt, ahctempObj[group].mtdlabrev = mtdlab, ahctempObj[group].mtdotrev = mtdot, ahctempObj[group].mtdrev = mtd, ahctempObj[group].branch = group
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