


//Initialize google maps - University Mall
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
//Start the app - University Mall
$(function startApp(){
	$('.start-button').on('click', function(event){
		event.preventDefault();
		publicState.userRole = $('#role-choice').val();
		if($('#role-choice').val() === "Student") {
			toggleHiddenClass(".user-role, .landing-page, .main-container");
			toggleHiddenClass(`.instructor-button`);
			toggleHiddenClass('#map-canvas');
			$($('iframe')[0]).attr('title', "iFrame Title");
			$($('iframe')[0]).attr('id', "iframe");
			let iFrameDOM = $("iframe").contents();
			iFrameDOM.find("html").attr('lang', 'en');


		} else if($('#role-choice').val() === "Instructor"){
			toggleHiddenClass(`.user-role, .landing-page, .main-container, 
								.sec-cart, .sec-registered-today-list,
								.registered-classes-today, .course-selection`);
			toggleHiddenClass(`.instructor-space, .instructor-lastname`);
			toggleHiddenClass(`.submit-button, .search-button`);
			
			$('.main-container').height('100%');
			$('.sec-registered-classes').height('100%');
			$('.landing-page').height('100%');

			$('.drop-class-button').prop('disabled', true);
			toggleHiddenClass(`.drop-class-button`);
		}
		$('.search-result-list').empty();
		$('.sec-cart-list').empty();
		$('.sec-registered-list').empty();
		$('.sec-registered-today-list').empty();
		$('.display-error').empty();
	});
});

//Open forms
function openUserForms(){
	$('.submit-button').on("click", function(event){
		event.preventDefault();
		displayErrorMessage('');
		openStudentInstructorClass();
		clearRoute();
		const studentid = $('#studentId').val();
		const selectedSemester = $('#semester-choice').val();
		$('.sec-cart-list').empty();
		if(studentid) {
			pullClassesFromCart(`/search/cart/?studentid=${studentid}&semester=${selectedSemester}`);
		}
		
	});
	
}
$(openUserForms);

function openInstructorSpace(){
	$('.instructor-button').on('click', function(event){
		event.preventDefault();
		openStudentInstructorClass();
	})
}
$(openInstructorSpace);

function openStudentInstructorClass(){
	const studentid = $('#studentId').val();
	const selectedSemester = $('#semester-choice').val();
	let searchURL = `/students/?studentid=${studentid}&semester=${selectedSemester}`;
	if(publicState.userRole === "Student"){
		if(studentid.length >= 3 && selectedSemester.length >= 6){
			pullRegisteredClasses(searchURL);
			$('.btn').prop('disabled', false);
		} else {
			displayErrorMessage('Please enter correct student information and select a semester first!');
			$('.btn').prop('disabled', true);
		}
	} else if(publicState.userRole === "Instructor"){
		$('.main-container').height('100%');
		$('.registered-classes').height('100%');
		$('.landing-page').height('100%');

		const instructor = $('#instructor-lastname').val().trim();
		const subject = $('#subject-choice').val().toLowerCase();
		const coursenumber= $('#course-number-choice').val();

		if(instructor.length > 0 && subject.length === 3 && coursenumber.length >= 3) {
			searchURL = searchURL + `&subject=${subject}&coursenumber=${coursenumber}&instructor=${instructor}`;
			pullRegisteredClasses(searchURL);
			$('.btn').prop('disabled', false);
		} else {
			displayErrorMessage('Please enter or select required student and course information first!');

			$('.btn').prop('disabled', true);
		}
	}	
}


function toggleHiddenClass(classToToggle){
	$(classToToggle).toggleClass("hidden")
}


//GET -- Search for classes
function searchForSections(){
	$('.search-button').on('click',function(event){
		event.preventDefault();
		let searchURL = `/sections/?campus=${$('.campuses option:selected').val().toLowerCase()}`;
		searchURL = searchURL+`&subject=${$('.subject option:selected').val().toLowerCase()}`;
		searchURL = searchURL+`&coursenumber=${$('.coursenumber option:selected').text()}`;
		renderSections(searchURL);

	});
}
$(searchForSections);


