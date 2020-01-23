var express = require('express');
var router = express.Router();
const { getDemandList, setDemandFinish, setDemandUnfinish } = require('../controller/waiter')
const { checkParams } = require('../utils/methods')
const { SuccessModel, ErrorModel } = require('../model/resModel')

router.post('/demand/list', async function (req, res, next) {
    const { page, size, manager } = req.body
    let paramsResult = await checkParams(res, page, size)
    if (!paramsResult) {
        return;
    }
    let checkResult = await checkPower(req.session, res)
    if (!checkResult) {
        return;
    }
    const result = getDemandList(page, size, manager)
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

router.post('/demand/finish', async function (req, res, next) {
  const { ids, name } = req.body
  let paramsResult = await checkParams(res, name)
    if (!paramsResult) {
        return;
    }
  let checkResult = await checkPower(req.session, res)
  if (!checkResult) {
      return;
  }
  const result = setDemandFinish(ids, name)
  return result.then(data => {
      if (data.affectedRows > 0) {
          res.json(
              new SuccessModel()
          )
          return
      }
      res.json(
          new ErrorModel('设置顾客需求完成状态失败')
      )
  })
});

router.post('/demand/unfinish', async function (req, res, next) {
  const { ids, name } = req.body
  let paramsResult = await checkParams(res, name)
    if (!paramsResult) {
        return;
    }
  let checkResult = await checkPower(req.session, res)
  if (!checkResult) {
      return;
  }
  const result = setDemandUnfinish(ids, name)
  return result.then(data => {
      if (data.affectedRows > 0) {
          res.json(
              new SuccessModel()
          )
          return
      }
      res.json(
          new ErrorModel('设置顾客需求未完成状态失败')
      )
  })
});

// 检查权限
function checkPower(session, res) {
    if (!session.position || (session.position != "waiter" && session.position != "manager")) {
        res.json(
            new ErrorModel('你没有操作权限')
        )
        return false
    }
    return true
}

module.exports = router;