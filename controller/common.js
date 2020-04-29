const { exec } = require('../db/mysql')

const login = (loginName, password, position) => {
  const sql = `
      select loginName, password, position, name, card from employees where loginName='${loginName}' and password='${password}' and position='${position}'
  `

  return exec(sql).then(rows => {
      return rows[0] || {}
  })
}

const setCard = () => {
  const sql = `
      update employees set card = 0, cardTime = ''
  `
  return exec(sql).then(rows => {
      return rows[0] || {}
  })
}

const setPersonCard = (loginName, position, cardTime) => {
  const sql = `
      update employees set card = 1, cardTime = '${cardTime}' WHERE loginName='${loginName}' and position='${position}'
  `
  return exec(sql).then(rows => {
      return rows
  })
}

const checkPersonCard = (loginName, position) => {
  const sql = `
      select card from employees WHERE loginName='${loginName}' and position='${position}'
  `
  return exec(sql).then(rows => {
      return rows[0] || {}
  })
}

module.exports = {
  login,
  setCard,
  setPersonCard,
  checkPersonCard
}