function renderSections(searchURL){
	$.get(searchURL, function(data){
		$('.search-result-list').empty();
		data.sections.map((sec) => {
			const singleData = sec;
			appendDataToList(singleData, '.search-result-list');
		})

	});

}

function refreshSearchResult(){
	$(`.search-result-list li input[type=checkbox]`).each(function(){
		$(this).prop('checked', false); 
	})
}

function appendDataToList(data, listClassName){
	let meetingDays = [];
	let index = [];
	for(let i = 0; i< publicState.days.length; i++) {
		index += 1;
		if(data[publicState.days[i]] === "Y") {
			meetingDays.push(publicState.days[i].toUpperCase());
		}
	}
	meetingDays = meetingDays.join(',');
	const sectionname = `${data.subject}-${data.coursenumber}-${data.section}`;

	const starttime = data.starttime.toLowerCase().replace(/\s+/g, '');
	const endtime = data.endtime.toLowerCase().replace(/\s+/g, '');
	const meetingdays = meetingDays.toLowerCase();
	const parentId = listClassName.substr(1);

	$(listClassName).append(
		`<li id = "${sectionname}" aria-label ="${parentId}"
					data-starttime = ${starttime}
					data-endtime = ${endtime}
					data-meetingdays = ${meetingdays}
					data-campus = ${data.campus}> 
			<input type="checkbox" value = "${sectionname}" 
				class = "chkbox" aria-label ="${parentId}">
			<a href ="#"  aria-label ="${parentId}">${data.subject}-${data.coursenumber}</a>: ${data.title} | 
			${data.section} | ${data.credithours} | 
			${data.starttime} - ${data.endtime} | ${data.startdate}- 
			${data.enddate} | ${data.campus} campus |
			${meetingDays} | ${data.instructor}
		</li>`);
	removeListFromSearchResult();
	sortList(listClassName);
}

function removeListFromSearchResult(){
	$('.sec-cart-list li').each(function(){
		const currentListId = $(this).attr('id');
		$(`.search-result-list li[id=${currentListId}]`).remove();
	})

	$('.sec-registered-list li').each(function(){
		const currentListId = $(this).attr('id');
		$(`.search-result-list li[id=${currentListId}]`).remove();
	})		
}



function appendRegisteredDataToList(data, listClassName){
	let meetingDays = [];
	let index = [];
	for(let i = 0; i< publicState.days.length; i++) {
		index += 1;
		if(data[publicState.days[i]] === "Y") {
			meetingDays.push(publicState.days[i].toUpperCase());
		}
	}
	meetingDays = meetingDays.join(',');
	const sectionname = `${data.subject}-${data.coursenumber}-${data.section}`;

	const starttime = data.starttime.toLowerCase().replace(/\s+/g, '');
	const endtime = data.endtime.toLowerCase().replace(/\s+/g, '');
	const meetingdays = meetingDays.toLowerCase();
	const parentId = listClassName.substr(1);

	$(listClassName).append(
		`<li id = "${sectionname}" aria-label ="${parentId}"
					data-starttime = ${starttime}
					data-endtime = ${endtime}
					data-meetingdays = ${meetingdays}
					data-campus = ${data.campus}> 
			<input type="checkbox" value = "${sectionname}" 
				class = "chkbox" aria-label ="${parentId}">
			<a href ="#"  aria-label ="${parentId}">${data.subject}-${data.coursenumber}</a>: ${data.title} | 
			${data.section} | ${data.credithours} | 
			${data.starttime} - ${data.endtime} | ${data.startdate}- 
			${data.enddate} | ${data.campus} campus |
			${meetingDays} | ${data.instructor}
		</li>`);
	sortList(listClassName);
}


