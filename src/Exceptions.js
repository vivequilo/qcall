function MissingRoomBuilderParam(message) {
    this.message = message;
    if ("captureStackTrace" in Error)
        Error.captureStackTrace(this, MissingRoomBuilderParam);
    else
        this.stack = (new Error()).stack;
}

MissingRoomBuilderParam.prototype = Object.create(Error.prototype);
MissingRoomBuilderParam.prototype.name = "MissingRoomBuilderParam";
MissingRoomBuilderParam.prototype.constructor = MissingRoomBuilderParam;


function InvalidRoomBuilderParam(message) {
    this.message = message;
    if ("captureStackTrace" in Error)
        Error.captureStackTrace(this, InvalidRoomBuilderParam);
    else
        this.stack = (new Error()).stack;
}

InvalidRoomBuilderParam.prototype = Object.create(Error.prototype);
InvalidRoomBuilderParam.prototype.name = "InvalidRoomBuilderParam";
InvalidRoomBuilderParam.prototype.constructor = InvalidRoomBuilderParam;
export default { MissingRoomBuilderParam, InvalidRoomBuilderParam }