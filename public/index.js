
//University Mall

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

function myFunction() {
	/*
    let x = document.getElementById("myTopnav");
    if (x.className === "top-navigation") {
        x.className += " responsive";
    } else {
        x.className = "top-navigation";
    }
    */
  $('#myTopnav').toggleClass('responsive');
  countRecords();
}

//========================================================
//Start the app
//Open/close forms based on the user's role
$(function startApp(){
	$('.start-button').on('click', function(event){
		event.preventDefault();
		publicState.userRole = $('#role-choice').val();
		if($('#role-choice').val() === "Student") {
			toggleHiddenClass(".user-role, .user-info");
			$('.top-navigation').toggleClass(' responsive');
			$('.top-navigation a.icon').focus();
			//toggleHiddenClass(`.instructor-button`);
			//toggleHiddenClass('#map-canvas');
			$($('iframe')[0]).attr('title', "iFrame Title");
			$($('iframe')[0]).attr('id', "iframe");
			let iFrameDOM = $("iframe").contents();
			iFrameDOM.find("html").attr('lang', 'en');

		} else if($('#role-choice').val() === "Instructor"){
			//toggleHiddenClass(`.user-role, .landing-page, .main-container, 
			//					.sec-cart, .sec-registered-today-list,
			//					.registered-classes-today, .course-selection`);
			//toggleHiddenClass(`.instructor-space, .instructor-lastname`);
			//toggleHiddenClass(`.submit-button, .search-button`);

			resizeInstructorPages();
			//$('.main-container').height('100%');
			//$('.registered-classes').height('100%');
			//$('.sec-registered-classes').height('50%');
			//$('.landing-page').height('100%');	
			//$('.user-info').height('50%');
			//$('.search-area').height('50%');
			

			$('.drop-class-button').prop('disabled', true);
			//toggleHiddenClass(`.drop-class-button`);
		}
		$('.search-result-list').empty();
		$('.sec-cart-list').empty();
		$('.sec-registered-list').empty();
		$('.sec-registered-today-list').empty();
		$('.display-error').empty();
	});
});

//Home button
function refreshPage(){
	$('.home').click(function(event){
		event.preventDefault();
		window.location.reload();
	})
}
$(refreshPage);


function enableButtonIfCheckboxChecked(){
	const checkboxes = $("input[type='checkbox']");
	const submitButt = $("input[type='submit']");

	checkboxes.click(function() {
		console.log($("input[type='checkbox']:checked").length);
	    submitButt.prop("disabled", !checkboxes.is(":checked"));
	});
}
$(enableButtonIfCheckboxChecked);

$(function() {
	$('.search-result-list').on('click', 'li input[type=checkbox]', function(){
		enableButtonIfCheckboxChecked();
	});
	$('.sec-registered-list').on('click', 'li input[type=checkbox]', function(){
		enableButtonIfCheckboxChecked();
	});
	$('.sec-cart-list').on('click', 'li input[type=checkbox]', function(){
		enableButtonIfCheckboxChecked();
	});
});

//Search and Register for Classes
function searchForClassesAndRegister(){
	$('.search-register').click(function(event){
		event.preventDefault();
		displayErrorMessage('');
		toggleHiddenClass($('.search-sections'));
		//$('.search-sections').removeClass('hidden');
		console.log('toggle search');
		myFunction();
		$('.search-button').attr('disabled', false);
		$('.course-sections').addClass('hidden');
		$('.registered-classes').addClass('hidden');
		$('.registered-classes-today').addClass('hidden');
		$('.sec-cart').addClass('hidden')
	})
}
$(searchForClassesAndRegister);

//Display all registered classes for the semester
function displayRegisteredClasses(){
	$('.registered').click(function(event){
		event.preventDefault();
		displayErrorMessage('');
		toggleHiddenClass($('.registered-classes'));
		$('.search-sections').addClass('hidden');
		$('.course-sections').addClass('hidden');
		$('.registered-classes-today').addClass('hidden');
		$('.sec-cart').addClass('hidden')
		let searchURL = `/students/?studentid=${publicState.studentId}&semester=${publicState.semester}`;
		if(publicState.studentId.length >= 3 && publicState.semester.length >= 6){
		$.get(searchURL, function(data){
			$('.sec-registered-list').empty();
			sortJsonObject(data.studentrecords);
			if(data.studentrecords.length > 0) {
				const todayDate = new Date();
				data.studentrecords.map((student) => {
					appendDataToList(student, '.sec-registered-list');
					sortList($('.sec-registered-list'));
				});
			} else {
				displayErrorMessage(`You do not have registered classes for the semester. You can search and register for classes`, 'blue')
			}
		});
		}
		myFunction();

		$('.drop-class-button').attr('disabled', false);
		//enableButtonIfCheckboxChecked();
	})
}
$(displayRegisteredClasses);

