const { SuccessModel, ErrorModel } = require('../model/resModel')

// 检查必要参数
function checkParams(res) {
  for (let i = 1, j = arguments.length; i < j; i++) {
    if (arguments[i] === undefined) {
      res.json(
        new ErrorModel("缺少参数")
      )
      return false;
    }
  }
  return true;
}

module.exports = {
  checkParams
}