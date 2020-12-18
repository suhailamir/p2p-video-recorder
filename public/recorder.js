
function recorder(){

    const videoDOM = $('#localVideoTag')[0]    
    const stream = videoDOM.captureStream(60);
var recordedChunks = [];

console.log(stream);
var options = { mimeType: "video/webm; codecs=vp9" };
mediaRecorder = new MediaRecorder(stream, options);

mediaRecorder.ondataavailable = handleDataAvailable;
mediaRecorder.start();

function handleDataAvailable(event) {
  console.log("data-available",event.data.size );
  if (event.data.size > 0) {
    recordedChunks.push(event.data);
    console.log(recordedChunks);
    download();
  } else {
      console.log('unable to download')
    // ...
  }
}
function download() {
  var blob = new Blob(recordedChunks, {
    type: "video/webm"
  });
  var url = URL.createObjectURL(blob);
  var a = document.createElement("a");
  document.body.appendChild(a);
  a.style = "display: none";
  a.href = url;
  a.download = "test.webm";
  a.click();
  window.URL.revokeObjectURL(url);
}

// demo: to download after 9sec
setTimeout(event => {
  console.log("stopping");
  mediaRecorder.stop();
}, 9000);
}
