import { uuidv4 } from './Utils'
import QuiloPeer, { PEER_KEY, PEER_HOST, PEER_PORT, PEER_PATH } from './QuiloPeer'
class Room {
    constructor(roomId, peerId = uuidv4(), metadata = {}, onStreamAdded, onStreamAddedFail) {
        this.roomId = roomId
        this.peerId = peerId
        this.metadata = metadata
        this.onStreamAdded = onStreamAdded
        this.onStreamAddedFail = onStreamAddedFail
        this.clients = []
    }

    connect(onSuccessFullConnection = (id) => { }, onError = (error) => { }, onErrorCall = error = {}) {
        //lambda Call to register and get clients
        let listOfClientsToConnect = []
        this.clients = listOfClientsToConnect.map(client => new Client(client.id, client.metadata))
        this.peer = new Peer(
            this.peerId,
            {
                key: PEER_KEY,
                host: PEER_HOST,
                port: PEER_PORT,
                path: PEER_PATH
            }
        )
        this.peer.on('open', onSuccessFullConnection)
        this.peer.on('error', onError)
        this.clients.forEach(client => this.streamToPeer(client))
        var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
        this.peer.on('call', call => {
            getUserMedia({ video: true, audio: true }, stream => {
                let callerId = call.metadata.id
                call.answer(stream, this.metadata);
                this.clients.push(new Client(callerId, call.metadata, call))
                call.on('stream', function (remoteStream) {
                    this.onStreamAdded(callerId, remoteStream)
                    this.clients.find(client => client.id === callerId).setStream(remoteStream)
                });
            }, (err) => {
                onErrorCall(err)
            });
        });
    }

    close() {
        this.clients.forEach(client => client.id === callerId).setCall(call)
    }

    streamToPeer(client) {
        const meta = client.meta
        const connectId = client.id
        let getUserMedia =
            navigator.getUserMedia ||
            navigator.webkitGetUserMedia ||
            navigator.mozGetUserMedia
        getUserMedia(
            { video: { width: 1280, height: 720 }, audio: true },
            stream => {
                let call = this.peer.call(connectId, stream, { metadata: { id: this.peerId, ...meta } });
                this.clients.find(client => client.id === callerId).setCall(call)
                this.stream = stream
                call.on("stream", remoteStream => {
                    this.onStreamAdded(callerId, remoteStream)
                    this.clients.find(client => client.id === callerId).setStream(remoteStream)
                });
            },
            err => {
                this.onStreamAddedFail(client, err)
            }
        );
    }
}