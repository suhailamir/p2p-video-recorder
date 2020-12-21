
/*
*  Copyright (c) 2015 The WebRTC project authors. All Rights Reserved.
*
*  Use of this source code is governed by a BSD-style license
*  that can be found in the LICENSE file in the root of the source
*  tree.
*/

// This code is adapted from
// https://rawgit.com/Miguelao/demos/master/mediarecorder.html

'use strict';

/* globals MediaRecorder */

let mediaRecorder;
let recordedBlobs;


const recordButton = document.querySelector('button#record');
recordButton.addEventListener('click', () => {
  if (recordButton.textContent === 'Start Recording') {
    startRecording();
  } else {
    stopRecording();
    recordButton.textContent = 'Start Recording';
    // playButton.disabled = false;
    downloadButton.disabled = false;
  }
});


const downloadButton = document.querySelector('button#download');
downloadButton.addEventListener('click', () => {
  const blob = new Blob(recordedBlobs, { type: 'video/webm' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.style.display = 'none';
  a.href = url;
  a.download = 'test.webm';
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }, 100);
});

function handleDataAvailable(event) {
  console.log('handleDataAvailable', event);
  if (event.data && event.data.size > 0) {
    recordedBlobs.push(event.data);
  }
}

function startRecording() {
  recordedBlobs = [];
  let options = { mimeType: 'video/webm;codecs=vp9,opus' };
  if (!MediaRecorder.isTypeSupported(options.mimeType)) {
    console.error(`${options.mimeType} is not supported`);
    options = { mimeType: 'video/webm;codecs=vp8,opus' };
    if (!MediaRecorder.isTypeSupported(options.mimeType)) {
      console.error(`${options.mimeType} is not supported`);
      options = { mimeType: 'video/webm' };
      if (!MediaRecorder.isTypeSupported(options.mimeType)) {
        console.error(`${options.mimeType} is not supported`);
        options = { mimeType: '' };
      }
    }
  }

  try {
    mediaRecorder = new MediaRecorder(window.stream, options);
  } catch (e) {
    console.error('Exception while creating MediaRecorder:', e);
    errorMsgElement.innerHTML = `Exception while creating MediaRecorder: ${JSON.stringify(e)}`;
    return;
  }

  console.log('Created MediaRecorder', mediaRecorder, 'with options', options);
  recordButton.textContent = 'Stop Recording';
  // playButton.disabled = true;
  downloadButton.disabled = true;
  mediaRecorder.onstop = (event) => {
    console.log('Recorder stopped: ', event);
    console.log('Recorded Blobs: ', recordedBlobs);
  };
  mediaRecorder.ondataavailable = handleDataAvailable;
  mediaRecorder.start();
  console.log('MediaRecorder started', mediaRecorder);
}

function stopRecording() {
  mediaRecorder.stop();
}
