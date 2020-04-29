var express = require('express');
var router = express.Router();
const { getCleanerList, setRoomClean, setRoomUnclean, receiveTask } = require('../controller/cleaner')
const { checkParams } = require('../utils/methods')
const { SuccessModel, ErrorModel } = require('../model/resModel')

router.post('/list', async function (req, res, next) {
    const { page, size, q } = req.body
    let paramsResult = await checkParams(res, page, size)
    if (!paramsResult) {
        return;
    }
    let checkResult = await checkPower(req.session, res)
    if (!checkResult) {
        return;
    }
    const result = getCleanerList(page, size, q)
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

router.post('/set', async function (req, res, next) {
  const { ids, name } = req.body
  let paramsResult = await checkParams(res, name)
    if (!paramsResult) {
        return;
    }
  let checkResult = await checkPower(req.session, res)
  if (!checkResult) {
      return;
  }
  const result = setRoomClean(ids, name)
  return result.then(data => {
      if (data.affectedRows > 0) {
          res.json(
              new SuccessModel()
          )
          return
      }
      res.json(
          new ErrorModel('设置客房状态失败')
      )
  })
});

router.post('/unset', async function (req, res, next) {
  const { ids } = req.body
  let checkResult = await checkPower(req.session, res)
  if (!checkResult) {
      return;
  }
  const result = setRoomUnclean(ids)
  return result.then(data => {
      if (data.affectedRows > 0) {
          res.json(
              new SuccessModel()
          )
          return
      }
      res.json(
          new ErrorModel('设置客房状态失败')
      )
  })
});

router.post('/receive', async function (req, res, next) {
  const { id, name } = req.body
  let checkResult = await checkPower(req.session, res)
  if (!checkResult) {
      return;
  }
  const result = receiveTask(id, name)
  return result.then(data => {
      if (data.affectedRows > 0) {
          res.json(
              new SuccessModel()
          )
          return
      }
      res.json(
          new ErrorModel('接受失败')
      )
  })
});

// 检查权限
function checkPower(session, res) {
    if (!session.position || session.position != "cleaner") {
        res.json(
            new ErrorModel('你没有操作权限')
        )
        return false
    }
    return true
}

module.exports = router;