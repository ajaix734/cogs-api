const mods = require("./modules");
const uuid = mods.uuid;

const connections = mods.connections;
const files = mods.sqls;
let sess = null;

exports.main_route = (req, res) => {
  // if (sess.superUser === undefined) {
  //   res.json({ msg: "Not Authorised" });
  // } else {
    let ftddate = req.params.date;
    let temp = new Date(ftddate);
    let mtddate =
      temp.getFullYear() +
      "-" +
      ("0" + (temp.getMonth() + 1)).slice(-2) +
      "-" +
      "01";
    connections.scm_public.query(files.cogsSuper, [mtddate, ftddate], function (
      error,
      cogsresults
    ) {
      if (error) console.error(error);
      connections.scm_public.query(
        files.revenueSuper,
        [mtddate, ftddate],
        (error, revresults) => {
          if (error) console.error(error);
          connections.scm_public.query(
            "select * from branches",
            (err, branchres) => {
              if (err) console.error(err);
              connections.scm_public.query(
                files.vobSuper,
                [mtddate, ftddate],
                (voberr, vobres) => {
                  if (voberr) console.error(voberr);
                  // connections.scm_public.query(files.surgCount, [mtddate, ftddate], (surgerr, surgres) => {
                  // if (surgerr) console.error(surgerr)
                  // connections.scm_public.query(files.cogsCount, [mtddate, ftddate], (counterr, countres) => {
                  // if (counterr) console.error(counterr)
                  connections.scm_public.query(files.breakupSuper, [ftddate, ftddate], (breakuperr, breakupres) => {
                    if (breakuperr) console.error(breakuperr)
                    connections.scm_public.query(files.breakupmtdSuper, [mtddate, ftddate], (breakupmtderr, breakupmtdres) => {
                      if (breakupmtderr) console.error(breakupmtderr)
                      mods.functions
                        .adminMain(
                          cogsresults,
                          revresults,
                          branchres,
                          ftddate,
                          vobres,
                          // surgres,
                          // countres
                          breakupres,
                          breakupmtdres
                        )
                        .then(final => res.json(final));
                    })
                  })
                  // })
                  // })
                }
              );
            }
          );
        }
      );
    });
  // }
};

exports.main_route_revenue = (req, res) => {
  // if (sess.superUser === undefined) {
  //   res.json({ msg: "Not Authorised" });
  // } else {
    let ftddate = req.params.date;
    let temp = new Date(ftddate);
    let mtddate =
      temp.getFullYear() +
      "-" +
      ("0" + (temp.getMonth() + 1)).slice(-2) +
      "-" +
      "01";
    connections.scm_public.query(
      files.nativerevenueSuper,
      [mtddate, ftddate],
      (error, revresults) => {
        if (error) console.error(error);
        connections.scm_public.query(
          "select * from branches",
          (err, branchres) => {
            if (err) console.error(err);
            connections.scm_public.query(files.nativebreakupSuper, [ftddate, ftddate], (breakuperr, breakupres) => {
              if (breakuperr) console.error(breakuperr)
              connections.scm_public.query(files.nativebreakupmtdSuper, [mtddate, ftddate], (breakupmtderr, breakupmtdres) => {
                if (breakupmtderr) console.error(breakupmtderr)
                mods.nativeFunctions
                  .adminMainNative(
                    revresults,
                    branchres,
                    ftddate,
                    breakupres,
                    breakupmtdres
                  )
                  .then(final => res.json(final));
              })
            })
          }
        );
      }
    );
  // }
};

exports.choose_route = (req, res) => {
  if (sess.role === "super_user") {
    this.main_route(req, res);
  } else {
    this.test_route(req, res);
  }
};

exports.health = (req, res) => {
  res.json({ msg: "Am ALIVE!!!." });
};

exports.logout = (req, res) => {
  // mods.sessionStore.close()
  this.sess = null;
  res.json({ isAuthenticated: false });
};

// Local test code

exports.testLogin = (req, res) => {
  let user = req.body.user.trim();
  let pass = req.body.pass.trim();
  if (user !== pass) {
    res.json({ isAuthenticated: false });
  } else {
    connections.scm_public.query(
      "select * from users where emp_id = ?",
      [user],
      (err, result) => {
        if (err) console.error(err);
        if (result.length === 0) {
          res.json({ isAuthenticated: false });
        } else {
          res.json({ isAuthenticated: true, role: result[0].role });
          // mods.session.user = JSON.stringify(user)
          // mods.session.role = JSON.stringify(result[0].role)
          sess = req.session;
          sess.role = result[0].role;
          if (sess.role === "normal_user") {
            sess.normalUser = user;
          }
          if (sess.role === "super_user") {
            sess.superUser = user;
          }
        }
      }
    );
  }
};

