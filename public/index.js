

let tempCartList = [];

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
			$('.search-result-list').empty();
			$('.sec-cart-list').empty();
			$('.display-error').empty();
		} else {
			$('.search-result-list').html('');
		}
		const studentid = $('#studentId').val();
		const selectedSemester = $('#semester-choice').val();
		let searchURL = `/students/?studentid=${studentid}&semester=${selectedSemester}`;
		pullRegisteredClasses(searchURL);
		pullClassesFromCart(`/search/cart/?studentid=${studentid}&semester=${selectedSemester}`);
	})
}
$(chooseAction);

function toggleHiddenClass(classToToggle){
	$(classToToggle).toggleClass("hidden")
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

//GET -- Search for classes 
function renderSections(searchURL){
	$.get(searchURL, function(data){
		$('.search-result-list').empty();
		data.sections.map((sec) => {
			const singleData = sec;
			appendDataToList(singleData, '.search-result-list');
		})
	});
}

function appendDataToList(data, listClassName){
	let meetingDays = [];
	for(let i = 0; i< publicState.days.length; i++) {
		if(data[publicState.days[i]] === "Y") {
			meetingDays.push(publicState.days[i].toUpperCase());
		}
	}
	meetingDays = meetingDays.join(',');
	const sectionname = `${data.subject}-${data.coursenumber}`;
	$(listClassName).append(
		`<li id = "${sectionname}" tabindex ='0', data-starttime = ${data.starttime}>
			<input type="checkbox" name="${sectionname}" value = "${sectionname}" 
					id="${sectionname}" class = "chkbox">
			${data.subject}-${data.coursenumber}: ${data.title} | 
			${data.section} | ${data.credithours} | 
			${data.starttime} - ${data.endtime} | ${data.startdate}- 
			${data.enddate} | ${data.campus} campus | (${data.campuslat},${data.campuslng}) | 
			${meetingDays} | ${data.instructor}
		</li>`);
	sortList();	
}

function updateSectionCart(){
	$('.search-result-list').on('change', 'li input[type="checkbox"]', function(event){
		event.preventDefault();
		const currentListId = $(this).attr('id');
		let courseAleardyInCart = false;
		$('.sec-cart-list li').each(function(index){
			if(currentListId === $(this).attr('id')){
				courseAleardyInCart = true;
			}
		})
		const checked = $(`.search-result-list li[id=${currentListId}]`).html();
		const sectionName = currentListId.split("-");
		const subject = sectionName[0];
		const coursenumber = sectionName[1];
		const ajaxData =`studentid=${$('#studentId').val()}&
						semester=${$('#semester-choice').val()}&
						subject=${subject}&
						coursenumber=${coursenumber}`;
		if(this.checked) {
			$.ajax({
				type: 'GET',
				url: '/students',
				data: ajaxData,
				success: function(data){
					if(data.studentrecords.length > 0){
						displayErrorMessage('You have already registered for the course!')
					} else {
						if (courseAleardyInCart) {
							displayErrorMessage('Course is already in cart!')
						} else {
							$('.sec-cart-list').append(`<li id = ${currentListId}>${checked}</li>`);
						}
					}
				}
			});
		} else {
			displayErrorMessage('');
			$(`.sec-cart-list li[id=${currentListId}]`).slideUp('fast',function(){
            	$(this).remove();
        	});
		}

	});
}
$(updateSectionCart);

//Display error message or instruction
function displayErrorMessage(errorMessage){
	$('.display-error').html(errorMessage);
	$('.display-error').css('color',  'red');
}

//======================================================
//POST - register for a class
function registerOrSaveSectionsInCart(searchURL, ajaxURL, registrationStatus){
	$.get(searchURL, function(result){
		result.sections.map((sec) => {
			$.ajax({
				url: ajaxURL,
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
				    status: registrationStatus,
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
				success: function(data){
					if (registrationStatus === 'reg'){
						registrationSuccessful(data, status);
						//addMarkerOnCampusLocation(data.campus, data.campuslat, data.campuslng);
					} else if (registrationStatus === 'cart') {
						const sectionname = `${data.subject}-${data.coursenumber}`;
						displayErrorMessage('Course saved in cart successfully!');
					};
				},
				error: function(jqXhr, textStatus, errorThrown){
					console.log(errorThrown);
				}
			});
		});
	});
};

function registrationSuccessful(data){

	appendDataToList(data, '.sec-registered-list');
	sortList();
	const sectionname = `${data.subject}-${data.coursenumber}`;
	$(`.sec-cart-list li[id=${sectionname}]`).slideUp('fast',function(){
        $(this).remove();
     });
	let searchURL = `/search/cart/?studentid=${data.studentid}
						&subject=${data.subject}&coursenumber=${data.coursenumber}`;
	clearSelectedRecordFromCart(searchURL);
}

function registerForClasses(){
	$('.register-button').on('click', function(event){
		event.preventDefault();
		$('.sec-cart-list li').each(function(index){
			const sectionName = $(this).attr('id').split("-");
			let searchURL = `/sections/?subject=`+sectionName[0];
			searchURL = searchURL+`&coursenumber=`+sectionName[1];
			registerOrSaveSectionsInCart(searchURL, '/students', 'reg');
			$(`.search-result-list li[type="checkbox"]:checked`).each(function(){
					$(this).remove();
		     });
		});
	});
}
$(registerForClasses);

function saveClassesToCart(){
	$('.save-cart-button').on('click', function(event){
		event.preventDefault();
		$('.sec-cart-list li').each(function(index){
			
			let sectionName = $(this).attr('id').split("-");

			let searchURL = `/sections/?subject=`+sectionName[0];
			searchURL = searchURL+`&coursenumber=`+sectionName[1];

			registerOrSaveSectionsInCart(searchURL, '/students/cart','cart');

			const studentid = $('#studentId').val();
			const selectedSemester = $('#semester-choice').val();
			pullClassesFromCart(`/search/cart/?studentid=${studentid}&semester=${selectedSemester}`);
		});
	});
}
$(saveClassesToCart);


function pullRegisteredClasses(searchURL){
	$.get(searchURL, function(data){
		$('.sec-registered-list').empty();
		$('.sec-registered-today-list').empty();
		data.studentrecords.map((student) => {
			let meetingDays = [];
			for(let i = 0; i< publicState.days.length; i++) {
				if(student[publicState.days[i]] === "Y") {
					
					meetingDays.push(publicState.days[i].toUpperCase());
				}
			}
			meetingDays = meetingDays.join(',');

			const sectionname = `${student.subject}-${student.coursenumber}`;

			$('.sec-registered-list').append(
				`<li id = "${sectionname}" tabindex ='0', data-starttime = ${student.starttime}>
					<input type="checkbox" name="${sectionname}" value = "${sectionname}" 
							id="${sectionname}" class = "chkbox">
					${student.subject}-${student.coursenumber}: ${student.title} | 
					${student.section} | ${student.credithours} | 
					${student.starttime} - ${student.endtime} | ${student.startdate}- 
					${student.enddate} | ${student.campus} campus | (${student.campuslat},${student.campuslng}) | 
					${meetingDays} | ${student.instructor}
				</li>`);
			sortList();
			filterTodaysSchedule(student, '.sec-registered-today-list');
			
			//addMarkerOnCampusLocation(student.campus, student.campuslat, student.campuslng);
		}); 

	checkDailyScheduleConflict();
	})
}

function filterTodaysSchedule(data,listClassName){
	const today = ['sun', 'mon', 'tues', 'wed', 'thurs', 'fri', 'sat'][(new Date()).getDay()];
	publicState.days.map(function(day){
		if (day === today && data[day] === 'Y') {
			const sectionname = `${data.subject}-${data.coursenumber}`;
			$(listClassName).append(
				`<li id = "${sectionname}" tabindex ='0', data-starttime = ${data.starttime}>
					<input type="checkbox" name="${sectionname}" value = "${sectionname}" 
							id="${sectionname}" class = "chkbox">
					${data.subject}-${data.coursenumber}-${data.section} | ${data.credithours} | 
					${data.starttime} - ${data.endtime} ${data.campus} campus 
				</li>`);		
		}
	})
}

function checkDailyScheduleConflict(){
	const today = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'][(new Date()).getDay()];
	studentid = $('#studentId').val();

	semester = $('#semester-choice').val();
	const ajaxData = `studentid=${studentid}&semester=${semester}&${today}=Y`;
			$.ajax({
				url: '/students',
				type: 'GET', 
				dataType: 'json',
				data: `studentid=${studentid}&semester=${semester}&${today}=Y`,
				success: function(data){
					$('.sec-registered-today-list').empty();
					let waypts = [];

					let orig ={};
					let dest = {};
					const  maxDataCount = data.studentrecords.length;

					for(let i = 0; i < data.studentrecords.length; i++){
						if(i === 0) {
							orig.lat = data.studentrecords[i].campuslat;
							orig.lng = data.studentrecords[i].campuslng;
						} else if(i < maxDataCount-2){
							waypts.push({
								location: {lat:data.studentrecords[i].campuslat,
											lng: data.studentrecords[i].campuslng},
								stopover: true
							})
						} else if (i = maxDataCount-1) {
							dest.lat = data.studentrecords[i].campuslat;
							dest.lng = data.studentrecords[i].campuslng;
						}
					}
					calcAndDisplayRoute(orig, waypts, dest)

					/*
					for( let i = 0; i < data.studentrecords.length; i++){
						if (i === 0) {
							orig.lat = data.studentrecords[i].campuslat;
							orig.lng = data.studentrecords[i].campuslng;
						} else {
							orig.lat = data.studentrecords[i-1].campuslat;
							orig.lng = data.studentrecords[i-1].campuslng;

							dest.lat = data.studentrecords[i].campuslat;
							dest.lng = data.studentrecords[i].campuslng;
							console.log(i, orig, dest);
							calcAndDisplayRoute(orig, dest);
						}

						
						addMarkerOnCampusLocation(data.studentrecords[i].campus, 
												data.studentrecords[i].campuslat, 
												data.studentrecords[i].campuslng)
						
						const sectionname = `${data.studentrecords[i].subject}-${data.studentrecords[i].coursenumber}`;
						
						$('.sec-registered-today-list').append(
							`<li id = "${sectionname}" tabindex ='0', data-starttime = ${data.studentrecords[i].starttime}>
								<input type="checkbox" name="${sectionname}" value = "${sectionname}" 
										id="${sectionname}" class = "chkbox">
								${data.studentrecords[i].subject}-${data.studentrecords[i].coursenumber}-${data.studentrecords[i].section} | ${data.studentrecords[i].credithours} | 
								${data.studentrecords[i].starttime} - ${data.studentrecords[i].endtime} ${data.studentrecords[i].campus} campus 
							</li>`);
					}
				*/
			}
		});
}

function pullClassesFromCart(searchURL){
	$('.sec-cart-list').empty();
	$.get(searchURL, function(data){
		data.carts.map((cart) => {
			let meetingDays = [];
			for(let i = 0; i< publicState.days.length; i++) {
				if(cart[publicState.days[i]] === "Y") {
					meetingDays.push(publicState.days[i].toUpperCase());
				}
			};
			meetingDays = meetingDays.join(',');
			const sectionname = `${cart.subject}-${cart.coursenumber}`;
			$('.sec-cart-list').append(
				`<li id = "${sectionname}" tabindex ='0', data-starttime = ${cart.starttime}>
					<input type="checkbox" name="${sectionname}" value = "${sectionname}" 
							id="${sectionname}" class = "chkbox">
					${cart.subject}-${cart.coursenumber}: ${cart.title} | 
					${cart.section} | ${cart.credithours} | 
					${cart.starttime} - ${cart.endtime} | ${cart.startdate} - 
					${cart.enddate} | ${cart.campus} campus | 
					(${cart.campuslat},${cart.campuslng}) | 
					${meetingDays} | ${cart.instructor}
				</li>`);
			//addMarkerOnCampusLocation(cart.campus, cart.campuslat, cart.campuslng);
		}); 
	})
}

//sort registered classes
function sortList() {
  $('.sec-registered-list').html(
    $('.sec-registered-list').children('li').sort(function (a,b){
      return new Date('1970/01/01 ' + $(a).data('starttime')) - new Date('1970/01/01 ' +$(b).data('starttime'));
      
    })
  );
};

//DELETE - delete selected record(s)
function clearSelectedRecordFromCart(searchURL){
	console.log(searchURL);
	$.get(searchURL, function(data){
		data.carts.map((cart) => {
			const ajaxURL = `/delete/cart/${cart.id}`;
			$.ajax({
				url: ajaxURL,
				type: 'DELETE',
				success: function(result){
				}
			});
		}); 
	})
}

function clearStudentRecordFromCart(){
	$('.clear-cart-button').on('click', function(event){
		event.preventDefault();
		console.log('clearing');
		$('.sec-cart-list li').each(function(index){
			console.log(index);

			const studentid = $('#studentId').val(); 
			const sectionName = $(this).attr('id').split("-");
			const searchURL = `/search/cart/?studentid=${studentid}&subject=${sectionName[0]}&coursenumber=${sectionName[1]}`;
			
			clearSelectedRecordFromCart(searchURL);
		});
		$('.sec-cart-list').empty();

	})
	
}
$(clearStudentRecordFromCart);


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

function calcAndDisplayRoute(orig, waypts, dest) {
	const request = {
		origin: orig,
		destination: dest,
		waypoints: waypts,
		optimizeWaypoints: true,
		travelMode: google.maps.DirectionsTravelMode.DRIVING
	};
	let directionsService = new google.maps.DirectionsService();
	publicState.directionsDisplay.setMap(publicState.map);
	directionsService.route(request, function(response, status){
		if( status === google.maps.DirectionsStatus.OK) {
			publicState.directionsDisplay.setDirections(response);
          let trip ={'dist': response.routes[0].legs[0].distance.text,
            		'dur' : response.routes[0].legs[0].duration.text}
          publicState.directionsDisplay.setDirections(response);
		} else {
			console.log('status');
		}
	})
}



//PUT -- update sections

//DELETE -- drop a registered section



