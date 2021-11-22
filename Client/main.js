/*
*  Copyright (c) 2015 The WebRTC project authors. All Rights Reserved.
*
*  Use of this source code is governed by a BSD-style license
*  that can be found in the LICENSE file in the root of the source
*  tree.
*/

'use strict';

const videoElement = document.querySelector('#leftVideo');
const audioInputSelect = document.querySelector('select#audioSource');
const audioOutputSelect = document.querySelector('select#audioOutput');
const videoSelect = document.querySelector('select#videoSource');
const selectors = [audioInputSelect, audioOutputSelect, videoSelect];

audioOutputSelect.disabled = !('sinkId' in HTMLMediaElement.prototype);

function gotDevices(deviceInfos) {
	console.log(deviceInfos);
  // Handles being called several times to update labels. Preserve values.
  const values = selectors.map(select => select.value);
  selectors.forEach(select => {
    while (select.firstChild) {
      select.removeChild(select.firstChild);
    }
  });
  for (let i = 0; i !== deviceInfos.length; ++i) {
    const deviceInfo = deviceInfos[i];
    const option = document.createElement('option');
    option.value = deviceInfo.deviceId;
    if (deviceInfo.kind === 'audioinput') {
      option.text = deviceInfo.label || `microphone ${audioInputSelect.length + 1}`;
      audioInputSelect.appendChild(option);
    } else if (deviceInfo.kind === 'audiooutput') {
      option.text = deviceInfo.label || `speaker ${audioOutputSelect.length + 1}`;
      audioOutputSelect.appendChild(option);
    } else if (deviceInfo.kind === 'videoinput') {
      option.text = deviceInfo.label || `camera ${videoSelect.length + 1}`;
      videoSelect.appendChild(option);
    } else {
      console.log('Some other kind of source/device: ', deviceInfo);
    }
  }
  selectors.forEach((select, selectorIndex) => {
    if (Array.prototype.slice.call(select.childNodes).some(n => n.value === values[selectorIndex])) {
      select.value = values[selectorIndex];
    }
  });
}

navigator.mediaDevices.enumerateDevices().then(gotDevices).catch(handleError);

// Attach audio output device to video element using device/sink ID.
function attachSinkId(element, sinkId) {
  if (typeof element.sinkId !== 'undefined') {
    element.setSinkId(sinkId)
        .then(() => {
          console.log(`Success, audio output device attached: ${sinkId}`);
        })
        .catch(error => {
          let errorMessage = error;
          if (error.name === 'SecurityError') {
            errorMessage = `You need to use HTTPS for selecting audio output device: ${error}`;
          }
          console.error(errorMessage);
          // Jump back to first output device in the list as it's the default.
          audioOutputSelect.selectedIndex = 0;
        });
  } else {
    console.warn('Browser does not support output device selection.');
  }
}

function changeAudioDestination() {
  const audioDestination = audioOutputSelect.value;
  attachSinkId(videoElement, audioDestination);
}

function gotStream(stream) {
  window.stream = stream; // make stream available to console
  videoElement.srcObject = stream;
  // Refresh button list in case labels have become available
  return navigator.mediaDevices.enumerateDevices();
}

function handleError(error) {
  console.log('navigator.MediaDevices.getUserMedia error: ', error.message, error.name);
}

function start() {
  if (window.stream) {
    window.stream.getTracks().forEach(track => {
      track.stop();
    });
  }
  const audioSource = audioInputSelect.value;
  const videoSource = videoSelect.value;
  const constraints = {
    audio: {deviceId: audioSource ? {exact: audioSource} : undefined},
    video: {deviceId: videoSource ? {exact: videoSource} : undefined}
  };
  navigator.mediaDevices.getUserMedia(constraints).then(gotStream).then(gotDevices).catch(handleError);
}

audioInputSelect.onchange = start;
audioOutputSelect.onchange = changeAudioDestination;