//Add sections to cart - buffer area
function updateSectionCart(){
	$('.search-result-list').on('change', 'li input[type="checkbox"]', function(){
		displayErrorMessage('');
		const currentListId = $(this).attr('value');
		const sectionName = currentListId.split("-");
		const courseName = sectionName[0] + '-' + sectionName[1];
		let courseAleardyInCart = false;
		$('.sec-cart-list li').each(function(index){
			const courseNameInCart = $(this).attr('id').split('-')[0] + '-' + $(this).attr('id').split('-')[1];
			if( courseName === courseNameInCart){
				courseAleardyInCart = true;
			}
		})

		const checked = $(`.search-result-list li[id=${currentListId}]`).html();

		const subject = sectionName[0];
		const coursenumber = sectionName[1];
		const ajaxData =`studentid=${$('#studentId').val()}&
						semester=${$('#semester-choice').val()}&
						subject=${subject}&
						coursenumber=${coursenumber}`;

		const studentid = $('#studentId').val();
		const selectedSemester = $('#semester-choice').val();

		
			if(this.checked) {
				$.ajax({
					type: 'GET',
					url: '/students',
					data: ajaxData,
					success: function(data){
						if(data.studentrecords.length > 0){
							displayErrorMessage('You have already registered for the course!')
								$(`.search-result-list li[id=${currentListId}] input[type=checkbox]`).prop('checked', false);
								$(`.sec-cart-list li[id=${currentListId}]`).remove(); 
						} else {
							if (courseAleardyInCart) {
								displayErrorMessage('Course is already in cart!')
								$(`.search-result-list li[id=${currentListId}] input[type=checkbox]`).prop('checked', false); 
							} else {
								$.ajax({
									type: 'GET',
									url: '/search/cart',
									data: ajaxData,
									success: function(result){
										if (result.carts.length > 0) {
											displayErrorMessage('Course is already saved in cart!');
											$(`.search-result-list li[id=${currentListId}]`).attr('disabled', true);
										} else {

											if(!(checkConflict(currentListId, '.sec-cart-list')) &&
												!(checkConflict(currentListId, '.sec-registered-list'))) {
												$('.sec-cart-list').empty();
												appendCheckedListsToCart();
												pullClassesFromCart(`/search/cart/?studentid=${studentid}&semester=${selectedSemester}`);	
											}
										}
									},
									failure: function(status){
										console.log('Failure', status);
									}
								})
							}
						}
					},
					failure: function(status){
						console.log('Failure',status);
					}
				});

			} else {
				displayErrorMessage('');
				$(`.sec-cart-list li[id=${currentListId}]`).slideUp('fast',function(){
	            	$(this).remove();
	        	});
				
				$(`.sec-cart-list`).empty();

	        	pullClassesFromCart(`/search/cart/?studentid=${studentid}&semester=${selectedSemester}`);

				appendCheckedListsToCart();

				
			}


		
	});
}
$(updateSectionCart);


function checkConflict(currentListId, listParent){
	let conflict = false;
	const checkedMeetingDaysArray = $(`.search-result-list li[id=${currentListId}]`).attr("data-meetingdays").toLowerCase().split(',');
	let checkedCampus = $(`.search-result-list li[id=${currentListId}]`).data().campus; 
	const totalListCountInCart = $('.sec-cart-list li').length;

	const starttimeSearchResult = convertToDateTime($(`.search-result-list li[id=${currentListId}]`).attr("data-starttime"));
	const endtimeSearchResult = convertToDateTime($(`.search-result-list li[id=${currentListId}]`).attr("data-endtime"));

	checkedMeetingDaysArray.map(function(day) {

		$(`${listParent} li`).each(function(index){
				const campusCart = $(this).attr("data-campus").toLowerCase();
				const meetingDaysCartArray = $(this).attr("data-meetingdays").toLowerCase().split(',');
				const starttimeCart = convertToDateTime($(this).attr("data-starttime"));
				const endtimeCart = convertToDateTime($(this).attr("data-endtime"));

				let timeDiffInMinutes = 0;
				if(Math.abs(starttimeCart - starttimeSearchResult) > 55) {
					if(endtimeSearchResult >= starttimeCart){
						timeDiffInMinutes = Math.floor(starttimeSearchResult - endtimeCart) ;
					} else if(endtimeSearchResult < starttimeCart){
						timeDiffInMinutes = Math.floor(starttimeCart - endtimeSearchResult);
					}
				} 

				for(let i = 0; i < meetingDaysCartArray.length; i++){
					if(day === meetingDaysCartArray[i]){
						if(checkedCampus !== campusCart && timeDiffInMinutes < 55){
							conflict = true;
							displayErrorMessage('Registering for multiple campuses! No enough driving time to get to your next class');
							$(`.search-result-list li[id=${currentListId}] input[type=checkbox]`).prop('checked', false); 
						} else if(checkedCampus === campusCart && timeDiffInMinutes < 5) {
							conflict = true;
							displayErrorMessage('No enough time between classes');
							$(`.search-result-list li[id=${currentListId}] input[type=checkbox]`).prop('checked', false); 
						}
					}
				}
		})
	});

	return	conflict;
}

