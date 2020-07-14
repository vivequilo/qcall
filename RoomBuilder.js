import { uuidv4 } from './Utils'
import Room from './Room'
class RoomBuilder {
    constructor(id, peerId = uuidv4(), metadata = {}, onStreamAdded = (id, remoteStream) => { }, onStreamAddedFail = (client, error) => { }) {
        this.id = id
        this.peerId = peerId
        this.metadata = metadata
        this.onStreamAdded = onStreamAdded
        this.onStreamAddedFail = onStreamAddedFail
    }

    setPeerId(peerId) {
        this.peerId = peerId
        return this
    }
    setMetadata(metadata) {
        this.metadata = metadata
        return this
    }
    setOnStreamAdded(onStreamAdded) {
        this.onStreamAdded = onStreamAdded
        return this
    }
    setOnStreamAdded(onStreamAddedFail) {
        this.onStreamAddedFail = onStreamAddedFail
        return this
    }
    build() {
        return new Room(this.roomId, this.peerId, this.metadata, this.onStreamAdded, this.onStreamAddedFail)
    }
}