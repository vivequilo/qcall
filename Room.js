import { uuidv4 } from './Utils'
import Client from './Client'
export const PEER_KEY = 'peerjs'
export const PEER_HOST = 'webrtc.schoolaid.app'
export const PEER_PORT = 443
export const PEER_PATH = '/myapp'
export default class Room {
    constructor(id, peerId = uuidv4(), metadata = {}, onStreamAdded, onStreamAddedFail, withAudio, videoConstraints) {
        this.id = id
        this.peerId = peerId
        this.metadata = metadata
        this.stream = null
        this.onStreamAdded = onStreamAdded
        this.onStreamAddedFail = onStreamAddedFail
        this.clients = []
        this.listOfClientsToConnect = []
        this.peer = null
        this.withAudio = withAudio
        this.videoConstraints = videoConstraints
        window.onbeforeunload = (e) => {
            this.close()
        };

    }

    connect(onSuccessFullConnection = () => { }, onError = () => { }, onErrorCall = () => { }) {
        var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
        getUserMedia({ video: this.videoConstraints, audio: this.withAudio }, stream => {
            //lambda Call to register and get clients
            // let listOfClientsToConnect = ["1", "2", "3"]
            console.log(stream.getVideoTracks())
            console.log(stream)
            this.clients = this.listOfClientsToConnect.map(client => new Client(client.id, client.metadata))
            if (this.peer == null) {
                this.peer = new Peer(
                    this.peerId,
                    {
                        key: PEER_KEY,
                        host: PEER_HOST,
                        port: PEER_PORT,
                        path: PEER_PATH
                    }
                )
            }
            this.peer.on('disconnected', () => {

            })
            this.peer.on('open', (id) => {
                onSuccessFullConnection(id)
                this.clients.forEach(client => this.streamToPeer(client))

                this.stream = stream
                this.peer.on('connection', conn => {
                    let callerId = conn.metadata.id
                    if (!this.listOfClientsToConnect.includes(callerId)) {
                        this.listOfClientsToConnect.push(callerId)
                        this.clients.push(new Client(callerId, conn.metadata, null, null, conn))
                    } else {
                        this.clients.find(client => client.id === callerId).setConnection(conn)
                    }
                    conn.on('open', () => {
                        conn.on('data', data => {
                            if (data === 'closed') {
                                this.clients = this.clients.filter(client => client.id !== callerId)
                            }
                        })
                    })
                })
                this.peer.on('call', call => {
                    let callerId = call.metadata.id
                    call.answer(this.stream, this.metadata);
                    if (!this.listOfClientsToConnect.includes(callerId)) {
                        this.listOfClientsToConnect.push(callerId)
                        this.clients.push(new Client(callerId, call.metadata, call))
                    } else {
                        this.clients.find(client => client.id === callerId).setCall(call)
                    }
                    call.on('stream', (remoteStream) => {
                        this.onStreamAdded(callerId, remoteStream)
                        this.clients.find(client => client.id === callerId).setStream(remoteStream)
                    });
                });

            })
            this.peer.on('error', onError)
        }, (err) => {
            this.onStreamAddedFail({ id: this.peerId, metadata: this.metadata }, err)
        });
    }

    close() {
        this.clients.forEach(client => client.call.close())
        this.clients.forEach(client => client.connection.send('closed'))
        if (this.peer != null) {
            this.peer.disconnect()
        }
    }

    streamToPeer(client) {
        const connectId = client.id
        let getUserMedia =
            navigator.getUserMedia ||
            navigator.webkitGetUserMedia ||
            navigator.mozGetUserMedia
        getUserMedia({ video: this.videoConstraints, audio: this.withAudio },
            stream => {
                let call = this.peer.call(connectId, stream, { metadata: { id: this.peerId, ...this.metadata } });
                let conn = this.peer.connect(connectId, { metadata: { id: this.peerId, ...this.metadata } });
                let clientSelected = this.clients.find(client => client.id === connectId)
                clientSelected.setCall(call)
                conn.on('open', () => {
                    conn.on('data', data => {
                        if (data === 'closed') {
                            this.clients = this.clients.filter(client => client.id !== connectId)
                        }
                    })
                })
                clientSelected.setConnection(conn)
                this.stream = stream
                call.on("stream", remoteStream => {
                    this.onStreamAdded(connectId, remoteStream)
                    this.clients.find(client => client.id === connectId).setStream(remoteStream)
                });
                // call.on('error', error => {
                // })
            },
            err => {
                // this.onStreamAddedFail({ id: this.peerId, metadata: this.metadata }, err)
            }
        );
    }

    get videoStream() {
        if (this.stream) {
            let holder = this.stream.clone()
            if (holder.getAudioTracks().length > 0) {
                holder.getAudioTracks().forEach(track => holder.removeTrack(track))
            }
            return holder
        }
        return null
    }
    get audioStream() {
        if (this.stream) {
            let holder = this.stream.clone()
            if (holder.getVideoTracks().length > 0) {
                holder.getVideoTracks().forEach(track => holder.removeTrack(track))
            }
            return holder
        }
        return null
    }
}