//Display error message or instruction
function displayErrorMessage(errorMessage){
	$('.display-error').html(errorMessage);
	$('.display-error').css('color',  'blue');
}

function clearErrorMessage(){
	$('.group input').keyup(function(){
		let empty = false;
		$('.group input').each(function(){
			if($(this).val().length > 0){
				displayErrorMessage('');
			}
		})

	})
}
$(clearErrorMessage);


function appendCheckedListsToCart(){
	$('.search-result-list li input[type=checkbox]:checked').each(function(){
		const currentListId = $(this).attr("value");
		$(`.sec-cart-list li[id=${currentListId}]`).slideUp('fast',function(){
        	$(this).remove();
    	});
		const checkedList = $(`.search-result-list li[id=${currentListId}]`).html();
		checkedData = $(`.search-result-list li[id=${currentListId}]`).data();
    	const starttime = checkedData.starttime.toLowerCase().replace(/\s+/g, '');
    	const endtime = checkedData.endtime.toLowerCase().replace(/\s+/g, '');
    	const meetingdays = checkedData.meetingdays.toLowerCase();
    	const campus = checkedData.campus.toLowerCase();

    	const parentId = $(`.sec-cart-list li[id=${currentListId}]`).parent().attr("id");

		$('.sec-cart-list').append(`<li id = "${currentListId}" 
								aria-label ="${parentId}"
								data-starttime = ${starttime}
								data-endtime = ${endtime}
								data-meetingdays = ${meetingdays}
								data-campus = ${campus}>
								${checkedList}</li>`);	
	});
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
				    sun: sec.sun,
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
					} else if (registrationStatus === 'cart') {
						const studentid = $('#studentId').val();
						const selectedSemester = $('#semester-choice').val();
						$('.sec-cart-list').empty();
						refreshSearchResult();

						pullClassesFromCart(`/search/cart/?studentid=${studentid}&semester=${selectedSemester}`);
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
	//appendRegisteredDataToList(data, listClassName)
	appendRegisteredClassesToList(data, '.sec-registered-list');
	checkDailyScheduleConflict();
	sortList('.sec-registered-list');
	const sectionname = `${data.subject}-${data.coursenumber}-${data.section}`;

	$(`.sec-registered-list li[id=${sectionname}]`).addClass( "new-sec-registered-list", 1000, callback(sectionname) );

	$(`.sec-cart-list li[id=${sectionname}]`).slideUp('fast',function(){
        $(this).remove();
     });
	let searchURL = `/search/cart/?studentid=${data.studentid}
						&subject=${data.subject}&coursenumber=${data.coursenumber}`;

	clearSelectedRecordFromCart(searchURL);
}


function callback(currentList) {
	setTimeout(function() {
  		$(currentList).removeClass("new-sec-registered-list"); // Remove Class after delay of 2sec
    }, 2000 );
  }

function registerForClasses(){
	$('.register-button').on('click', function(event){
		event.preventDefault();
		$('.sec-cart-list li').each(function(index){

			const sectionName = $(this).attr('id').split("-");
			let searchURL = `/sections/?subject=`+sectionName[0];
			searchURL = searchURL+`&coursenumber=`+sectionName[1];
			searchURL = searchURL+`&section=`+sectionName[2];
			console.log(searchURL);

			registerOrSaveSectionsInCart(searchURL, '/students', 'reg');

		});
		displayErrorMessage('');
		clearAllRecordsFromCart();
		refreshSearchResult();
		checkDailyScheduleConflict();
	});
}
$(registerForClasses);