//Display registered classes for the day
function displayClassesForTheDay(){
	$('.today-classes').click(function(event){
		event.preventDefault();
		displayErrorMessage('');
		toggleHiddenClass($('.registered-classes-today, #map-canvas'));
		$('.search-sections').addClass('hidden');
		$('.course-sections').addClass('hidden');
		$('.registered-classes').addClass('hidden');
		$('.sec-cart').addClass('hidden')
		listAndMapDailySchedule()
		myFunction();
		//enableButtonIfCheckboxChecked();
	})
}
$(displayClassesForTheDay);

//Pull classes saved in cart for the semester
function displayAndMapTodaysClasses(){
	$('.classes-cart').click(function(event){
		event.preventDefault();
		displayErrorMessage('');
		toggleHiddenClass('.sec-cart');
		$('.search-sections').addClass('hidden');
		$('.course-sections').addClass('hidden');
		$('.registered-classes').addClass('hidden');
		$('.registered-classes-today').addClass('hidden');

		myFunction();
		if(publicState.studentId.length >= 3 && publicState.semester.length >= 6){
			$('.sec-cart-list').empty();
			pullClassesFromCart();
		}
	})
}
$(displayAndMapTodaysClasses);

function pullClassesFromCart(){
	const searchURL =`/search/cart/?studentid=${publicState.studentId}&semester=${publicState.semester}`;
	$.get(searchURL, function(data){
		$('.sec-cart-list').empty();
		data.carts.map((cart) => {
			appendDataToList(cart, '.sec-cart-list');
			sortList('.sec-cart-list');
		}); 
	});
}

//A function that will toggle (hide/show tags)
function toggleHiddenClass(classToToggle){
	$(classToToggle).toggleClass("hidden")
}

//Open instructor/student form on submit button
function openUserForms(){
	$('.submit-button').on("click", function(event){
		event.preventDefault();
		if($('#studentId').val().length === 3 &&
			$('#firstName').val().length > 1 && 
			$('#lastName').val().length > 1 && 
			$('#semester-choice').val().length === 6) {
				$('.sec-registered-list').empty();
				keepUserDemo();
				toggleHiddenClass(".user-info, .top-navigation, .user-demo");
				$('.top-navigation').toggleClass(' responsive');
				countRecords();
				onMediaQueryChange();
				//openStudentInstructorClass();
				clearRoute();
		} else {
			$('#studentId').focus();
			displayErrorMessage('Enter student information and select current semester first!', 'red');
		}
	});
}
$(openUserForms);

function keepUserDemo(){
	$('.user-demo').empty();
	publicState.studentId = $('#studentId').val();
	publicState.firstName = $('#firstName').val();
	publicState.lastName = $('#lastName').val();
	publicState.semester = $('#semester-choice').val();
	$('.user-demo').append(`<label class = "demo col-12">
								Student ID: ${publicState.studentId}, 
								Full Name: ${publicState.firstName} ${publicState.lastName}, 
								Semester: ${publicState.semester}
							</label>`);
}

//Open instructor/student form
function openStudentInstructorClass(){
	const studentid = publicState.studentId;
	const selectedSemester = publicState.semester;
	let searchURL = `/students/?studentid=${publicState.studentId}&semester=${publicState.semester}`;
	if(publicState.userRole === "Student"){
		if(publicState.studentId.length >= 3 && publicState.semester.length >= 6){
			pullRegisteredClasses();
			pullClassesFromCart();
			refreshClassesInCart();
			$('.btn').prop('disabled', false);
		} else {
			displayErrorMessage('Please enter correct 3 digit student id and select a semester first!', 'red');
			$('.btn').prop('disabled', true);
		}
	} else if(publicState.userRole === "Instructor"){
		resizeInstructorPages();
		$('.main-container').height('100%');
		$('.sec-registered-classes').height('100%');
		const instructor = $('#instructor-lastname').val().trim();
		const subject = $('#subject-choice').val().toLowerCase();
		const coursenumber= $('#course-number-choice').val();
		if(instructor.length > 0 && subject.length === 3 && coursenumber.length >= 3) {
			searchURL = searchURL + `&subject=${subject}&coursenumber=${coursenumber}&instructor=${instructor}`;
			pullRegisteredClasses();
			$('.btn').prop('disabled', false);
		} else {
			displayErrorMessage('Please enter correct 3 digit student id and select a semester first!', 'red');
			$('.btn').prop('disabled', true);
		}
	}	
}

