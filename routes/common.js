var express = require('express');
var router = express.Router();
const { login, getRealName, setPersonCard, checkPersonCard } = require('../controller/common')
const { SuccessModel, ErrorModel } = require('../model/resModel')

router.post('/login', function (req, res, next) {
    const { loginName, password, position } = req.body
    const result = login(loginName, password, position)
    return result.then(data => {
        if (data.loginName) {
            // 设置 session
            req.session.loginName = data.loginName
            req.session.position = data.position
            res.json(
                new SuccessModel({
                  name: data.name,
                  card: data.card
                })
            )
            return
        }
        res.json(
            new ErrorModel('登录失败，请重试')
        )
    })
});

router.post('/logout', function (req, res, next) {
    return new Promise((resolve, reject) => {
        req.session.destroy();
        res.json(
            new SuccessModel()
        )
    })
});

router.post('/setcard', function (req, res, next) {
    const { loginName, position, cardTime } = req.body
    const result = setPersonCard(loginName, position, cardTime)
    return result.then(data => {
        if (data.affectedRows > 0) {
            res.json(
                new SuccessModel()
            )
            return
        }
        res.json(
            new ErrorModel('打卡失败')
        )
    })
});

router.post('/checkcard', function (req, res, next) {
    const { loginName, position } = req.body
    const result = checkPersonCard(loginName, position)
    return result.then(data => {
        if (data) {
            res.json(
                new SuccessModel({
                  card: data.card
                })
            )
            return
        }
        res.json(
            new ErrorModel()
        )
    })
});

module.exports = router;
