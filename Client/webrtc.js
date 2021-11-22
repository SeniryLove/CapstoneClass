var constraints = {
    'video': false,
    'audio': false
};
var ss="";

function handleSuccess(stream) {
  const video = document.querySelector('video');
  const videoTracks = stream.getVideoTracks();
  console.log('Got stream with constraints:', constraints);
  console.log(`Using video device: ${videoTracks[0].label}`);
  window.stream = stream; // make variable available to browser console
  video.srcObject = stream;
}

function handleError(error) {
	
  if (error.name === 'OverconstrainedError') {
    const v = constraints.video;
    errorMsg(`The resolution ${v.width.exact}x${v.height.exact} px is not supported by your device.`);
  } else if (error.name === 'NotAllowedError') {
    errorMsg('Permissions have not been granted to use your camera and ' +
      'microphone, you need to allow the page access to your devices in ' +
      'order for the demo to work.');
  }
  errorMsg(`getUserMedia error: ${error.name}`, error);
  constraints[ss] = false;
}

function errorMsg(msg, error) {
  console.log(msg);
  if (typeof error !== 'undefined') {
    console.error(error);
  }
}

function changeConstraints(sss){
	ss = sss;
	constraints[ss] = true;
	navigator.mediaDevices.getUserMedia(constraints).then(handleSuccess,handleError);
}