//Open instructor's page
function openInstructorSpace(){
	$('.instructor-button').on('click', function(event){
		event.preventDefault();
		openStudentInstructorClass();
	})
}
$(openInstructorSpace);

function resizeInstructorPages(){
	$(window).resize(function(){
		$('.main-container').height('100%');
		$('.sec-registered-classes').height('100%');
		//$('.landing-page').height('100%');	
		//$('.user-info').height('50%');
		//$('.search-area').height('50%');
	})
}

//GET -- function to invoke searching sections on button click
function searchForSections(){
	$('.search-button').on('click',function(event){
		event.preventDefault();
		$('.course-sections').removeClass('hidden');
		toggleHiddenClass('.search-sections');
		renderSections();
		displayErrorMessage('');	
	});
}
$(searchForSections);

//Render sections returned from search results to search list
function renderSections(){
	let searchURL = `/sections/?campus=${$('.campuses option:selected').val().toLowerCase()}`;
	searchURL = searchURL+`&subject=${$('.subject option:selected').val().toLowerCase()}`;
	searchURL = searchURL+`&coursenumber=${$('.coursenumber option:selected').text()}`;
	$.get(searchURL, function(data){
		$('.search-result-list').empty();
		data.sections.map((sec) => {
			const singleData = sec;
			appendDataToList(singleData, '.search-result-list')
			removeListFromSearchResult();
			sortList('.search-result-list');
		})
	});
}

//MediaQueryList - response to screen change
function screenTest(e) {
	let mediumScreen = false;
  	if (e.matches) {
	    mediumScreen = true;
  	}
  return mediumScreen;
};

function onMediaQueryChange(){
	let mql = publicState.mediaQueryList.maxWidthMedium;
	mql.addListener(screenTest);
	 mql.onchange = function() {
		if ($('.search-result-list li').length !== 0) {
			renderSections();
		}
		if(publicState.studentId.length >= 3 && publicState.semester.length >= 6){
			pullRegisteredClasses();
			pullClassesFromCart();
		}
		displayErrorMessage('');  	
  	};	
}

//Refresh (uncheck) lists in the sections search result
function refreshSearchResult(){
	$(`.search-result-list li input[type=checkbox]`).each(function(){
		$(this).prop('checked', false); 
	})
}


//Remove list
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

//Append data to list
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

	let htmlString = `<li id = "${sectionname}" aria-label ="${parentId}"
					data-starttime = ${starttime}
					data-endtime = ${endtime}
					data-meetingdays = ${meetingdays}
					data-campus = ${data.campus}> 
					<input type="checkbox" value = "${sectionname}" 
					class = "chkbox" aria-label ="${parentId}">`;

	if( publicState.studentId.length >= 3) {

    		meetingDays =  meetingDays.replace(/,/g, ", ");


		if (screenTest(publicState.mediaQueryList.maxWidthMedium)){
			$('button').attr('fontSize', "16px");
			$('button').height('1.2em');

			htmlString = htmlString + `<a href ="#"  aria-label ="${parentId}">${data.subject}-${data.coursenumber}-${data.section}</a> - 
										${meetingDays} at ${data.starttime}, ${data.campus} campus </li>`;
		} else {
			htmlString = htmlString + `<a href ="#"  aria-label ="${parentId}">${data.subject}-${data.coursenumber}-${data.section}</a>: 
									${data.title}, ${data.credithours} Crd. Hr., ${meetingDays} from
									${data.starttime} - ${data.endtime} at ${data.campus} campus, 
									 Instructor:${data.instructor}
									</li>`;	
		}
	}
	$(listClassName).append(htmlString);
}

//Course already registered for
function alreadyRegisteredForCourse(currentListId, ajaxData){
	let alreadyRegisteredFor = false;
	$.ajax({
		type: 'GET',
		url: '/students',
		data: ajaxData,
		success: function(data){
			if(data.studentrecords.length > 0){
				alreadyRegisteredFor = true;
				displayErrorMessage('You have already registered for the course!', 'red');
				$(`.search-result-list li[id=${currentListId}] input[type=checkbox]`).prop('checked', false);
				//enableButtonIfCheckboxChecked();
			}
		},
		failure: function(status){
			console.log('Failure', status);
		}
	});
	return alreadyRegisteredFor;
}

//Course already saved in cart
function classAlreadySavedInCart(currentListId, ajaxData){
	let courseAleardyInCart = false;
	$.ajax({
		type: 'GET',
		url: '/search/cart',
		data: ajaxData,
		success: function(result){
			if (result.carts.length > 0) {
				courseAleardyInCart = true;
			} 
		},
		failure: function(status){
			console.log('Failure', status);
		}
	});
	return courseAleardyInCart;
}

