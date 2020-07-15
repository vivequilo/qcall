/**
 * It is a class wich allows to easily build a Room instance to use.
 *
 * It is a builder class.
 *
 * @author Augusto Alonso.
 */


import { uuidv4 } from './Utils'
import Room from './Room'
/**
 * @constant VideoQualities
 * Constant of video qualities
 */
export const VideoQualities = {
    FULL_HD: { width: 1920, height: 1080 },
    HD: { width: 1280, height: 720 },
    SD: { width: 640, height: 480 },
    LOW: { width: 480, height: 360 },
}

/**
 * @constant FacingModes
 * Constant with facing modes
 */
export const FacingModes = {
    FRONT_CAMERA: 'user',
    BACK_CAMERA: 'environment'
}

/**
 * @constant FrameRates
 * Constant of frame rates values
 */
export const FrameRates = {
    LOW: 15,
    STANDARD: 25,
    GOOD: 30,
    HIGH: 45,
    MAX: 60
}
export default class RoomBuilder {
    /**
     * @class
     */
    constructor(id) {
        this.id = id
        this.peerId = uuidv4()
        this.metadata = {}
        this.withAudio = true
        this.videoConstraints = {
            frameRate: {
                ideal: FrameRates.GOOD, min: FrameRates.LOW, max: FrameRates.HIGH
            },
            facingMode: FacingModes.BACK_CAMERA,
            width: {
                max: VideoQualities.HD.width, min: VideoQualities.LOW.width, ideal: VideoQualities.SD.width
            },
            height: {
                max: VideoQualities.HD.height, min: VideoQualities.LOW.height, ideal: VideoQualities.SD.height
            }
        }
        this.onStreamAdded = () => { }
        this.onStreamDennied = () => { }
    }

    /**
     * Setter of the peerid
     * @param {String} peerId unique peerId value
     */
    setPeerId(peerId) {
        this.peerId = peerId
        return this
    }
    /**
     * Setter if the input will have audio
     * @param {Boolean} withAudio Has audio value
     */
    setWithAudtio(withAudio) {
        this.withAudio = withAudio
        return this
    }
    /**
     *  Setter of the metadata of the current client
     * @param {object} metadata The metadata wich will be available for everybody
     */
    setMetadata(metadata) {
        this.metadata = metadata
        return this
    }

    /**
     * Sets the callback when a remote stream is added.
     * @param {onStreamAdded} onStreamAdded The function parameter wich revieves two optional parameters
     * @param {String} id The peer id of the caller is a parameter of onStreamAdded
     * @param {MediaStream} remoteStream The remote stream added is the second parameter of onStreamAdded
     */
    setOnStreamAdded(onStreamAdded) {
        this.onStreamAdded = onStreamAdded
        return this
    }
    /** Sets the callback when the stream is dennied
     * @param {Function} onStreamDennied The function parameter can recieve two optional parameters
     * @param {object} data { id: 'peerId', metadata: 'metadata of the current user' } is a parameter of onStreamDennied
     * @param {Error} error Error instance  is a parameter of onStreamDennied
     */
    setOnStreamDennied(onStreamDennied) {
        this.onStreamDennied = onStreamDennied
        return this
    }

    /**
     * Sets max video quality constraints
     * @param {object} qualityConstraints one of VideoQualities constants or a custom object with height, widht keys
     */
    setMaxVideoQuality(qualityConstraints) {
        if (typeof qualityConstraints == 'object') {
            this.videoConstraints = {
                ...this.videoConstraints,
                width: {
                    ... this.videoConstraints.width,
                    max: qualityConstraints.width
                },
                height: {
                    ... this.videoConstraints.height,
                    max: qualityConstraints.height
                },
            }
        }
    }

    /**
     * Sets min video quality constraints
     * @param {object} qualityConstraints one of VideoQualities constants or a custom object with height, widht keys
     */
    setMinVideoQuality(qualityConstraints) {
        if (typeof qualityConstraints == 'object') {
            this.videoConstraints = {
                ...this.videoConstraints,
                frameRate: {
                    ... this.videoConstraints.width,
                    min: qualityConstraints.width
                },
                height: {
                    ... this.videoConstraints.height,
                    min: qualityConstraints.height
                },
            }
        }
    }

    /**
     * Sets ideal video quality constraints
     * @param {object} qualityConstraints one of VideoQualities constants or a custom object with height, widht keys
     */
    setIdealVideoQuality(qualityConstraints) {
        if (typeof qualityConstraints == 'object') {
            this.videoConstraints = {
                ...this.videoConstraints,
                width: {
                    ... this.videoConstraints.width,
                    ideal: qualityConstraints.width
                },
                height: {
                    ... this.videoConstraints.height,
                    ideal: qualityConstraints.height
                },
            }
        }
    }

    /**
     * Setter of the ideal  frame rate
     * @param {Number} rate ideal frame rate to set
     */
    setIdealFrameRate(rate) {
        if (typeof rate == 'number') {
            this.videoConstraints = {
                ...this.videoConstraints,
                frameRate: {
                    ... this.videoConstraints.frameRate,
                    ideal: rate
                }
            }
        }
    }

    /**
     * Setter of the max frame rate
     * @param {Number} rate max frame rate to set
     */
    setMaxFrameRate(rate) {
        if (typeof rate == 'number') {
            this.videoConstraints = {
                ...this.videoConstraints,
                frameRate: {
                    ... this.videoConstraints.frameRate,
                    max: rate
                }
            }
        }
    }

    /**
     * Setter of the min frame rate
     * @param {Number} rate min frame rate to set
     */
    setMinFrameRate(rate) {
        if (typeof rate == 'number') {
            this.videoConstraints = {
                ...this.videoConstraints,
                frameRate: {
                    ... this.videoConstraints.frameRate,
                    min: rate
                }
            }
        }
    }


    /**
     * Sets the initial facing mode
     * @param {String} fm Facing mode of the video
     */
    setFacingMode(fm) {
        if (fm === 'user' || fm === 'enviorment') {
            this.videoConstraints = {
                ...this.videoConstraints,
                facingMode: fm
            }
        }
    }

    /**
    * Builds the Room instance
    *  @return {Room} Return Room class.
    */
    build() {
        return new Room(this.id, this.peerId, this.metadata, this.onStreamAdded, this.onStreamDennied, this.withAudio, this.videoConstraints)
    }
}