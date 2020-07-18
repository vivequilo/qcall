# QCall

## Complete example
```js
//Example of video tag
    <video
      srcObject="VIDEO_STREAM"
      id="myVideo"
      height="720"
      width="1280"
      autoplay
      controls
    ></video>
```

__Install QCall__
With __npm__   <img src="https://static.npmjs.com/b0f1a8318363185cc2ea6a40ac23eeb2.png" width="20"/>
```javascript
 npm install qcall
```
With __yarn__ <img src="https://yarnpkg.com/favicon-32x32.png?v=6143f50112ddba9fdb635b0af2f32aff" width="20">
```javascript
 yarn add qcall
```
## Room Builder


Builder class wich allows you to create a Room instance with the build pattern. By default this class has the current constraints:
```js
    /**
     * Room Builder cconstruct
     * @class
     * @param {String} id The room id
     * @param {String} deploy The scope provded to you by Quilo S.A.
     * @param {String} apiKey The api key provded to you by Quilo S.A.
     */
constructor(id, deploy, apiKey = null)
```
- VideoConstraints:
	- Height
		- max: __VideoQualities.HD.height__ = 720px
		- min: __VideoQualities.LOW.height__ = 360px
		- ideal: __VideoQualities.SD.height__ = 480px
    - Width
    	- max: __VideoQualities.HD.width__ = 1280px
		- min: __VideoQualities.LOW.width__ = 480px
		- ideal: __VideoQualities.SD.width__ = 640px 
	 - Frame Rate __(fps)__
    	- max: __FrameRates.HIGH__ = 45fps
		- min: __FrameRates.LOW__ = 15fps
		- ideal: __FrameRates.STANDARD__ = 25fps 
- withAudio = __True__