//Course already selected 
function courseAlreadySelected(currentListId){
	const currentCourse = currentListId.substr(0,7);
	let alreadySelected = false;
	$('.search-result-list li input[type=checkbox]:checked').each(function(){
		const selectedBox = $(this).attr('value');
		const course = selectedBox.substr(0,7);
		if(((selectedBox !== currentListId) && (currentCourse === course))) {
			alreadySelected = true;
		};
	})
	return alreadySelected;
}

function theSameList(currentListId){
	const currentCourse = currentListId.substr(0,7);
	let theSameItem = false;
	$('.search-result-list li input[type=checkbox]:checked').each(function(){
		const selectedBox = $(this).attr('value');
		const course = selectedBox.substr(0,7);
		if(selectedBox === currentListId) {
			theSameItem = true;
		};
	});

	console.log(theSameItem);
	return theSameItem;	
}


//Add sections to cart - buffer area
function updateSectionCart(){
	$('.search-result-list').on('change', 'li input[type=checkbox]', function(){
		displayErrorMessage('');
		const currentListId = $(this).attr('value');
		const sectionName = currentListId.split("-");
		const courseName = sectionName[0] + '-' + sectionName[1];
		let courseAleardyInCart = false;
		const checked = $(`.search-result-list li[id=${currentListId}]`).html();
		const subject = sectionName[0];
		const coursenumber = sectionName[1];
		const ajaxData =`studentid=${publicState.studentId}&
						semester=${publicState.semester}&
						subject=${subject}&
						coursenumber=${coursenumber}`;
		const studentid = publicState.studentId;
		const selectedSemester = publicState.semester;
		
		if(this.checked) {	
			if(alreadyRegisteredForCourse(currentListId, ajaxData)){
				displayErrorMessage('You have already registered for the course!', 'red');
				$(`.search-result-list li[id=${currentListId}] input[type=checkbox]`).prop('checked', false);
			} else if(classAlreadySavedInCart(currentListId, ajaxData)){
				displayErrorMessage('Course is already saved in cart!', 'red');
				$(`.search-result-list li[id=${currentListId}] input[type=checkbox]`).prop('checked', false);
			} else if (courseAlreadySelected(currentListId)) {

				displayErrorMessage('Course is already selected!', 'red');
				$(`.search-result-list li[id=${currentListId}] input[type=checkbox]`).prop('checked', false);

			} else if(checkConflict(currentListId, '.search-result-list')) {
				$(`.search-result-list li[id=${currentListId}] input[type=checkbox]`).prop('checked', false);
			} else if(conflictWithAlreadyRegistered(currentListId)){
				displayErrorMessage('Not enough driving time to get to your next class', 'red');
				$(`.search-result-list li[id=${currentListId}] input[type=checkbox]`).prop('checked', false); 
			} else if (conflictWithCart(currentListId)) {
				displayErrorMessage('Not enough driving time to get to your next class', 'red');
				$(`.search-result-list li[id=${currentListId}] input[type=checkbox]`).prop('checked', false); 
			}
		};
		enableButtonIfCheckboxChecked();
	});
}
$(updateSectionCart);

//Checkes schedule conflicts within or multiple campuses
function checkConflict(currentListId, listParent){
	let conflict = false;
	const checkedMeetingDaysArray = $(`.search-result-list li[id=${currentListId}]`).attr("data-meetingdays").toLowerCase().split(',');
	let checkedCampus = $(`.search-result-list li[id=${currentListId}]`).data().campus; 
	const starttimeSearchResult = convertToDateTime($(`.search-result-list li[id=${currentListId}]`).attr("data-starttime"));
	const endtimeSearchResult = convertToDateTime($(`.search-result-list li[id=${currentListId}]`).attr("data-endtime"));
	checkedMeetingDaysArray.map(function(day) {
		$('.search-result-list li input[type=checkbox]:checked').each(function() {
			const listToCompareId = $(this).attr('value');
			if(!(currentListId === $(this).attr('value'))) {
				const campusToCompare = $(`.search-result-list li[id=${listToCompareId}]`).attr("data-campus").toLowerCase();
				const meetingDaysToCompareArray = $(`.search-result-list li[id=${listToCompareId}]`).attr("data-meetingdays").toLowerCase().split(',');
				const starttimeToCompare = convertToDateTime($(`.search-result-list li[id=${listToCompareId}]`).attr("data-starttime"));
				const endtimeToCompare = convertToDateTime($(`.search-result-list li[id=${listToCompareId}]`).attr("data-endtime"));
				let timeDiffInMinutes = 0;
				if(Math.abs(starttimeToCompare - starttimeSearchResult) > 55) {
					if(endtimeSearchResult >= starttimeToCompare){
						timeDiffInMinutes = Math.floor(starttimeSearchResult - endtimeToCompare) ;
					} else if(endtimeSearchResult < starttimeToCompare){
						timeDiffInMinutes = Math.floor(starttimeToCompare - endtimeSearchResult);
					}
				} 
				for(let i = 0; i < meetingDaysToCompareArray.length; i++){
					if(day === meetingDaysToCompareArray[i]){
						if(checkedCampus !== campusToCompare && timeDiffInMinutes < 55){
							conflict = true;
							displayErrorMessage('Registering for multiple campuses! Not enough driving time to get to your next class', 'red');
							$(`.search-result-list li[id=${currentListId}] input[type=checkbox]`).prop('checked', false); 
						} else if(checkedCampus === campusToCompare && timeDiffInMinutes < 5) {
							conflict = true;
							displayErrorMessage('Not enough time between classes!', 'red');
							$(`.search-result-list li[id=${currentListId}] input[type=checkbox]`).prop('checked', false); 
						}
					}
				}
			}
		})
	});

	return	conflict;
}