videoSelect.onchange = start;

start();

const leftVideo_2 = document.getElementById('leftVideo');
const leftVideo = document.getElementById('leftVideo');
const rightVideo = document.getElementById('rightVideo');

let stream;
let stream_2;
let pc1;
let pc2;
let pc3;
const offerOptions = {
  offerToReceiveAudio: 1,
  offerToReceiveVideo: 1
};

let startTime;

function maybeCreateStream() {
  if (stream) {
    return;
  }
  if (leftVideo.captureStream) {
    stream = leftVideo.captureStream();
	stream_2 = leftVideo_2.captureStream();
    console.log('Captured stream from leftVideo with captureStream',
        stream);
	console.log('Captured stream from leftVideo with captureStream',
        stream_2);
    call();
  } else if (leftVideo.mozCaptureStream) {
    stream = leftVideo.mozCaptureStream();
    console.log('Captured stream from leftVideo with mozCaptureStream()',
        stream);
    call();
  } else {
    console.log('captureStream() not supported');
  }
}

// Video tag capture must be set up after video tracks are enumerated.
leftVideo.oncanplay = maybeCreateStream;
if (leftVideo.readyState >= 3) { // HAVE_FUTURE_DATA
  // Video is already ready to play, call maybeCreateStream in case oncanplay
  // fired before we registered the event handler.
  maybeCreateStream();
}

leftVideo.play();

rightVideo.onloadedmetadata = () => {
  console.log(`Remote video videoWidth: ${rightVideo.videoWidth}px,  videoHeight: ${rightVideo.videoHeight}px`);
};

rightVideo.onresize = () => {
  console.log(`Remote video size changed to ${rightVideo.videoWidth}x${rightVideo.videoHeight}`);
  // We'll use the first onresize callback as an indication that
  // video has started playing out.
  if (startTime) {
    const elapsedTime = window.performance.now() - startTime;
    console.log('Setup time: ' + elapsedTime.toFixed(3) + 'ms');
    startTime = null;
  }
};

function call() {
  console.log('Starting call');
  startTime = window.performance.now();
  const videoTracks = stream.getVideoTracks();
  const audioTracks = stream.getAudioTracks();
  const videoTracks_2 = stream_2.getVideoTracks();
  const audioTracks_2 = stream_2.getAudioTracks();
  if (videoTracks.length > 0) {
    console.log(`Using video device: ${videoTracks[0].label}`);
  }
  if (audioTracks.length > 0) {
    console.log(`Using audio device: ${audioTracks[0].label}`);
  }
  if (videoTracks_2.length > 0) {
    console.log(`Using video device: ${videoTracks_2[0].label}`);
  }
  if (audioTracks_2.length > 0) {
    console.log(`Using audio device: ${audioTracks_2[0].label}`);
  }
  const servers = null;
  /*
  pc1 = new RTCPeerConnection(servers);
  console.log('Created local peer connection object pc1');
  pc1.onicecandidate = e => onIceCandidate(pc1, e);
  */
  pc3 = new RTCPeerConnection(servers);
  console.log('Created local peer connection object pc3');
  pc3.onicecandidate = e => onIceCandidate(pc3, e);
  pc2 = new RTCPeerConnection(servers);
  console.log('Created remote peer connection object pc2');
  pc2.onicecandidate = e => onIceCandidate(pc2, e);
  /*
  pc1.oniceconnectionstatechange = e => onIceStateChange(pc1, e);
  */
  pc3.oniceconnectionstatechange = e => onIceStateChange(pc3, e);
  pc2.oniceconnectionstatechange = e => onIceStateChange(pc2, e);
  pc2.ontrack = gotRemoteStream;
/*
  stream.getTracks().forEach(track => pc1.addTrack(track, stream));
  console.log('Added local stream to pc1');
  */
  stream_2.getTracks().forEach(track => pc3.addTrack(track, stream_2));
  console.log('Added local stream to pc3');
/*
  console.log('pc1 createOffer start');
  pc1.createOffer(onCreateOfferSuccess, onCreateSessionDescriptionError, offerOptions);
  */
  console.log('pc3 createOffer start');
  pc3.createOffer(onCreateOfferSuccess, onCreateSessionDescriptionError, offerOptions);
}

