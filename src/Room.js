import { uuidv4 } from './Utils'
import Client from './Client'
import Peer from 'peerjs'
export const PEER_KEY = 'peerjs'
export const PEER_HOST = 'webrtc.schoolaid.app'
export const PEER_PORT = 443
export const PEER_PATH = '/myapp'
export const CLIENT_DISCONNECTED = "CLIENT_DISCONNECTED"
export default class Room {
    constructor({ id, peerId = uuidv4(), metadata = {}, onStreamAdded, onStreamAddedFail, withAudio, videoConstraints, onLocalStream, api, onStreamRemoved }) {
        this.id = id
        this.isMuted = false
        this.isHidden = false
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
        this.onLocalStream = onLocalStream
        this.onStreamRemoved = onStreamRemoved
        this.api = api
        this.onOfferRecevied = (client) => { return true }
        this.onOfferAccepted = (client) => { }
        this.onOfferDennied = (client) => { }
        window.onbeforeunload = () => {
            this.close()
        };

    }

    connect(onSuccessFullConnection = () => { }, onError = () => { }) {
        let getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
        getUserMedia({ video: this.videoConstraints, audio: this.withAudio }, stream => {
            this.onLocalStream(stream)
            this.api.registerParticipant(this, () => {
                this.api.getParticipants(this, (response) => {

                    const participants = response.data.participants.filter(client => client.peer_id !== this.peerId)
                    this.listOfClientsToConnect = participants.map(client => client.peer_id)

                    this.clients = participants.map(client => new Client(client.peer_id, JSON.parse(client.metadata)))
                    if (this.peer == null) {
                        this.peer = new Peer(this.peerId, { key: PEER_KEY, host: PEER_HOST, port: PEER_PORT, path: PEER_PATH })
                    }
                    this.peer.on('disconnected', () => {

                    })
                    this.peer.on('close', () => {

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
                                    if (typeof data == "object") {
                                        switch (data.type) {
                                            case CLIENT_DISCONNECTED:
                                                this.clients = this.clients.filter(client => client.id !== data.peerId)
                                                this.onStreamRemoved(data.peerId)
                                                break
                                            default:
                                                console.log("Not expected type")
                                                break
                                        }
                                    }
                                })
                            })
                        })
                        this.peer.on('call', call => {
                            let callerId = call.metadata.id
                            if (!this.listOfClientsToConnect.includes(callerId)) {
                                this.listOfClientsToConnect.push(callerId)
                                this.clients.push(new Client(callerId, call.metadata, call))
                            } else {
                                this.clients.find(client => client.id === callerId).setCall(call)
                            }
                            if (this.onOfferRecevied()) {
                                call.answer(this.stream, this.metadata);
                                // this.onOfferAccepted()
                            } else {
                                this.close()
                            }
                            call.on('stream', (remoteStream) => {
                                if (this.clients.find(client => client.id === callerId).stream == null) {
                                    this.clients.find(client => client.id === callerId).setStream(remoteStream)
                                    this.onStreamAdded(this.clients.find(client => client.id === callerId), remoteStream)
                                }
                            });
                        });

                    })
                    this.peer.on('error', (err) => {
                        onError(err)
                    })
                }, error => {

                })
            }, error => {

            })
        }, (err) => {
            this.onStreamAddedFail({ id: this.peerId, metadata: this.metadata }, err)
        });
    }

    toggleMute() {
        if (this.stream) {
            this.isMuted = !this.isMuted
            this.stream.getAudioTracks().forEach(track => {
                track.enabled = !this.isMuted
                this.clients.forEach(client => {
                    if (client.call && this.stream) {
                        client.call.peerConnection.getSenders()
                            .find(sender => sender.track.kind == 'audio')
                            .replaceTrack(track)
                    }
                })
            })
        }
    }
    setIsMuted(bool) {
        if (this.stream) {
            this.isMuted = bool
            this.stream.getAudioTracks().forEach(track => {
                track.enabled = !this.isMuted
                this.clients.forEach(client => {
                    if (client.call && this.stream) {
                        client.call.peerConnection.getSenders()
                            .find(sender => sender.track.kind == 'audio')
                            .replaceTrack(track)
                    }
                })
            })
        }
    }
    toggleCamera() {
        if (this.stream) {
            this.isHidden = !this.isHidden
            this.stream.getVideoTracks().forEach(track => {
                track.enabled = !this.isHidden
                this.clients.forEach(client => {
                    if (client.call && this.stream) {
                        client.call.peerConnection.getSenders()
                            .find(sender => sender.track.kind == 'video')
                            .replaceTrack(track)
                    }
                })
            })
        }
    }
    setIsHidden(bool) {
        if (this.stream) {
            this.isHidden = bool
            this.stream.getVideoTracks().forEach(track => {
                track.enabled = !this.isHidden
                this.clients.forEach(client => {
                    if (client.call && this.stream) {
                        client.call.peerConnection.getSenders()
                            .find(sender => sender.track.kind == 'video')
                            .replaceTrack(track)
                    }
                })
            })
        }
    }

    close() {
        this.api.unregisterParticipant(this)
        this.clients.forEach(client => {
            client.call.close()
            client.connection.send({ type: CLIENT_DISCONNECTED, peerId: this.peerId })
        })
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
                        if (typeof data == "object") {
                            switch (data.type) {
                                case CLIENT_DISCONNECTED:
                                    this.clients = this.clients.filter(client => client.id !== data.peerId)
                                    this.onStreamRemoved(data.peerId)
                                    break
                                default:
                                    console.log("Not expected type")
                                    break
                            }
                        }
                    })
                })
                clientSelected.setConnection(conn)
                this.stream = stream
                call.on("stream", remoteStream => {
                    if (this.clients.find(client => client.id === connectId).stream == null) {
                        this.clients.find(client => client.id === connectId).setStream(remoteStream)
                        this.onStreamAdded(this.clients.find(client => client.id === connectId), remoteStream)
                    }

                });
                // call.on('error', error => {
                // })
            },
            () => {
                //Error callback when stream
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