function conflictWithAlreadyRegistered(currentListId) {
	const ajaxData =`studentid=${publicState.studentId}&
					semester=${publicState.semester}`;
	$.ajax({
		type: 'GET',
		url: '/students',
		data: ajaxData,
		success: function(data){
			if (conflictWithAlreadyRegisteredOrInCart(currentListId, data.studentrecords)) {
				return true;
			}
		},
		failure: function(status){
			console.log('Failure', status);
		}
	});
	return false;
}

function conflictWithAlreadyRegisteredOrInCart(currentListId, data){
	const checkedMeetingDaysArray = $(`.search-result-list li[id=${currentListId}]`).attr("data-meetingdays").toLowerCase().split(',');
	let checkedCampus = $(`.search-result-list li[id=${currentListId}]`).data().campus; 
	const starttimeSearchResult = convertToDateTime($(`.search-result-list li[id=${currentListId}]`).attr("data-starttime"));
	const endtimeSearchResult = convertToDateTime($(`.search-result-list li[id=${currentListId}]`).attr("data-endtime"));
	checkedMeetingDaysArray.map(function(day) {
		data.map(function(record) {
			let meetingDaysToCompareArray = [];
			for(let i = 0; i< publicState.days.length; i++) {
				if(record[publicState.days[i]] === "Y") {
					meetingDaysToCompareArray.push(publicState.days[i].toLowerCase());
				};
			};
			const listToCompareId = `${record.subject}-${record.coursenumber}-${record.section}`;
			const campusToCompare = record.campus.toLowerCase();
			const starttimeToCompare = convertToDateTime(record.starttime);
			const endtimeToCompare = convertToDateTime(record.endtime);
			let timeDiffInMinutes = 0;
			if(Math.abs(starttimeToCompare - starttimeSearchResult) > 55) {
				if(endtimeSearchResult >= starttimeToCompare){
					timeDiffInMinutes = Math.floor(starttimeSearchResult - endtimeToCompare) ;
				} else if(endtimeSearchResult < starttimeToCompare){
					timeDiffInMinutes = Math.floor(starttimeToCompare - endtimeSearchResult);
				};
			};
			for(let i = 0; i < meetingDaysToCompareArray.length; i++){
				if(day === meetingDaysToCompareArray[i]){
					if(checkedCampus !== campusToCompare && timeDiffInMinutes < 55){
						displayErrorMessage('Registering for classes at multiple campuses! Not enough driving time to get to your next class', 'red');
						$(`.search-result-list li[id=${currentListId}] input[type=checkbox]`).prop('checked', false); 
						return true
					} else if(checkedCampus === campusToCompare && timeDiffInMinutes < 5) {
						displayErrorMessage('Not enough time between classes', 'red');
						$(`.search-result-list li[id=${currentListId}] input[type=checkbox]`).prop('checked', false); 
						return true;
					}
				};
			};
		});
	});
	return false;
}

function conflictWithCart(currentListId) {
	const ajaxData =`studentid=${publicState.studentId}&
					semester=${publicState.semester}`;
	$.ajax({
		type: 'GET',
		url: '/search/cart',
		data: ajaxData,
		success: function(data){
			if (conflictWithAlreadyRegisteredOrInCart(currentListId, data.carts)) {
				return true;
			}
		},
		failure: function(status){
			console.log('Failure', status);
		}
	});
	return false;
}