function saveClassesToCart(){
	$('.save-cart-button').on('click', function(event){
		event.preventDefault();
		let currentListId;
		const studentid = $('#studentId').val();
		const selectedSemester = $('#semester-choice').val();

		$('.sec-cart-list li').each(function(index){
			currentListId = $(this).attr('id');
			let sectionName = $(this).attr('id').split("-");
			let searchURL = `/sections/?subject=`+sectionName[0];
			searchURL = searchURL+`&coursenumber=`+sectionName[1];
			searchURL = searchURL+`&section=`+sectionName[2];
			searchURL = searchURL+`&semester=${selectedSemester}`;

			let cartURL = `/search/cart/?studentid=`+studentid;
			cartURL = cartURL+`&semester=`+selectedSemester;
			cartURL = cartURL+`&subject=`+sectionName[0];
			cartURL = cartURL+`&coursenumber=`+sectionName[1];
			$.get(cartURL, function(data){
					if((data.carts.length === 0)){
						console.log('sections updated to cart');
						registerOrSaveSectionsInCart(searchURL, '/students/cart','cart');
					}
			});

		});
		displayErrorMessage('');
		
	});
}
$(saveClassesToCart);

function pullRegisteredClasses(searchURL){
	$.get(searchURL, function(data){
		$('.sec-registered-list').empty();
		$('.sec-registered-today-list').empty();
		sortJsonObject(data.studentrecords);
		data.studentrecords.map((student) => {
			let meetingDays = [];
			for(let i = 0; i< publicState.days.length; i++) {
				if(student[publicState.days[i]] === "Y") {
					meetingDays.push(publicState.days[i].toUpperCase());
				}
			}
			meetingDays = meetingDays.join(',');
			const sectionname = `${student.subject}-${student.coursenumber}-${student.section}`;
			const starttime = student.starttime.toLowerCase().replace(/\s+/g, '');
			const endtime = student.endtime.toLowerCase().replace(/\s+/g, '');
			const meetingdays = meetingDays.toLowerCase();

			$('.sec-registered-list').append(
				`<li id = "${sectionname}"  
							aria-label ="sec-registered-list"
							data-starttime = ${starttime}
							data-endtime = ${endtime}
							data-meetingdays = ${meetingdays}
							data-campus = ${student.campus}>
					<input type="checkbox" value = "${sectionname}" 
					class = "chkbox" aria-label ="sec-registered-list">
					${student.subject}-${student.coursenumber}: ${student.title} | 
					${student.section} | ${student.credithours} | ${student.grade} | 
					${student.starttime} - ${student.endtime} | ${student.startdate}- 
					${student.enddate} | ${student.campus} campus |
					${meetingDays} | ${student.instructor}
				</li>`);
			sortList($('.sec-registered-list'));
			checkDailyScheduleConflict();
		}); 
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
			data: ajaxData,
			success: function(data){
				if( data.studentrecords.length > 0) {
					$('.sec-registered-today-list').empty();
					let waypts = [];
					let orig ={};
					let dest = {};
					const  maxDataCount = data.studentrecords.length;
					sortJsonObject(data.studentrecords);
					orig.lat = data.studentrecords[0].campuslat;
					orig.lng = data.studentrecords[0].campuslng;
					dest.lat = data.studentrecords[maxDataCount-1].campuslat;
					dest.lng = data.studentrecords[maxDataCount-1].campuslng;
					for(let i = 1; i < maxDataCount-1; i++){
							waypts.push({
								location: {lat:data.studentrecords[i].campuslat,
											lng: data.studentrecords[i].campuslng},
								stopover: true
							});
					}
					calcAndDisplayRoute(orig, waypts, dest);
					for (let i = 0; i < data.studentrecords.length; i++) {
						const sectionname = `${data.studentrecords[i].subject}-${data.studentrecords[i].coursenumber}-${data.studentrecords[i].section}`;
						const starttime = data.studentrecords[i].starttime.toLowerCase();
						const endtime = data.studentrecords[i].endtime.toLowerCase().replace(/\s+/g, '');
						$('.sec-registered-today-list').append(
							`<li id = "${sectionname} today"   
									aria-label = "sec-registered-today-list"
										data-starttime = ${starttime}
										data-endtime = ${endtime}
										data-campus = ${data.studentrecords[i].campus}
										data-meetingdays = ${today}>
								<input type="checkbox" value = "${sectionname}" 
										class = "chkbox" aria-label ="sec-registered-today-list">
								${data.studentrecords[i].subject}-${data.studentrecords[i].coursenumber}-${data.studentrecords[i].section} |
								 ${data.studentrecords[i].credithours} | 
								${data.studentrecords[i].starttime} - ${data.studentrecords[i].endtime} 
								${data.studentrecords[i].campus} campus 
							</li>`);
						sortList('sec-registered-today-list');
					}
				}
			}
		});
}


