



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
//This will open the search area
function chooseAction(){
	$('.action-section').on("click", function(event){
		event.preventDefault();
		if($('#action-choice').val() === "Add New Class") {
			toggleHiddenClass($('.course-selection'));
		} else {
			$('.search-result-list').html('No Data');
		}
	})
}
$(chooseAction);

function toggleHiddenClass(classToToggle){
	$(classToToggle).toggleClass("hidden")
}

//Toggle a 'hidden' class to an element or elements
function toggleHiddenClass(classToToggle){
  $(classToToggle).toggleClass("hidden");
}


//GET -- Search for classes 
function renderSections(searchURL){
	$.get(searchURL, function(data){
		$('.search-result-list').empty();
		const days = ["mon", "tue", "wed", "thu", "fri", "sat"];

		data.sections.map((section) => {
			let meetingDays = [];
			for(let i = 0; i< days.length; i++) {
				if(section[days[i]] === "Y") {
					
					meetingDays.push(days[i].toUpperCase());
				}
			}
			meetingDays = meetingDays.join(',');

			const sectionname = `${section.subject}-${section.coursenumber}-${section.section}`;

			$('.search-result-list').append(
				`<li id = "${sectionname}" >
					<input type="checkbox" name="${sectionname}" value = "${sectionname}" 
							id="${sectionname}" class = "chkbox">
					${section.subject}-${section.coursenumber}: ${section.title} | 
					${section.section} | ${section.credithours} | 
					${section.starttime} - ${section.endtime} | ${section.startdate}- 
					${section.enddate} | ${section.campus} campus| ${meetingDays}
				</li>`);
		});
	})
}

function searchForSections(){
	$('.search-button').on('click',function(event){
		event.preventDefault();
		let searchURL = `/sections/?campus=`+$('.campuses option:selected').text().toLowerCase();
		searchURL = searchURL+`&subject=`+$('.subject option:selected').text().toLowerCase();
		searchURL = searchURL+`&coursenumber=`+$('.course-number option:selected').text();

		renderSections(searchURL);
	});
}

$(searchForSections);

function updateSectionCart(){
	let $list = $("#itemList");
	$('.search-result-list').on('change', 'li input[type="checkbox"]', function(event){
		event.preventDefault();

		const currentListId = $(this).attr('id');
		const checked = $(`.search-result-list li[id=${currentListId}]`).html();

		if(this.checked) {
			$('.sec-cart-list').append(`<li id = ${currentListId}>${checked}</li>`);
		} else {
			$(`.sec-cart-list li[id=${currentListId}]`).slideUp('fast',function(){
            $(this).remove();
        	});
		}
	});
}
$(updateSectionCart);

//======================================================
//POST - register for a class
function getSectionsOnCart(searchURL){

	$.get(searchURL, function(data){
		data.sections.map((section) => {
			console.log(section);
			$.ajax({
				url: '/students',
				type: 'POST',
				dataType: 'json',
				contentType: 'application/json',
				data: JSON.stringify({
					studentid: "001",
					firstname: 'Tom',
					lastname: 'Hab',
					semester: section.semester,
					subject: section.subject,
				    coursenumber: section.coursenumber,
				    title: section.title,
				    section: section.section,
				    credithours: section.credithours,
				    grade: null,
				    status: 'reg',
				    startdate: section.startdate,
				    enddate: section.enddate,
				    starttime: section.starttime,
				    endtime: section.endtime,
				    mon: section.mon,
				    tue: section.tue,
				    wed: section.wed,
				    thu: section.thu,
				    fri: section.fri,
				    sat: section.sat,
				    campus: section.campus,
				    campuslat: section.campuslat,
				    campuslng: section.campuslng,
				    instructor: section.instructor
				}),
				success: function(data, status){
					registrationSuccessful(data, status);
				},
				error: function(jqXhr, textStatus, errorThrown){
					console.log(errorThrown);
				}
			});

		});

	});
	console.log(searchURL);
};

function registrationSuccessful(data, success){
	console.log(data, status);
}

function registerForClasses(){
	$('.register-button').on('click', function(event){
		event.preventDefault();
		$('.sec-cart-list li').each(function(index){
			//console.log($(this).attr('id').split("-"));
			const sectionName = $(this).attr('id').split("-");
			let searchURL = `/sections/?subject=`+sectionName[0];
			searchURL = searchURL+`&coursenumber=`+sectionName[1];
			searchURL = searchURL+`&section=`+sectionName[2];
			getSectionsOnCart(searchURL);
		});
	});
}

$(registerForClasses);

//PUT -- update sections

//DELETE -- drop a registered section