//Count records 
function countRecords(){
	//registered count
	const ajaxData =`studentid=${publicState.studentId}&
					semester=${publicState.semester}`;
	$.ajax({
		type: 'GET',
		url: '/students',
		data: ajaxData,
		success: function(data){
			$('.registered-count').html(`(${data.studentrecords.length})`)
		},
		failure: function(status){
			console.log('Failure', status);
		}
	});

	const today = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'][(new Date()).getDay()];
	const ajaxTodayData = `studentid=${publicState.studentId}&semester=${publicState.semester}&${today}=Y`;
		$.ajax({
			url: '/students',
			type: 'GET', 
			dataType: 'json',
			data: ajaxTodayData,
			success: function(data) {
				$('.registered-today-count').html(`(${data.studentrecords.length})`);
			},
			failure: function(status){
				console.log('Failure', status);
			}

		});



	//Count cart
	const ajaxDataCart =`studentid=${publicState.studentId}&
					semester=${publicState.semester}`;
	$.ajax({
		type: 'GET',
		url: '/search/cart',
		data: ajaxDataCart,
		success: function(data){

			$('.cart-count').html(`(${data.carts.length})`);
		},
		failure: function(status){
			console.log('Failure', status);
		}
	});
}

function registerFromCart(){
	$('.register-from-cart-button').click(function(event) {
		event.preventDefault();
		$('.sec-cart-list li input[type=checkbox]:checked').each(function(){
			const sectionName = $(this).attr('value').split("-");
			let searchURL = `/sections/?subject=`+sectionName[0];
			searchURL = searchURL+`&coursenumber=`+sectionName[1];
			searchURL = searchURL+`&section=`+sectionName[2];

			let regURL = `/students/?studentid=`+publicState.studentId;
			regURL = regURL+`&semester=`+publicState.semester;
			regURL = regURL+`&subject=`+sectionName[0];
			regURL = regURL+`&coursenumber=`+sectionName[1];

			$.get(regURL, function(data){
					if((data.studentrecords.length === 0)){
						registerOrSaveSectionsInCart(searchURL, '/students', 'reg');
					};
			});
		});


	})
}
$(registerFromCart);



//Append checked search result list to cart
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

//Display error message or instruction
function displayErrorMessage(errorMessage, messageColor = 'blue'){
	$('.display-error').html(errorMessage);
	$('.display-error').css('color',  messageColor);
}

//Clear error messages on input changes
function clearErrorMessage(){
	$('.group input').keyup(function(){
		$('.group input').each(function(){
			if($(this).val().length > 0){
				displayErrorMessage('');
			}
		})
	})
	$('.group select').on('change', function(event){
		event.preventDefault();
		displayErrorMessage('');
	})
}
$(clearErrorMessage);

//POST method - save classes to cart or register for 
function registerOrSaveSectionsInCart(searchURL, ajaxURL, registrationStatus){
	$.get(searchURL, function(result){
		result.sections.map((sec) => {
			$.ajax({
				url: ajaxURL,
				type: 'POST',
				dataType: 'json',
				contentType: 'application/json',
				data: JSON.stringify({
					studentid: publicState.studentId,
					firstname: publicState.firstName,
					lastname: publicState.lastName,
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
						displayErrorMessage('Registered for course successfully!', 'blue');
					} else if (registrationStatus === 'cart') {
						const studentid = publicState.studentId;
						const selectedSemester = publicState.semester;
						$('.sec-cart-list').empty();
						refreshClassesInCart();
						refreshSearchResult();
						displayErrorMessage('Course saved in cart successfully!', 'blue');
					};
				},
				error: function(jqXhr, textStatus, errorThrown){
					console.log(errorThrown);
				}
			});
		});
	});
};