function pullClassesFromCart(searchURL){
	//$('.sec-cart-list').empty();
	$.get(searchURL, function(data){
		data.carts.map((cart) => {
			let meetingDays = [];
			for(let i = 0; i< publicState.days.length; i++) {
				if(cart[publicState.days[i]] === "Y") {
					meetingDays.push(publicState.days[i].toUpperCase());
				}
			};
			const starttime = cart.starttime.toLowerCase().replace(/\s+/g, '');
			const endtime = cart.endtime.toLowerCase().replace(/\s+/g, '');
			const meetingdays = meetingDays;
			meetingDays = meetingDays.join(',');
			const sectionname = `${cart.subject}-${cart.coursenumber}-${cart.section}`;
			$('.sec-cart-list').append(
				`<li id = "${sectionname}"
							aria-label = "sec-cart-list"
							data-starttime = ${starttime}
							data-endtime = ${endtime}
							data-meetingdays = ${meetingdays}
							data-campus = ${cart.campus}>
					<input type="checkbox" value = ${sectionname} 
							class = "chkbox" aria-label ="sec-cart-list">
					${cart.subject}-${cart.coursenumber}: ${cart.title} | 
					${cart.section} | ${cart.credithours} | 
					${cart.starttime} - ${cart.endtime} | ${cart.startdate} - 
					${cart.enddate} | ${cart.campus} campus |  
					${meetingDays} | ${cart.instructor}
				</li>`);
			sortList('.sec-cart-list');
		}); 
	});
}

function TrimColon(text){
    return text.toString().replace(/^(.*?):*$/, '$1');
}

function convertToDateTime(time){
	if(time){
		const _time = new Date();
		const ampm = time.substr(-2);
		let hourMinute = time.trim().substr(0, time.length-2);
		hourMinute = TrimColon(hourMinute).split(":");
		let hours = Number(hourMinute[0]);
		const minutes = Number(hourMinute[1]);
		if(ampm === "pm" && hours < 12) hours = Math.floor(+hours + +12); 
		if(ampm === "am" && hours === 12) hours = Math.floor(+hours - +12);

		//return Math.floor(Number((hours)*60) + +minutes);
		return Math.floor(_time.setHours(hours, minutes)/60000);
	}
}

//Sortin JSON object
function sortJsonObject(data){
	data.sort(function(a,b){
		const _a = new Date();
		const _b = new Date();
		if (a.starttime.substr(-2) === 'AM'){
			_a.setHours(Number(a.starttime.split(":")[0]));

		} else {
			_a.setHours(Number(a.starttime.split(":")[0]) + +12);
		}
		if (b.starttime.substr(-2) === 'AM'){
			_b.setHours(Number(b.starttime.split(":")[0]));
		} else {
			_b.setHours(Number(b.starttime.split(":")[0]) + +12);
		}
		return _a - _b;
	});
}


