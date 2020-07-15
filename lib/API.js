import axios from "axios";

export default class API {
    constructor(XAPIKEY, deploy) {
        this.XAPIKEY = XAPIKEY
        this.deploy = deploy
    }

    getParticipants(room, onSucccess, onError) {
        axios.post(this.getBaseUrl, {
            action: 'list',
            room_id: room.id,
            peer_id: room.peerId,
            metadata: room.metadata
        }, {
            headers: { 'X-API-Key': this.XAPIKEY }
        }).then(registerResponse => {
            onSucccess(registerResponse)
        }).catch(error => {
            onError(error)
        })
    }
    registerParticipant(room, onSucccess, onError) {
        axios.post(this.getBaseUrl, {
            action: 'register',
            room_id: room.id,
            peer_id: room.peerId,
            metadata: room.metadata
        }, {
            headers: { 'X-API-Key': this.XAPIKEY }
        }).then(responnse => {
            onSucccess(responnse)
        }).catch(error => {
            onError(error)
        })
    }

    unregisterParticipant(room) {
        fetch(this.getBaseUrl, {
            method: "POST",
            headers: {
                'X-API-Key': this.XAPIKEY,
                "Content-Type": "application/json;"
            },
            body: JSON.stringify({
                action: 'unregister',
                room_id: room.id,
                peer_id: room.peerId,
                metadata: room.metadata
            }),
            keepalive: true,
        })
        // .then(r => r.json())
        // .then(response  => {
        //     onSucccess(response)
        // })
        // .catch()
    }

    get getBaseUrl() {
        return `https://6wnvsov233.execute-api.us-east-2.amazonaws.com/${this.deploy}/room-participants`
    }

} 