//Pull registered classes to display in registered sections list
function registrationSuccessful(data){
	appendDataToList(data, '.sec-registered-list');
	removeListFromSearchResult();
	sortList('.sec-registered-list');
	//listAndMapDailySchedule();
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


//A call back function to highlight a newly registered class
function callback(currentList) {
	setTimeout(function() {
  		$(currentList).removeClass("new-sec-registered-list");
    }, 2000 );
  }

//To register classes on button click event
function registerForClasses(){
	$('.register-button').on('click', function(event){
		event.preventDefault();
		$('.search-result-list li input[type=checkbox]:checked').each(function(){
			const sectionName = $(this).attr('value').split("-");
			let searchURL = `/sections/?subject=`+sectionName[0];
			searchURL = searchURL+`&coursenumber=`+sectionName[1];
			searchURL = searchURL+`&section=`+sectionName[2];

			let regURL = `/students/?studentid=`+publicState.studentId;
			regURL = regURL+`&semester=`+publicState.semester;
			regURL = regURL+`&subject=`+sectionName[0];
			regURL = regURL+`&coursenumber=`+sectionName[1];
			$.get(regURL, function(data){
					if((data.studentrecords.length === 0)){
						registerOrSaveSectionsInCart(searchURL, '/students', 'reg');
					};
			});
		});

		displayErrorMessage('');
		//clearAllRecordsFromCart();
		refreshSearchResult();
		//listAndMapDailySchedule();
	});
}
$(registerForClasses);

//Save classes in cart for future use
function saveClassesToCart(){
	$('.save-cart-button').on('click', function(event){
		event.preventDefault();
		let currentListId;
		const studentid = publicState.studentId;
		const selectedSemester = publicState.semester;

		
		$('.search-result-list li input[type=checkbox]:checked').each(function(){
			currentListId = $(this).attr('value');
			let sectionName = $(this).attr('value').split("-");

			let searchURL = `/sections/?subject=`+sectionName[0];
			searchURL = searchURL+`&coursenumber=`+sectionName[1];
			searchURL = searchURL+`&section=`+sectionName[2];
			searchURL = searchURL+`&semester=${publicState.semester}`;

			let cartURL = `/search/cart/?studentid=`+publicState.studentId;
			cartURL = cartURL+`&semester=`+publicState.semester;
			cartURL = cartURL+`&subject=`+sectionName[0];
			cartURL = cartURL+`&coursenumber=`+sectionName[1];

			$.get(cartURL, function(data){
					if((data.carts.length === 0)){
						registerOrSaveSectionsInCart(searchURL, '/students/cart','cart');
					}
			});
		});
		countRecords();
		displayErrorMessage('');
	});
}
$(saveClassesToCart);


//Display registered classes
function pullRegisteredClasses(){
	let searchURL = `/students/?studentid=${publicState.studentId}&semester=${publicState.semester}`;
	if(publicState.studentId.length >= 3 && publicState.semester.length >= 6){
	$.get(searchURL, function(data){
		$('.sec-registered-list').empty();
		sortJsonObject(data.studentrecords);
		if(data.studentrecords.length > 0) {
			data.studentrecords.map((student) => {
				appendDataToList(student, '.sec-registered-list');
				sortList($('.sec-registered-list'));
			});
		} else {
			displayErrorMessage(`You do not have registered classes for the semester. You can search and register for classes`, 'blue')
		}
	});
	}
}


//Display and map schedule for the day
function listAndMapDailySchedule(){
	const today = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'][(new Date()).getDay()];
	studentid = publicState.studentId;
	semester = publicState.semester;
	const ajaxData = `studentid=${publicState.studentId}&semester=${publicState.semester}&${today}=Y`;
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



//Convert string time to date time to sort lists based on the returned date-time
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
		return Math.floor(_time.setHours(hours, minutes)/60000);
	}
}

//sort registered classes
function sortList(listElemToSort) {
  $(listElemToSort).html(
    $(listElemToSort).children('li').sort(function (a,b){
    	return convertToDateTime($(a).data('starttime')) - convertToDateTime($(b).data('starttime'));
    })
  );
};

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


//DELETE - delete selected student record(s)
function clearSelectedRecordFromCart(){
	$('.sec-cart-list li input[type="checkbox"]').each(function(index){
		const sectionName = $(this).attr('value').split("-");
		const currentListId = $(this).attr('value');
		const studentid = publicState.studentId; 
		const selectedSemester = publicState.semester;
		const searchURL = `/search/cart/?studentid=${publicState.studentId}&subject=${sectionName[0]}&coursenumber=${sectionName[1]}`;
		const checked = $(`.sec-cart-list li[id=${currentListId}]`).html();
		if(this.checked) {
			$.get(searchURL, function(data){
				data.carts.map((cart) => {
					const ajaxURL = `/search/cart/${cart.id}`;
					$.ajax({
						url: ajaxURL,
						type: 'DELETE',
						success: function(result){
							$(`.sec-cart-list li[id=${currentListId}]`).remove();
							pullClassesFromCart();
							if ($('.search-result-list li').length !== 0) {
								renderSections();
							}
						}
					});
				}); 
			});
		}
	});
}

//Clear classes saved in cart
function clearAllRecordsFromCart(){
	$('.sec-cart-list li').each(function(index){
		const sectionName = $(this).attr('id').split("-");
		const currentListId = $(this).attr('id');
		const studentid = publicState.studentId; 
		const selectedSemester = publicState.semester;
		const searchURL = `/search/cart/?studentid=${publicState.studentId}&subject=
							${sectionName[0]}&coursenumber=${sectionName[1]}&
							semester=${publicState.semester}`;
		$.get(searchURL, function(data){
			data.carts.map((cart) => {
				$.ajax({
					url: `/search/cart/${cart.id}`,
					type: 'DELETE',
					success: function(result){
						refreshSearchResult();
					}
				});
			}); 
		});
	});
	$('.sec-cart-list').empty();
}