function onCreateSessionDescriptionError(error) {
  console.log(`Failed to create session description: ${error.toString()}`);
}

function onCreateOfferSuccess(desc) {
  console.log(`Offer from pc3
${desc.sdp}`);
/*
  console.log('pc1 setLocalDescription start');
  pc1.setLocalDescription(desc, () => onSetLocalSuccess(pc1), onSetSessionDescriptionError);
  */
  console.log('pc3 setLocalDescription start');
  pc3.setLocalDescription(desc, () => onSetLocalSuccess(pc3), onSetSessionDescriptionError);
  console.log('pc2 setRemoteDescription start');
  pc2.setRemoteDescription(desc, () => onSetRemoteSuccess(pc2), onSetSessionDescriptionError);
  console.log('pc2 createAnswer start');
  // Since the 'remote' side has no media stream we need
  // to pass in the right constraints in order for it to
  // accept the incoming offer of audio and video.
  pc2.createAnswer(onCreateAnswerSuccess, onCreateSessionDescriptionError);
}

function onSetLocalSuccess(pc) {
  console.log(`${getName(pc)} setLocalDescription complete`);
}

function onSetRemoteSuccess(pc) {
  console.log(`${getName(pc)} setRemoteDescription complete`);
}

function onSetSessionDescriptionError(error) {
  console.log(`Failed to set session description: ${error.toString()}`);
}

function gotRemoteStream(event) {
  if (rightVideo.srcObject !== event.streams[0]) {
    rightVideo.srcObject = event.streams[0];
    console.log('pc2 received remote stream', event);
  }
}

function onCreateAnswerSuccess(desc) {
  console.log(`Answer from pc2:
${desc.sdp}`);
  console.log('pc2 setLocalDescription start');
  pc2.setLocalDescription(desc, () => onSetLocalSuccess(pc2), onSetSessionDescriptionError);
  /*
  console.log('pc1 setRemoteDescription start');
  pc1.setRemoteDescription(desc, () => onSetRemoteSuccess(pc1), onSetSessionDescriptionError);
  */
  console.log('pc3 setRemoteDescription start');
  pc3.setRemoteDescription(desc, () => onSetRemoteSuccess(pc3), onSetSessionDescriptionError);
}

function onIceCandidate(pc, event) {
  getOtherPc(pc).addIceCandidate(event.candidate)
      .then(
          () => onAddIceCandidateSuccess(pc),
          err => onAddIceCandidateError(pc, err)
      );
  console.log(`${getName(pc)} ICE candidate: 
${event.candidate ?
    event.candidate.candidate : '(null)'}`);
}

function onAddIceCandidateSuccess(pc) {
  console.log(`${getName(pc)} addIceCandidate success`);
}

function onAddIceCandidateError(pc, error) {
  console.log(`${getName(pc)} failed to add ICE Candidate: ${error.toString()}`);
}

function onIceStateChange(pc, event) {
  if (pc) {
    console.log(`${getName(pc)} ICE state: ${pc.iceConnectionState}`);
    console.log('ICE state change event: ', event);
  }
}

function getName(pc) {
	switch(pc)
	{
		case pc1:{
			return 'pc1'
		}break;
		case pc2:{
			return 'pc2'
		}break;
		case pc3:{
			return 'pc3'
		}break;
	}
}

function getOtherPc(pc) {
  switch(pc)
	{
		case pc1:{
			return pc2
		}break;
		case pc2:{
			return pc3
		}break;
		case pc3:{
			return pc2
		}break;
	}
}
