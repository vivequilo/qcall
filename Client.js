class Client {
    constructor(id, metadata, call = null, stream = null) {
        this.id = id
        this.metadata = metadata
        this.call = call
        this.stream = stream
    }

    setCall(call) {
        this.call = call
    }

    setStream(stream) {
        this.stream = stream
    }
}