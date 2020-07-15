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


export default MissingRoomBuilderParam