exports.test_route = (req, res) => {
  let ftddate = req.params.date;
  let temp = new Date(ftddate);
  let individualBranches = [];
  let branchGroups = [];
  let mtddate =
    temp.getFullYear() +
    "-" +
    ("0" + (temp.getMonth() + 1)).slice(-2) +
    "-" +
    "01";
  // let emp = JSON.parse(mods.session.user)
  let emp = req.params.name;
  connections.scm_public.query(
    "select * from users where emp_id = ?",
    [emp],
    (err, userRes) => {
      if (err) console.log(err);
      userRes.forEach(element => {
        if (element.branches.length < 4) {
          individualBranches.push(element.branches);
        } else {
          branchGroups.push(element.branches);
          let value = element.branches.split("=")[1];
          if (!mods._.includes(value, "+")) {
            individualBranches.push(value);
          }
        }
      });
      connections.scm_public.query(
        files.cogs,
        [mtddate, ftddate, individualBranches],
        function (error, cogsresults) {
          if (error) console.error(error);
          connections.scm_public.query(
            files.revenue,
            [mtddate, ftddate, individualBranches],
            (error, revresults) => {
              if (error) console.error(error);
              connections.scm_public.query(
                "select * from branches",
                (err, branchres) => {
                  if (err) console.error(err);
                  connections.scm_public.query(
                    files.vob,
                    [mtddate, ftddate, individualBranches],
                    (voberr, vobres) => {
                      if (voberr) console.error(voberr);
                      // connections.scm_public.query(
                      // files.surgCount,
                      // [mtddate, ftddate],
                      // (surgerr, surgres) => {
                      // if (surgerr) console.error(surgerr);
                      // connections.scm_public.query(files.cogsCount, [mtddate, ftddate], (counterr, countres) => {
                      // if (counterr) console.error(counterr)
                      connections.scm_public.query(files.breakup, [mtddate, ftddate, individualBranches], (breakuperr, breakupres) => {
                        if (breakuperr) console.error(breakuperr)
                        connections.scm_public.query(files.breakupmtd, [mtddate, ftddate, individualBranches], (breakupmtderr, breakupmtdres) => {
                          if (breakupmtderr) console.error(breakupmtderr)
                          mods.functions
                            .othersMain(
                              cogsresults,
                              revresults,
                              individualBranches,
                              branchGroups,
                              branchres,
                              ftddate,
                              vobres,
                              // surgres,
                              // countres,
                              breakupres,
                              breakupmtdres
                            )
                            .then(final => res.json(final));
                        })
                      })
                      // })
                      // }
                      // );
                    }
                  );
                }
              );
            }
          );
        }
      );
    }
  );
};

exports.test_route_revenue = (req, res) => {
  let ftddate = req.params.date;
  let temp = new Date(ftddate);
  let individualBranches = [];
  let branchGroups = [];
  let mtddate =
    temp.getFullYear() +
    "-" +
    ("0" + (temp.getMonth() + 1)).slice(-2) +
    "-" +
    "01";
  // let emp = JSON.parse(mods.session.user)
  let emp = req.params.name;
  connections.scm_public.query(
    "select * from users where emp_id = ?",
    [emp],
    (err, userRes) => {
      if (err) console.log(err);
      userRes.forEach(element => {
        if (element.branches.length < 4) {
          individualBranches.push(element.branches);
        } else {
          branchGroups.push(element.branches);
          let value = element.branches.split("=")[1];
          if (!mods._.includes(value, "+")) {
            individualBranches.push(value);
          }
        }
      });
      connections.scm_public.query(
        files.nativerevenue,
        [mtddate, ftddate, individualBranches],
        (error, revresults) => {
          if (error) console.error(error);
          connections.scm_public.query(
            "select * from branches",
            (err, branchres) => {
              if (err) console.error(err);
              connections.scm_public.query(files.nativebreakup, [mtddate, ftddate, individualBranches], (breakuperr, breakupres) => {
                if (breakuperr) console.error(breakuperr)
                connections.scm_public.query(files.nativebreakupmtd, [mtddate, ftddate, individualBranches], (breakupmtderr, breakupmtdres) => {
                  if (breakupmtderr) console.error(breakupmtderr)
                  mods.nativeFunctions
                    .othersMainNative(
                      revresults,
                      individualBranches,
                      branchGroups,
                      branchres,
                      ftddate,
                      breakupres,
                      breakupmtdres
                    )
                    .then(final => res.json(final));
                })
              })
            }
          );
        }
      );
    }
  );
};