function clearAllCoursesFromCart(){
	$('.clear-all-cart-button').on('click', function(event){
		event.preventDefault();
		clearAllRecordsFromCart();
		if ($('.search-result-list li').length !== 0) {
			renderSections();
		}
		displayErrorMessage('');
	})
}
$(clearAllCoursesFromCart());


//Clear selected student record from cart
function clearStudentRecordFromCart(){
	$('.clear-cart-button').on('click', function(event){
		event.preventDefault();
		clearSelectedRecordFromCart();
		if ($('.search-result-list li').length !== 0) {
			renderSections();
		}
		displayErrorMessage('');
	})
}
$(clearStudentRecordFromCart);

//Clear selected student record from cart
function clearSelectedClassFromRegistration(){
	$('.sec-registered-list li input[type="checkbox"]:checked').each(function(index){
		const sectionName = $(this).attr('value').split("-");
		const currentListId = $(this).attr('value');
		const studentid = publicState.studentId; 
		const selectedSemester = publicState.semester;
		const searchURL = `/students/?studentid=${publicState.studentId}&subject=${sectionName[0]}&
							coursenumber=${sectionName[1]}&semester=${publicState.semester}`;
		const checked = $(`.sec-registered-list li[id=${currentListId}]`).html();
		if(this.checked) {
			$.get(searchURL, function(data){
				data.studentrecords.map((studentrecord) => {
					const ajaxURL = `/students/${studentrecord.id}`;
					$.ajax({
						url: ajaxURL,
						type: 'DELETE',
						success: function(result){
							$(`.sec-registered-list li[id=${currentListId}]`).remove();
							if ($('.search-result-list li').length !== 0) {
								renderSections();
							}
						}
					});
				}); 
			});
		}
	});
}


//Update grade and course status (by instructor)
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
		const studentid = publicState.studentId; 
		const selectedSemester = publicState.semester;
		const searchURL = `/students/?studentid=${publicState.studentId}&subject=${sectionName[0]}&
							coursenumber=${sectionName[1]}&semester=${publicState.semester}`;
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
						displayErrorMessage('Data updated successfully', 'blue');
						openStudentInstructorClass();
					}
				});
				});
			});
		}
	});
}

//Refresh registered classes to registered classes space
function refreshRegisteredClasses(){
	const studentid = publicState.studentId; 
	const selectedSemester = publicState.semester;
	let searchURL = `/students/?studentid=${publicState.studentId}&semester=${publicState.semester}`;
	$.get(searchURL, function(data){
		$('.sec-registered-list').empty();
		data.studentrecords.map((studentrecord) => {
			appendDataToList(studentrecord, '.sec-registered-list');
			removeListFromSearchResult();
			sortList('.sec-registered-list');
		});
	});
}

//Refresh classes saved in cart
function refreshClassesInCart(){
	const studentid = publicState.studentId; 
	const selectedSemester = publicState.semester;
	let searchURL = `/search/cart/?studentid=${publicState.studentId}&semester=${publicState.semester}`;
	$.get(searchURL, function(data){
		$('.sec-cart-list').empty();
		data.carts.map((cart) => {
			appendDataToList(cart, '.sec-cart-list');
			removeListFromSearchResult();
			sortList('.sec-cart-list');
		});
	});
}


function dropClassFromRegistration(){
	$('.drop-class-button').on('click', function(event){
		event.preventDefault();
		clearSelectedClassFromRegistration();
		const studentid = publicState.studentId; 
		const selectedSemester = publicState.semester;
		if(publicState.studentId){
			pullRegisteredClasses();
			refreshRegisteredClasses();
			if ($('.search-result-list li').length !== 0) {
				renderSections();
			}
			displayErrorMessage('');
		}

	})
}
$(dropClassFromRegistration);

//Google Maps
//To add marks on campus locations
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

//Add event listner to infoWindow on markers
function addEventListner(marker, markerString){
  google.maps.event.addListener(marker, 'click', function(){
  	publicState.infoWindow.close();
    publicState.infoWindow.setContent(markerString);
    publicState.infoWindow.open(publicState.map ,marker);
  }); 
}

//Add driving route using way points method - classes sequences for the day
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
		} else {
			console.log(status);
		}
	})
}

//clear routes
function clearRoute(){
    if (publicState.directionsDisplay != null) {
      publicState.directionsDisplay.setMap(null);
  }
}

