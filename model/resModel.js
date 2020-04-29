class BaseModel {
    constructor(data, message) {
        if (typeof data === 'string') {
            this.message = data
            data = null
            message = null
        }
        if (data) {
            this.data = data
        }
        if (message) {
            this.message = message
        }
    }
}

class SuccessModel extends BaseModel {
    constructor(data, message) {
        super(data, message)
        this.code = 1
        this.message = this.message ? this.message : ""
        this.data = this.data ? this.data : null
    }
}

class ErrorModel extends BaseModel {
    constructor(data, message) {
        super(data, message)
        this.code = 0
        this.message = this.message ? this.message : ""
        this.data = this.data ? this.data : null
    }
}

module.exports = {
    SuccessModel,
    ErrorModel,
}