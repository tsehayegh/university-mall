



//Initialize google maps
function initMap() {
  let currentLoc = {lat: 35.227085, lng: -80.843124};
  publicState.map = new google.maps.Map(document.getElementById('map-canvas'), {
    zoom: 11,
    center: currentLoc,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  });
 publicState.infoWindow = new google.maps.InfoWindow({
  content: ''
});
 publicState.directionsDisplay = new google.maps.DirectionsRenderer;
}