//sort registered classes
function sortList(listElemToSort) {
  $(listElemToSort).html(
    $(listElemToSort).children('li').sort(function (a,b){
    	return convertToDateTime($(a).data('starttime')) - convertToDateTime($(b).data('starttime'));
      	//return new Date('1970/01/01 ' + $(a).data('starttime')) - new Date('1970/01/01 ' + $(b).data('starttime'));
    })
  );
};

//DELETE - delete selected record(s)
function clearSelectedRecordFromCart(){
	$('.sec-cart-list li input[type="checkbox"]').each(function(index){
		const sectionName = $(this).attr('value').split("-");
		const currentListId = $(this).attr('value');
		const studentid = $('#studentId').val(); 
		const selectedSemester = $('#semester-choice').val();
		const searchURL = `/search/cart/?studentid=${studentid}&subject=${sectionName[0]}&coursenumber=${sectionName[1]}`;
		const checked = $(`.sec-cart-list li[id=${currentListId}]`).html();
		if(this.checked) {
			$.get(searchURL, function(data){
				data.carts.map((cart) => {
					const ajaxURL = `/delete/cart/${cart.id}`;
					$.ajax({
						url: ajaxURL,
						type: 'DELETE',
						success: function(result){
							$(`.sec-cart-list li[id=${currentListId}]`).empty();
							pullClassesFromCart(`/search/cart/?studentid=${studentid}&semester=${selectedSemester}`);
						}
					});
				}); 
			});
		}
	});
}

function clearAllRecordsFromCart(){
	$('.sec-cart-list li').each(function(index){
		const sectionName = $(this).attr('id').split("-");
		const currentListId = $(this).attr('id');
		const studentid = $('#studentId').val(); 
		const selectedSemester = $('#semester-choice').val();
		const searchURL = `/search/cart/?studentid=${studentid}&subject=
							${sectionName[0]}&coursenumber=${sectionName[1]}&
							semester=${selectedSemester}`;
		$.get(searchURL, function(data){
			data.carts.map((cart) => {
				$.ajax({
					url: `/delete/cart/${cart.id}`,
					type: 'DELETE',
					success: function(result){
						refreshSearchResult();
						console.log('delete successful');
					}
				});
			}); 
		});
	});
	$('.sec-cart-list').empty();
}


function clearStudentRecordFromCart(){
	$('.clear-cart-button').on('click', function(event){
		event.preventDefault();
		clearSelectedRecordFromCart();
		displayErrorMessage('');
	})
}
$(clearStudentRecordFromCart);

function clearAllCoursesFromCart(){
	$('.clear-all-cart-button').on('click', function(event){
		event.preventDefault();
		clearAllRecordsFromCart();
	})
}
$(clearAllCoursesFromCart());


function clearSelectedClassFromRegistration(){
	$('.sec-registered-list li input[type="checkbox"]:checked').each(function(index){
		const sectionName = $(this).attr('value').split("-");
		const currentListId = $(this).attr('value');
		const studentid = $('#studentId').val(); 
		const selectedSemester = $('#semester-choice').val();
		const searchURL = `/students/?studentid=${studentid}&subject=${sectionName[0]}&
							coursenumber=${sectionName[1]}&semester=${selectedSemester}`;
		const checked = $(`.sec-registered-list li[id=${currentListId}]`).html();
		if(this.checked) {
			$.get(searchURL, function(data){
				data.studentrecords.map((studentrecord) => {
					const ajaxURL = `/students/${studentrecord.id}`;
					$.ajax({
						url: ajaxURL,
						type: 'DELETE',
						success: function(result){
							console.log('Delete successful');
							$(`.sec-registered-list li[id=${currentListId}]`).remove();
						}
					});
				}); 
			});
		}
	});
}


//Update grade and course status
function updateGradeAndCourseStatus(){
	$('.grade-button').on('click', function(event){
		event.preventDefault();
		enterGrades();
		displayErrorMessage('');
	})
}
$(updateGradeAndCourseStatus);

