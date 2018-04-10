# University Mall

# https://university-mall.herokuapp.com/

# landingpage
<img width="889" alt="university mall - landingpage" src="https://user-images.githubusercontent.com/34139675/38458457-94ecfb10-3a6c-11e8-942e-9b9263f5b70a.png">

# student page 1
<img width="1676" alt="university mall - student page1" src="https://user-images.githubusercontent.com/34139675/38458484-e5706824-3a6c-11e8-9693-0cab476c1960.png">

# student page 2
<img width="1669" alt="university mall - student page 2" src="https://user-images.githubusercontent.com/34139675/38458472-cdc748aa-3a6c-11e8-98cf-57d82e941e4c.png">

# instructor page
<img width="1669" alt="university mall - instructor page" src="https://user-images.githubusercontent.com/34139675/38458475-d7de8f92-3a6c-11e8-9150-28764c138563.png">

# Background and functionality
Higher education institutions use different applications to manage their course offerings. Most of the large higher education institutions (universities or community colleges) build satellite campuses to offer classes at convenient locations throughout the region they server. In a multi campus institutions, students may want to take classes offered at multiple campuses. The existing applications may help them if there is any schedule conflict in terms of time but they do not control if there is not enough time between classes located at different campuses. My app, University Mall, will help them not only to check for any time conflicts within the same campus but also at multiple campuses. The app will also display the routes for the day on google maps. For the purpose of demonstration, I have selected one of the largest community colleges in North Carolina which has multiple campuses.
In this app:
(1)
	users will choose their role- student or instructor
(2)
	if the user is a student, then the user will be able to:
	(a) enter their student id, first name, last name, the current semester
	(b) see their sections saved in cart, registered sections for the semester, registered sections for the day. The daily class schedules will be listed and displayed on google maps. The classes will be marked as A, B, .. on the map based on their sequence for the day.
	(c) search new classes, save the classes in cart, or register directly.
	(d) delete classes saved in cart, or drop registered classes (for the future, this can be enabled or disabled based on the start date of the class)
(3)
if the user is an instructor, then the user will be able to:
	(a) search for a student by entering student and class information.
	(b) able to enter grade and status of the class

The app tests for screen size using MediaQueryList techniques. Some class information will be omitted from displaying in the lists if the screen size is smaller than 767 pixels (iPads and phones).

# How to use the app ##
# Student role ##
	Enter student id, first and last name, and select current semester
	If student record with the entered criteria was found, the information will be displayed (listed) on the right hand side of the form
	If student record was not found, then the user can search for classes by selecting subject, course number, campus and search results will be listed on the right side of the page
	The user can check (or uncheck) a selected section and that section will be populated in the cart's place
	The user can either save sections in cart or register for the sections directly.
	The user can clear selected sections from cart or clear all sections saved cart.
	The user can also drop already registered classes
# Instructor role ##
	The user can enter student id, student first and last name, instructor last name, subject, course number, and semester.
	A class registered will be displayed in the right hand side of the page
	The instructor can enter a grade and status of the section (class)

# Technologies used:
HTML, CSS, Responsive Design, JAVASCRIPT, jQuery, AJAX, Goodle Maps API, node.js, Implement REST API, heroku, mLab, express, testing, modulirzation, router, chai, http-chai, and Travis CI.

# Future work  ##
More functionality can be added to the app. For example, a login feature can be included. Nowadays, most colleges use apps that help users to use the same login credential for any services offered. Moreover, the instructor can enter student ID and the app can be customized to pull student profile instead of the instructor typing in first and last name. 


# Note
The app may not work in Internet Explorer 11 because of some jQuery techniques ($).
