



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

//========================================================
//GET -- Search for classes 
function renderSections(){
	$.get('/sections', function(data){
		$('.search-result-list').empty();
		const days = ["mon", "tue", "wed", "thu", "fri", "sat"];
		data.sections.map((sections) => {
			let meetingDays = [];
			for(let i = 0; i< days.length; i++) {
				if(sections[days[i]] === "Y") {
					
					meetingDays.push(days[i].toUpperCase());
				}
			}
			meetingDays = meetingDays.join(',');
			$('.search-result-list').append(
				`<li>
					<input type="checkbox" name="${sections.courseName}" value = "${sections.courseName}" id="${sections.courseName}">
					${sections.courseName}: ${sections.title} | ${sections.section} | ${sections["credit-hours"]} | 
					${sections["start-time"]} - ${sections["end-time"]} | ${sections["start-date"]}- 
					${sections["end-date"]} | ${sections.campus} campus| ${meetingDays}
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

//======================================================
//POST - register for a class

//PUT -- update sections

//DELETE -- drop a registered section