function enterGrades(){
	$('.sec-registered-list li input[type="checkbox"]:checked').each(function(index){
		const sectionName = $(this).attr('value').split("-");
		const currentListId = $(this).attr('value');
		const studentid = $('#studentId').val(); 
		const selectedSemester = $('#semester-choice').val();
		const searchURL = `/students/?studentid=${studentid}&subject=${sectionName[0]}&
							coursenumber=${sectionName[1]}&semester=${selectedSemester}`;
		const checked = $(`.sec-registered-list li[id=${currentListId}]`).html();
		if(this.checked) {
			$.get(searchURL, function(data){
				data.studentrecords.map((studentrecord) => {
				const newData = JSON.stringify({
						id: studentrecord.id,
						grade: $('#grade-choice').val(),
						status: $('#status-choice').val()
						});
				$.ajax({
					url: `/students/${studentrecord.id}`,
					type: 'PUT',
					contentType: "application/json",
					dataType: 'json',
					data: newData,
					success: function(result){
						console.log('Data updated successfully');
						displayErrorMessage('Data updated successfully');
						openStudentInstructorClass();
					}
				});
				});
			});
		}
	});
}

function refreshRegisteredClasses(){
	const studentid = $('#studentId').val(); 
	const selectedSemester = $('#semester-choice').val();
	let searchURL = `/students/?studentid=${studentid}&semester=${selectedSemester}`;
	$.get(searchURL, function(data){
		$('.sec-registered-list').empty();
		data.studentrecords.map((studentrecord) => {

			appendRegisteredClassesToList(studentrecord, '.sec-registered-list');

		});
	});
}


function appendRegisteredClassesToList(data, listClassName){
	let meetingDays = [];
	for(let i = 0; i< publicState.days.length; i++) {
		if(data[publicState.days[i]] === "Y") {
			meetingDays.push(publicState.days[i].toUpperCase());
		}
	}
	meetingDays = meetingDays.join(',');
	const sectionname = `${data.subject}-${data.coursenumber}-${data.section}`;
	const starttime = data.starttime.toLowerCase().replace(/\s+/g, '');
	const endtime = data.endtime.toLowerCase().replace(/\s+/g, '');
	const meetingdays = meetingDays.toLowerCase();
	const parentId = listClassName.substr(1);

	$(listClassName).append(
		`<li id = "${sectionname}" 
					aria-label ="${parentId}"
					data-starttime = ${starttime}
					data-endtime = ${endtime}
					data-meetingdays = ${meetingdays}
					data-campus = ${data.campus}> 
			<input type="checkbox" value = "${sectionname}" 
					class = "chkbox" aria-label ="${parentId}">
			${data.subject}-${data.coursenumber}: ${data.title} | 
			${data.section} | ${data.credithours} | ${data.grade} | 
			${data.starttime} - ${data.endtime} | ${data.startdate}- 
			${data.enddate} | ${data.campus} campus |
			${meetingDays} | ${data.instructor}
		</li>`);
	removeListFromSearchResult();
	sortList(listClassName);	
}

function dropClassFromRegistration(){
	$('.drop-class-button').on('click', function(event){
		event.preventDefault();
		clearSelectedClassFromRegistration();
		const studentid = $('#studentId').val(); 
		const selectedSemester = $('#semester-choice').val();
		pullRegisteredClasses(`/students/?studentid=${studentid}&semester=${selectedSemester}`);
		refreshRegisteredClasses();
		displayErrorMessage('');
	})
}
$(dropClassFromRegistration);



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
		optimizeWaypoints: false,
		travelMode: google.maps.DirectionsTravelMode.DRIVING
	};
	let directionsService = new google.maps.DirectionsService();
	publicState.directionsDisplay.setMap(publicState.map);
	directionsService.route(request, function(response, status){
		if( status === google.maps.DirectionsStatus.OK) {
			publicState.directionsDisplay.setDirections(response);
          	//let trip ={'dist': response.routes[0].legs[0].distance.text,
            //'dur' : response.routes[0].legs[0].duration.text}
		} else {
			console.log(status);
		}
	})
}

//clear route information
function clearRoute(){
    if (publicState.directionsDisplay != null) {
      publicState.directionsDisplay.setMap(null);
  }
}

