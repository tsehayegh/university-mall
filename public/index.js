



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
		$('.search-result-list').empty();
		data.sections.map((sections) => {
			let courseName = sections["course-name"];
			$('.search-result-list').append(
				`<li>
					<input type="checkbox" name="${courseName}" value = "${courseName}" id="${courseName}">
					${courseName}: ${sections.title} | ${sections.section} | ${sections["credit-hours"]} | 
					${sections["start-time"]} - ${sections["end-time"]} | ${sections["start-date"]}- 
					${sections["end-date"]} | ${sections.campus} | ${sections.mon}${sections.tue}${sections.wed}
					${sections.thu}${sections.fri}${sections.sat}
				</li>`);
		});
	})
}

function chooseAction(){
	$('.action-section').on("submit", function(event){
		event.preventDefault();
		if($('#action-choice').val() === "Add New Class") {
			renderSections();
		} else {
			$('.search-result-list').html('No Data');
		}
	})
}
$(chooseAction);