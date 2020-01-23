var express = require('express');
var router = express.Router();
const { login } = require('../controller/common')
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
                new SuccessModel()
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

module.exports = router;
