function RemoteVideo(remoteVideoElem, videoLoader, videoStats) {
    this.streaming = null;
    this.remoteVideoElem = remoteVideoElem;
    this.videoLoader = videoLoader;
    this.videoStats = videoStats;
    this.stream = null;
    this.mountpointId = null;

    this.videoResolution = null;
    this.isVideoAlreadyPlayed = false;

    var obj = this;  // for event handlers

    this.getStreamVideotracks = function(){
        console.log('stream', this.stream);
        return this.stream ? this.stream.getVideoTracks() : [];
    }

    this.noRemoteVideo = function () {
        if (!this.isVideoAlreadyPlayed || window.debugUtils.isDebugEnabled()) {
            console.log('no video: videoLoader.show');
            this.videoLoader.show();
        }
        console.debug('video: no remote');
    }

    this.hasRemoteVideo = function () {
        this.videoLoader.hide();
        console.debug('video: has remote');
    }

    this.setStreamingPluginHandle = function(streaming){
        this.streaming = streaming;
    }

    this.setResolution = function(w, h){
        this.videoResolution = [w, h];
        this.remoteVideoElem.attr('width', w).attr('height', h);
    }

    this.setStream = function (stream) {
        let streamChanged = false;
        if (this.stream !== stream) {
            console.log('this.stream !== stream');
            this.stream = stream;
            streamChanged = true;
        }
console.log('this.getStreamVideotracks().length: ' + this.getStreamVideotracks().length);
        if (this.getStreamVideotracks().length > 0) {
            if (streamChanged) {
                console.log('streamChanged');
                Janus.attachMediaStream(this.remoteVideoElem.get(0), this.stream);
            }
            this.hasRemoteVideo();
            if (['chrome', 'firefox', 'safari'].indexOf(Janus.webRTCAdapter.browserDetails.browser) >= 0) {
                console.log('this.videoStats.start');
                this.videoStats.start();
            }
        } else {
            console.log('noRemoteVideo');
            this.noRemoteVideo();
            this.videoStats.stop();
        }
    }

    this.startStreamMountpoint = function (mountpointId, pin) {
        this.mountpointId = mountpointId;
        console.info("streaming: starting mountpoint id " + mountpointId + ' with pin ' + pin);

        var body = {"request": "watch", "id": mountpointId, "pin": pin};
        console.log("message: "+ body);
        this.streaming.send({"message": body});
        this.noRemoteVideo();
    }

    this.remoteVideoElem.on("playing", function (e) {
        comsole.log('remoteVideoElem on playing');
        console.debug('video: playing event', e);

        if (obj.getStreamVideotracks().length > 0) {
            console.log('obj.getStreamVideotracks().length: ' + obj.getStreamVideotracks().length);
            obj.videoStats.start();
            remoteVideoElem = obj.remoteVideoElem.get(0);
            obj.setResolution(remoteVideoElem.videoWidth, remoteVideoElem.videoHeight);
            obj.isVideoAlreadyPlayed = true;
        } else {
            console.log('obj.videoStats.stop');
            obj.videoStats.stop();
        }
    });

    this.stopStreaming = function () {
        console.info('video: stopping streaming');
        this.streaming.send({"message": {"request": "stop"}});
        this.streaming.hangup();
        this.cleanup();
    }

    this.cleanup = function () {
        console.info('video: cleanup ..');
        this.videoStats.stop();
    }
}
