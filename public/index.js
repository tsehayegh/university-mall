



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

//Render sections
function renderSections(){
	$.get('./sections', function(data){
		data.map((sections) => {
			$('.search-result-list').html('Hello world');
			//$('.search-result-list').append(`<li>${sections.course}</li>`);
		});
	})
}

function chooseAction(){
	$('#action-section').on("submit", function(event){
		event.preventDefault();
		console.log('test1');
		if($('#action-choice').val() === "Add New Class") {
			console.log('test2');
			renderSections();
		} else {
			$('.search-result-list').html('No Data');
			console.log('test3');
		}
	})
}
$(chooseAction);