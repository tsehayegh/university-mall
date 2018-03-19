

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
	$('.submit-button').on("click", function(event){
		event.preventDefault();
		if($('#action-choice').val() === "Add New Class") {
			toggleHiddenClass(".course-selection");
		} else {
			$('.search-result-list').html('');
		}
		const studentid = $('#studentId').val();
		const selectedSemester = $('#semester-choice').val();
		let searchURL = `/students/?studentid=${studentid}&semester=${selectedSemester}`;
		pullRegisteredClasses(searchURL);
	})

}
$(chooseAction);

function toggleHiddenClass(classToToggle){
	console.log('toggleClass');
	$(classToToggle).toggleClass("hidden")
}


//GET -- Search for classes 
function renderSections(searchURL){
	$.get(searchURL, function(data){
		$('.search-result-list').empty();
		const days = ["mon", "tue", "wed", "thu", "fri", "sat"];
		data.sections.map((sec) => {
			let meetingDays = [];
			for(let i = 0; i< days.length; i++) {
				if(sec[days[i]] === "Y") {
					
					meetingDays.push(days[i].toUpperCase());
				}
			}
			meetingDays = meetingDays.join(',');

			const sectionname = `${sec.subject}-${sec.coursenumber}-${sec.section}`;

			$('.search-result-list').append(
				`<li id = "${sectionname}" >
					<input type="checkbox" name="${sectionname}" value = "${sectionname}" 
							id="${sectionname}" class = "chkbox">
					${sec.subject}-${sec.coursenumber}: ${sec.title} | 
					${sec.section} | ${sec.credithours} | 
					${sec.starttime} - ${sec.endtime} | ${sec.startdate}- 
					${sec.enddate} | ${sec.campus} campus | (${sec.campuslat},${sec.campuslng}) | 
					${meetingDays} | ${sec.instructor}
				</li>`);

			
		}); 
	})
}

function searchForSections(){
	$('.search-button').on('click',function(event){
		event.preventDefault();
		let searchURL = `/sections/?campus=${$('.campuses option:selected').text().toLowerCase()}`;
		searchURL = searchURL+`&subject=${$('.subject option:selected').text().toLowerCase()}`;
		searchURL = searchURL+`&coursenumber=${$('.course-number option:selected').text()}`;

		renderSections(searchURL);
	});
}

$(searchForSections);

