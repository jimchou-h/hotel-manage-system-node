const { exec } = require('../db/mysql')

const setCustomerSituation = (number, star, situation) => {
  const sql = `
    INSERT INTO situation VALUES (null, '${number}', '${star}', '${situation}')
  `

  return exec(sql).then(rows => {
    return rows;
  })
}

const setCustomerDemand = (number, tel, demand) => {
  let d = new Date();
  let updateTime = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + ' ' + d.getHours() +
  ':' + d.getMinutes() + ':' + d.getSeconds();
  const sql = `
    INSERT INTO demand VALUES (null, '${number}', '${tel}', '${demand}', 0,'${updateTime}', '', '')
  `
  return exec(sql).then(rows => {
    return rows;
  })
}

module.exports = {
  setCustomerSituation,
  setCustomerDemand
}