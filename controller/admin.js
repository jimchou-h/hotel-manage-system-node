const { exec } = require('../db/mysql')

const getEmployeeList = (page, size, q) => {
  let sql = `
      select id, name, loginName, password, sex, age, identity, position, tel, salary from employees where 1 = 1
  `
  if (q) {
    sql += `
      and name like '${q}%' or loginName like '${q}%' or sex like '${q}%' or identity like '${q}%' or position like '${q}%'
    `
  }
  return exec(sql).then(rows => {
    if (page == 1) {
      return {
        rows: rows.slice(0, size) || [],
        total: rows.length,
        page: page,
        size: size
      }
    } else {
      return {
        rows: rows.slice((page - 1) * size, page * size) || [],
        total: rows.length,
        page: page,
        size: size
      }
    }
  })
}

const addEmployeeList = (name, loginName, sex, age, identity, password, position, tel, salary) => {
  console.log(salary)
  const sql = `
     INSERT INTO employees VALUES (null, '${name}', '${loginName}', '${sex}', '${age}', '${identity}', '${password}', '${position}', '${salary}', '${tel}')
  `
  return exec(sql).then(rows => {
    return rows
  })
}

const editEmployeeList = (id, name, loginName, sex, age, identity, password, position, tel, salary) => {
  if (!age) {
    age = 0
  }
  const sql = `
     UPDATE employees SET name = '${name}', loginName = '${loginName}', sex = '${sex}', age = '${age}', tel = '${tel}', salary = '${salary}', identity = '${identity}', password = '${password}', position = '${position}' WHERE id = '${id}'
  `
  return exec(sql).then(rows => {
    return rows
  })
}

const delEmployeeList = (id) => {
  const sql = `
      DELETE FROM employees WHERE id = '${id}' 
  `
  return exec(sql).then(rows => {
    return rows
  })
}

const getRoomList = (page, size, q) => {
  console.log(q)
  let sql = `
      select id, type, number, price, isRent from rooms where 1 = 1
  `
  if (q) {
    sql += `
      and number like '${q}%'
    `
  }
  sql += `ORDER BY number asc`
  return exec(sql).then(rows => {
    console.log(rows)
    if (page == 1) {
      return {
        rows: rows.slice(0, size) || [],
        total: rows.length,
        page: page,
        size: size
      }
    } else {
      return {
        rows: rows.slice((page - 1) * size, page * size) || [],
        total: rows.length,
        page: page,
        size: size
      }
    }
  })
}

const addRoom = (number, price, isRent, type) => {
  const sql = `
     INSERT INTO rooms VALUES (null, '${number}', '${price}', 0, 0, '', '${isRent}', '', '', '', '', 0, '', '', '', '', '${type}')
  `
  return exec(sql).then(rows => {
    return rows
  })
}

const editRoom = (id, number, price, isRent, type) => {
  const sql = `
     UPDATE rooms SET number = '${number}', type = '${type}', price = '${price}', isRent = '${isRent}' WHERE id = '${id}'
  `
  return exec(sql).then(rows => {
    return rows
  })
}

const delRoom = (id) => {
  const sql = `
      DELETE FROM rooms WHERE id = '${id}' 
  `
  return exec(sql).then(rows => {
    return rows
  })
}

const checkRoomRepeat = (number) => {
  const sql = `
  select id  from rooms where number = '${number}'
  `
  return exec(sql).then(rows => {
    if (rows.length > 0) {
      return false;
    }
    return true;
  })
}


module.exports = {
  getEmployeeList,
  addEmployeeList,
  editEmployeeList,
  delEmployeeList,
  getRoomList,
  addRoom,
  editRoom,
  delRoom,
  checkRoomRepeat
}