function updateSectionCart(){
	$('.search-result-list').on('change', 'li input[type="checkbox"]', function(event){
		event.preventDefault();
		const currentListId = $(this).attr('id');
		const checked = $(`.search-result-list li[id=${currentListId}]`).html();

		const sectionName = currentListId.split("-");
		const subject = sectionName[0];
		const coursenumber = sectionName[1];
		const ajaxData = `studentid=${$('#studentId').val()}&
					semester=${$('#semester-choice').val()}&
					subject=${subject}&
					coursenumber=${coursenumber}`;
		/*
		if(this.checked) {
			$('.sec-cart-list').append(`<li id = ${currentListId}>${checked}</li>`);
		} else {
			$(`.sec-cart-list li[id=${currentListId}]`).slideUp('fast',function(){
            $(this).remove();
        	});
		}
		*/
		if(this.checked) {
			$.ajax({
				type: 'GET',
				url: '/students',
				data: ajaxData,
				success: function(data){
					if(data.studentrecords.length > 0){
						$(`.search-result-list li[id=${currentListId}]`).attr('color','red');	

					} else {
						$('.sec-cart-list').append(`<li id = ${currentListId}>${checked}</li>`);
					}
				}
			});
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
		data.sections.map((sec) => {
			$.ajax({
				url: '/students',
				type: 'POST',
				dataType: 'json',
				contentType: 'application/json',
				data: JSON.stringify({
					studentid: $('#studentId').val(),
					firstname: $('#firstName').val(),
					lastname: $('#lastName').val(),
					semester: sec.semester,
					subject: sec.subject,
				    coursenumber: sec.coursenumber,
				    title: sec.title,
				    section: sec.section,
				    credithours: sec.credithours,
				    grade: null,
				    status: 'reg',
				    startdate: sec.startdate,
				    enddate: sec.enddate,
				    starttime: sec.starttime,
				    endtime: sec.endtime,
				    mon: sec.mon,
				    tue: sec.tue,
				    wed: sec.wed,
				    thu: sec.thu,
				    fri: sec.fri,
				    sat: sec.sat,
				    campus: sec.campus,
				    campuslat: sec.campuslat,
				    campuslng: sec.campuslng,
				    instructor: sec.instructor
				}),
				success: function(data, status){
					registrationSuccessful(data, status);
					addMarkerOnCampusLocation(data.campus, data.campuslat, data.campuslng);
				},
				error: function(jqXhr, textStatus, errorThrown){
					console.log(errorThrown);
				}
			});

		});

	});
};

function registrationSuccessful(data, success){
	const sectionname = `${data.subject}-${data.coursenumber}-${data.section}`;
	const days = ["mon", "tue", "wed", "thu", "fri", "sat"];
	let meetingDays = [];
	for(let i = 0; i< days.length; i++) {
		if(data[days[i]] === "Y") {
			meetingDays.push(days[i].toUpperCase());
		}
	}
	meetingDays = meetingDays.join(',');

	$('.sec-registered-list').append(
	`<li id = "${sectionname}" tabindex ='0', data-starttime = ${data.starttime}>
		<input type="checkbox" name="${sectionname}" value = "${sectionname}" 
				id="${sectionname}" class = "chkbox">
		${data.subject}-${data.coursenumber}: ${data.title} | 
		${data.section} | ${data.credithours} | ${data.grade} | ${data.semester} | 
		${data.starttime} - ${data.endtime} | ${data.startdate}- 
		${data.enddate} | ${data.campus} campus| (${data.campuslat}, ${data.campuslng}) | 
		${meetingDays} | ${data.instructor}
	</li>`);
	sortList();
	
	const currentListId = `${data.subject}-${data.coursenumber}-${data.section}`;
	$(`.sec-cart-list li[id=${currentListId}]`).slideUp('fast',function(){
        $(this).remove();
     });

	
}

function registerForClasses(){
	$('.register-button').on('click', function(event){
		event.preventDefault();
		$('.sec-cart-list li').each(function(index){

			const sectionName = $(this).attr('id').split("-");
			let searchURL = `/sections/?subject=`+sectionName[0];
			searchURL = searchURL+`&coursenumber=`+sectionName[1];
			searchURL = searchURL+`&section=`+sectionName[2];
			getSectionsOnCart(searchURL);

		});

	});
}

$(registerForClasses);

function pullRegisteredClasses(searchURL){
	$.get(searchURL, function(data){
		$('.sec-registered-list').empty();
		const days = ["mon", "tue", "wed", "thu", "fri", "sat"];
		data.studentrecords.map((student) => {
			let meetingDays = [];
			for(let i = 0; i< days.length; i++) {
				if(student[days[i]] === "Y") {
					
					meetingDays.push(days[i].toUpperCase());
				}
			}
			meetingDays = meetingDays.join(',');

			const sectionname = `${student.subject}-${student.coursenumber}-${student.section}`;

			$('.sec-registered-list').append(
				`<li id = "${sectionname}" >
					<input type="checkbox" name="${sectionname}" value = "${sectionname}" 
							id="${sectionname}" class = "chkbox">
					${student.subject}-${student.coursenumber}: ${student.title} | 
					${student.section} | ${student.credithours} | 
					${student.starttime} - ${student.endtime} | ${student.startdate}- 
					${student.enddate} | ${student.campus} campus | (${student.campuslat},${student.campuslng}) | 
					${meetingDays} | ${student.instructor}
				</li>`);
			addMarkerOnCampusLocation(student.campus, student.campuslat, student.campuslng);
		}); 
	})

}

//sort registered classes
function sortList() {
  $('.sec-registered-list').html(
    $('.sec-registered-list').children('li').sort(function (a,b){
    	console.log($(a).data('starttime'), $(b).data('starttime') );
      return new Date('1970/01/01 ' + $(a).data('starttime')) - new Date('1970/01/01 ' +$(b).data('starttime'));
      
    })
  );
};

//add campus markers
function addMarkerOnCampusLocation(campus, lat, lng){
  let marker = new google.maps.Marker();
  const currentCoord  = {"lat": lat, "lng": lng}
  marker = new google.maps.Marker({
      position: currentCoord,
      map: publicState.map ,
      label: {
      fontFamily: 'Fontawesome', text: '\uf015', color: 'green'}
  });
    
  publicState.markers.push(marker);
  let contentString = `<div class ="info-window">
                        <h3><i class="fa fa-home"></i></h3>
                        <p>${campus}</p>
                      </div>`;
  addEventListner(marker, contentString);
}
function addEventListner(marker, markerString){
  google.maps.event.addListener(marker, 'click', function(){
    publicState.infoWindow.close();
    publicState.infoWindow.setContent(markerString);
    publicState.infoWindow.open(publicState.map ,marker);
    
  }); 
}
//PUT -- update sections

//DELETE -- drop a registered section



