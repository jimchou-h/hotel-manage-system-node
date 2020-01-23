var express = require('express');
var router = express.Router();
const { getEmployeeList, addEmployeeList, editEmployeeList, delEmployeeList, getRoomList, addRoom, editRoom, delRoom, checkRoomRepeat } = require('../controller/admin')
const { checkParams } = require('../utils/methods')
const { SuccessModel, ErrorModel } = require('../model/resModel')

router.post('/employee/list', async function (req, res, next) {
    const { page, size, q } = req.body
    let paramsResult = await checkParams(res, page, size)
    if (!paramsResult) {
        return;
    }
    let checkResult = await checkPower(req.session, res)
    if (!checkResult) {
        return;
    }
    const result = getEmployeeList(page, size, q)
    return result.then(data => {
        if (data.rows) {
            res.json(
                new SuccessModel(data)
            )
            return
        }
        res.json(
            new ErrorModel('获取列表失败')
        )
    })
});

router.post('/employee/add', async function (req, res, next) {
    const { name, loginName, sex, age, identity, password, position, tel, salary } = req.body
    let paramsResult = await checkParams(res, name, loginName, sex, identity, password, position)
    if (!paramsResult) {
        return;
    }
    let checkResult = await checkPower(req.session, res)
    if (!checkResult) {
        return;
    }
    const result = addEmployeeList(name, loginName, sex, age, identity, password, position, tel, salary)
    return result.then(data => {
        if (data.affectedRows == 1) {
            res.json(
                new SuccessModel()
            )
            return
        }
        res.json(
            new ErrorModel('添加员工信息失败')
        )
    })
});

router.post('/employee/edit', async function (req, res, next) {
    const { id, name, loginName, sex, age, identity, password, position, tel, salary } = req.body
    let paramsResult = await checkParams(res, id, name, loginName, sex, age, identity, password, position)
    if (!paramsResult) {
        return;
    }
    let checkResult = await checkPower(req.session, res)
    if (!checkResult) {
        return;
    }
    const result = editEmployeeList(id, name, loginName, sex, age, identity, password, position, tel, salary)
    return result.then(data => {
        if (data.affectedRows == 1) {
            res.json(
                new SuccessModel()
            )
            return
        }
        res.json(
            new ErrorModel('修改员工信息失败')
        )
    })
});

router.post('/employee/del', async function (req, res, next) {
    const { id } = req.body
    let paramsResult = await checkParams(res, id)
    if (!paramsResult) {
        return;
    }
    let checkResult = await checkPower(req.session, res)
    if (!checkResult) {
        return;
    }
    const result = delEmployeeList(id)
    return result.then(data => {
        if (data.affectedRows == 1) {
            res.json(
                new SuccessModel()
            )
            return
        }
        res.json(
            new ErrorModel('删除员工信息失败')
        )
    })
});

router.post('/room/list', async function (req, res, next) {
    const { page, size, q } = req.body
    let paramsResult = await checkParams(res, page, size)
    if (!paramsResult) {
        return;
    }
    let checkResult = await checkPower(req.session, res)
    if (!checkResult) {
        return;
    }
    const result = getRoomList(page, size, q)
    return result.then(data => {
        if (data.rows) {
            res.json(
                new SuccessModel(data)
            )
            return
        }
        res.json(
            new ErrorModel('获取列表失败')
        )
    })
});

router.post('/room/add', async function (req, res, next) {
    const { number, price, isRent } = req.body
    let paramsResult = await checkParams(res, number, price, isRent)
    if (!paramsResult) {
        return;
    }
    let checkResult = await checkPower(req.session, res)
    if (!checkResult) {
        return;
    }
    const result = addRoom(number, price, isRent)
    return result.then(data => {
        if (data.affectedRows == 1) {
            res.json(
                new SuccessModel()
            )
            return
        }
        res.json(
            new ErrorModel('添加客房信息失败')
        )
    })
});

router.post('/room/edit', async function (req, res, next) {
    const { id, number, price, isRent } = req.body
    let paramsResult = await checkParams(res, id, number, price, isRent)
    if (!paramsResult) {
        return;
    }
    let checkResult = await checkPower(req.session, res)
    if (!checkResult) {
        return;
    }
    const result = editRoom(id, number, price, isRent)
    return result.then(data => {
        if (data.affectedRows == 1) {
            res.json(
                new SuccessModel()
            )
            return
        }
        res.json(
            new ErrorModel('修改员工信息失败')
        )
    })
});

router.post('/room/del', async function (req, res, next) {
    const { id } = req.body
    let paramsResult = await checkParams(res, id)
    if (!paramsResult) {
        return;
    }
    let checkResult = await checkPower(req.session, res)
    if (!checkResult) {
        return;
    }
    const result = delRoom(id)
    return result.then(data => {
        if (data.affectedRows == 1) {
            res.json(
                new SuccessModel()
            )
            return
        }
        res.json(
            new ErrorModel('删除客房信息失败')
        )
    })
});

router.post('/room/check', async function (req, res, next) {
    const { number } = req.body
    let paramsResult = await checkParams(res, number)
    if (!paramsResult) {
        return;
    }
    let checkResult = await checkPower(req.session, res)
    if (!checkResult) {
        return;
    }
    const result = checkRoomRepeat(number)
    return result.then(data => {
        if (data) {
            res.json(
                new SuccessModel(true)
            )
            return
        }
        res.json(
            new SuccessModel(false)
        )
    })
});

// 检查权限
function checkPower(session, res) {
    if (!session.position || session.position != "admin") {
        res.json(
            new ErrorModel('你没有操作权限')
        )
        return false
    }
    return true
}

module.exports = router;