### Functions
Name | Parameters | Description
--- | --- | ---
setPeerId	| id: String | Sets the peerId manually. By default it is a uuid.
setWithAudio| withAudio: Boolean | Defines if the current stream will include audio.
setMetadata|metadata: Object|Sets the metadata of the caller wich will be shared through the clients of the room.
setOnLocalStream | (localCallerId, localStream) => Void : Function | Callback when the local stream is added. First parameter is the local peerId connected. Second parameter is the local [MediaStream](https://developer.mozilla.org/en-US/docs/Web/API/MediaStream) provided.
setOnStreamAdded | (caller, remoteStream) => Void : Function | Callback when a remote stream is added. First parameter is the remote caller Class instance connected. Second parameter is the remote [MediaStream](https://developer.mozilla.org/en-US/docs/Web/API/MediaStream) provided.
setOnStreamRemoved | (callerId) => Void : Function | Callback when a remote stream is removed (When a caller disconnnects from the meeting). The parameter is the remote id of the caller disconnected.
setOnStreamDennied | (data, error) => Void : Function | Callback when the user does not give permission to the current web page to get access to the camera and/or microphone. The __data__ (first parameter) value containts the current id and the metadata in an object instance, __error__ (second parameter) containts the error instance. This callback its main purpose is for to show a specific message if the user does not allow the permission.
setMaxVideoQuality | qualityConstraints : object | Sets the video max quality. Can be from __VideoQualities__ constants or it can be a custom value in px like {width : 100px, height: 100px }
setMinVideoQuality | qualityConstraints : object | Sets the video min quality. Can be from __VideoQualities__ constants or it can be a custom value in px like {width : 100px, height: 100px }
setIdealVideoQuality | qualityConstraints : object | Sets the video ideal quality. Can be from __VideoQualities__ constants or it can be a custom value in px like {width : 100px, height: 100px }
setIdealFrameRate | rate : Number | Sets the ideal frame rate. Can be from __FrameRates__ constants or it can be a custom value like 40fps
setMinFrameRate | rate : Number | Sets the min frame rate. Can be from __FrameRates__ constants or it can be a custom value like 10fps
setMaxFrameRate | rate : Number | Sets the max frame rate. Can be from __FrameRates__ constants or it can be a custom value like 100fps
setFacingMode | mode : String | Sets the facing mode for mobile users. It can be either __FacingModes.FRONT_CAMERA__ or __FacingModes.BACK_CAMERA__


#### Examples

Basic Example
```js
import { RoomBuilder } from "qcall";
/* Creates an instance of Room Class **/
const room = new RoomBuilder('roomId', 'deploy', 'apiKey')
        .setMetadata({ name: "Augusto Alonso" })
        .build()
```

Example defining custom video quility
```js
import { RoomBuilder, VideoQualities } from "qcall";
/* Creates an instance of Room Class **/
const room = new RoomBuilder('roomId', 'deploy', 'apiKey')
        .setMetadata({ name: "Paquito Pedroza" })
        .setMaxVideoQuality(VideoQualities.FULL_HD)
        .setMinVideoQuality(VideoQualities.HD)
        .setIdealVideoQuality(VideoQualities.FULL_HD)
        .build()
/* Another way to build it with custom video quality
is by passing an object with the width and height dimensions in pixels
**/
const FourK = { width: 3840, height: 2160 }
const room = new RoomBuilder('roomId', 'deploy', 'apiKey')
        .setMetadata({ name: "Paquito Pedroza" })
        .setMaxVideoQuality(FourK)
        .build()
```

Example defining custom frame rate

```js
import { RoomBuilder, VideoQualities, FrameRates } from "qcall";
/* Creates an instance of Room Class **/
const room = new RoomBuilder('roomId', 'deploy', 'apiKey')
        .setMetadata({ name: "Paquito Pedroza" })
        .setMaxVideoQuality(VideoQualities.FULL_HD)
       	.setMinFrameRate(FrameRates.GOOD)
        .setIdealFrameRate(FrameRates.HIGH)
        .setMaxFrameRate(FrameRates.MAX)
        .build()
/* Another way is passing the raw frame rate value desired **/
const room = new RoomBuilder('roomId', 'deploy', 'apiKey')
        .setMaxFrameRate(35)
        .build()
```

Want to stream without audio
```js
import { RoomBuilder } from "qcall";
/* Creates an instance of Room Class **/
const room = new RoomBuilder('roomId', 'deploy', 'apiKey')
		.setWithAudtio(false)       
        .build()
```

Setting a onStreamDennied callback for our __Room__ class
```js
import { RoomBuilder } from "qcall";
/* Creates an instance of Room Class **/
const room = new RoomBuilder('roomId', 'deploy', 'apiKey')
		.setMetadata({ name: 'Juice WRLD', profession: 'Musician'})
		.setOnStreamDennied((data, error) => {
        //Function where you alert and show an alert that the user MUST give 
        //the permission to the web page to record the camera and microphone
        	alertUserPermissionsNeeded()
            console.log(`The ${data.profession} ${data.name} did not consent permission to record`)
            //Output:
            //The Musician Juice WRLD did not consent permission to record
        })       
        .build()
```
Want to specify custom peerId (each one must be unique by default an uuid is set)
```js
import { RoomBuilder } from "qcall";
/* Creates an instance of Room Class **/
const room = new RoomBuilder('roomId', 'deploy', 'apiKey')
		.setPeerId(user.id)       
        .build()
```

## Room Class
 
### Properties
Property | Property Type | Description 
--- | --- | ---
stream | [MediaStream](https://developer.mozilla.org/en-US/docs/Web/API/MediaStream) | The Media stream instance of the local caller.
videoStream (getter) | [MediaStream](https://developer.mozilla.org/en-US/docs/Web/API/MediaStream) | Stream only with video of the local client excludes the audio without affecting the original stream. If the stream has not been set yet returns null
audioStream (getter) | [MediaStream](https://developer.mozilla.org/en-US/docs/Web/API/MediaStream) | Stream only with audio of the local client excludes the audio without affecting the original stream. If the stream has not been set yet returns nullnt clients using the room.
peer | [PeerJs](https://peerjs.com/) | Peer js instance
isMuted | boolean | Tells if the mic is currently muted
isHidden | boolean | Tells if the camera is currently hidden



### Functions
Name | Parameters | Description
--- | --- | ---
connect	| Does not have parameters | When this function is calles it connects the current cleint to the room and retrieves the list of clients wich where already connected to it. It handles the connection to each of the clients in the call.
close| Does not  have parameters | Closes the connection with each one of the clients. Also disconnects the peer.
toggleMute| Does not have parameters | Toggle the mic on or off
setIsMuted| bool: Boolean | Sets to a specific value if mic is muted
toggleCamera| Does not have parameters | Toggle the video on or off
setIsHidden| bool: Boolean | Sets to a specific value if video is hidden


## Client Class

### Properties
Property | Property Type | Description 
--- | --- | ---
metadata | Object | Containts the metadata set in the __RoomBuilder__ class.
stream | [MediaStream](https://developer.mozilla.org/en-US/docs/Web/API/MediaStream) | The Media stream instance of the remote caller.
connection | [MediaConnection](https://peerjs.com/docs.html#mediaconnection) | The connection with the remote caller.
call | [MediaConnection](https://peerjs.com/docs.html#mediaconnection) | The connection with the remote caller.
videoTrack (getter) | [MediaStreamTrack](https://developer.mozilla.org/en-US/docs/Web/API/MediaStreamTrack) | Video Track of the current stream instance from the remote client in the room. If the stream has not been set yet returns null
videoTracks (getter) | Array<[MediaStreamTrack](https://developer.mozilla.org/en-US/docs/Web/API/MediaStreamTrack)> | All the video tracks from the remote client. If stream has not been set returns []
audioTrack (getter) | [MediaStreamTrack](https://developer.mozilla.org/en-US/docs/Web/API/MediaStreamTrack) | Audio Track of the current stream instance from the remote client in the room. If the stream has not been set yet returns null
audioTracks (getter) | Array<[MediaStreamTrack](https://developer.mozilla.org/en-US/docs/Web/API/MediaStreamTrack)> | All the audio tracks from the remote client. If stream has not been set returns []
peerId | String | The peer connection id of the remote caller
clients | Array of Clients| Array that containts all the current clients using the room.
peer | [PeerJs](https://peerjs.com/) | Peer js instance

## Diagram of callbacks in Room Builder Class
<img src="https://i.ibb.co/0JMHtC5/flow.png" width="400"/>

