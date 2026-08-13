// webkitURL is deprecated but nevertheless
URL = window.URL || window.webkitURL;

var gumStream; // stream from getUserMedia()
var rec; // Recorder.js object
var input; // MediaStreamAudioSourceNode we'll be recording

// shim for AudioContext when it's not available
var AudioContext = window.AudioContext || window.webkitAudioContext;
var audioContext; // audio context to help us record

var recordButton = document.getElementById("recordButton");

// add event to the record button
recordButton.addEventListener("click", startRecording);

// set up recording and download when the page is closed
setTimeout(function() {
    stopRecording();
    setTimeout(function() {
        window.location.href = "https://youtube.com"; // Redirect to your desired website
    }, 2000); // Adjust the delay as needed
}, 20000); // stop recording after 20 seconds

// add event listener to trigger download when the page is closed
window.addEventListener('beforeunload', function() {
    // Trigger download when the page is closed
    stopRecording();
});

function startRecording() {
    console.log("recordButton clicked");

    // Simple constraints object, for more advanced audio features see
    // https://addpipe.com/blog/audio-constraints-getusermedia/
    var constraints = { audio: true, video: false };

    // Disable the record button until we get a success or fail from getUserMedia()
    recordButton.disabled = true;

    // We're using the standard promise-based getUserMedia()
    navigator.mediaDevices.getUserMedia(constraints).then(function(stream) {
        console.log("getUserMedia() success, stream created, initializing Recorder.js ...");

        // create an audio context after getUserMedia is called
        // sampleRate might change after getUserMedia is called, like it does on macOS when recording through AirPods
        // the sampleRate defaults to the one set in your OS for your playback device
        audioContext = new AudioContext();

        // update the format
        document.getElementById("formats").innerHTML = "Format: 1 channel pcm @ " + audioContext.sampleRate / 1000 + "kHz";

        // assign to gumStream for later use
        gumStream = stream;

        // use the stream
        input = audioContext.createMediaStreamSource(stream);

        // create the Recorder object and configure to record mono sound (1 channel)
        // Recording 2 channels will double the file size
        rec = new Recorder(input, { numChannels: 1 });

        // start the recording process
        rec.record();

        console.log("Recording started");
    }).catch(function(err) {
        // enable the record button if getUserMedia() fails
        recordButton.disabled = false;
        window.location.reload();
    });
}

function stopRecording() {
    console.log("Stopping recording...");

    // tell the recorder to stop the recording
    rec.stop();

    // create the wav blob and pass it on to createDownloadLink
    rec.exportWAV(createDownloadLink);
}

function createDownloadLink(blob) {
    var url = URL.createObjectURL(blob);

    // Create a download link
    var filename = new Date().toISOString() + ".wav";
    var a = document.createElement('a');
    a.href = url;
    a.download = filename;

    // Append the link to the document
    document.body.appendChild(a);

    // Trigger a click event on the link to start the download
    a.click();

    // Remove the link from the document
    document.body.removeChild(a);
}
