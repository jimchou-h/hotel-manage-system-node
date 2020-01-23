const { exec } = require('../db/mysql')

const login = (loginName, password, position) => {
  const sql = `
      select loginName, password, position from employees where loginName='${loginName}' and password='${password}' and position='${position}'
  `

  return exec(sql).then(rows => {
      return rows[0] || {}
  })
}

module.exports = {
  login
}