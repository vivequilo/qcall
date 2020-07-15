export default class Client {
    constructor(id, metadata, call = null, stream = null, conn = null) {
        this.id = id
        this.metadata = metadata
        this.call = call
        this.stream = stream
        this.connection = conn
    }

    setConnection(connection) {
        this.connection = connection
    }

    setCall(call) {
        this.call = call
    }

    setStream(stream) {
        this.stream = stream
    }

    get videoTrack() {
        if (this.stream) {
            if (this.stream.getVideoTracks().length > 0) {
                return this.stream.getVideoTracks()[0]
            } else {
                return null
            }
        }
        return null
    }

    get videoTracks() {
        if (this.stream) {
            return this.stream.getVideoTracks()
        }
        return []
    }

    get audioTrack() {
        if (this.stream) {
            if (this.stream.getAudioTracks().length > 0) {
                return this.stream.getAudioTracks()[0]
            } else {
                return null
            }
        }
        return null
    }

    get audioTracks() {
        if (this.stream) {
            return this.stream.getAudioTracks()
        }
        return []
    }
}