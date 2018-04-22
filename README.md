# University Mall

# https://university-mall.herokuapp.com/

# Landing Page (1)
<img width="467" alt="university mall - landing page" src="https://user-images.githubusercontent.com/34139675/39090085-e8429f54-45a2-11e8-9b02-24b39ad51437.png">
# User Information (2)
<img width="484" alt="university mall - user information" src="https://user-images.githubusercontent.com/34139675/39090095-f7148aec-45a2-11e8-9005-1f2a2f316670.png">
# Main Page (3)
<img width="467" alt="university mall - main page view 1" src="https://user-images.githubusercontent.com/34139675/39090094-f707990e-45a2-11e8-9fc1-7f438defb218.png">
# Search Page (4)
<img width="452" alt="university mall - search page 1" src="https://user-images.githubusercontent.com/34139675/39090093-f6fa28be-45a2-11e8-9a44-27294b7278f3.png">

# Search Result View 1 (5)
<img width="444" alt="university mall - search result view 2" src="https://user-images.githubusercontent.com/34139675/39090092-f6ef411a-45a2-11e8-9676-99cf8edea242.png">

# Search Result View 2 (6)
<img width="440" alt="university mall - search result view 3" src="https://user-images.githubusercontent.com/34139675/39090091-f6da86f8-45a2-11e8-8485-743aa0473f88.png">

# Registered Classes View 1 (7)
<img width="434" alt="university mall - registered classes view 1" src="https://user-images.githubusercontent.com/34139675/39090090-f6c64576-45a2-11e8-8c50-83fca796f247.png">

# Registered Clsses View 2 (8)
<img width="451" alt="university mall - registered classes view 2" src="https://user-images.githubusercontent.com/34139675/39090089-f6bb5f76-45a2-11e8-9bcb-dc8b403fe96a.png">

# Classes for Today (9)
<img width="450" alt="university mall - classes for today" src="https://user-images.githubusercontent.com/34139675/39090088-f6aec324-45a2-11e8-99ce-100768542a15.png">

# Shopping Cart View 1 (10)
<img width="461" alt="university mall - cart view 1" src="https://user-images.githubusercontent.com/34139675/39090087-f6a482ba-45a2-11e8-8db0-dcb1b1ca68dc.png">

# Shopping Cart 2 (11)
<img width="451" alt="university mall - cart view 2" src="https://user-images.githubusercontent.com/34139675/39090086-f697d0ec-45a2-11e8-88f0-569a2505c157.png">


# Background and functionality
Higher education institutions use different applications to manage their course offerings and course schedules. Most of the large higher education institutions (universities or community colleges) build satellite campuses to offer classes at convenient locations throughout the region they server. In a multi-campus institutions, students may want to take classes offered at multiple campuses. The existing applications may help them if there is any schedule conflict in terms of time but they do not control if there is not enough time between classes located at different campuses. My app, University Mall, will help users, not only to check for any time conflicts within the same campus but also at multiple campuses. The app will also display the routes for the day on google maps. For the purpose of demonstration, I have selected one of the largest community colleges in North Carolina which has multiple campuses. 

# In this app, users will be able to: 
(a) enter their student id, first name, last name, the select a current semester
(b) see their active classes (registered for) for the semester
(c) see any classes saved in cart, 
(d) registered classes for the day. The daily class schedules will be listed and displayed on google maps with driving routes marked as A, B, .. on the map based on their sequence for the day. 
(e) search new classes, save the classes in cart, or register directly. 
(f) delete classes saved in cart, or drop registered classes (for the future, this can be enabled or disabled based on the start date of the class)
The app tests for screen size using MediaQueryList techniques. Some class information will be omitted from displaying in the lists if the screen size is smaller than 768 pixels.

# How to use the app?
	The user will see a landing page with some of main features of the app and a start button to begin using the app. (Form 1)
	Once the user clicks (or hits the enter key), the user will be promoted to enter their student id, first name, last name, and select a current semester from a dropdown menu. (Form 2)
	If the user enters correct information (3-digit student id, at least two character first and last names and select a current semester then they will land in a new form with a menu bar that lists the services offered by the app.  (Form 3)
	If wrong user information is entered then a message will appear at the top of the page and the cursor will focus on the student id text box.
# Home 
		– this menu will refresh the page and restart the app.
#Search and Register – 
	this menu will open a new search area where a user may enter (optional) filtering criteria and click the search button. The search area will disappear and the search results will be listed. The list of a search result will have a checkbox, a link to the course, and other class information.
		If the user decided to register for or save a class in a shopping cart then the user can either check the checkbox next to the class or click the course (ex. ENG-111 is English and the course number is 111).
		If the class time with respect location  does not conflict with other selected or previously registered (or saved in cart) class schedules then a tick mark will be shown on checkmark. Otherwise, a message will be displayed at the top of the page telling the user why it was not possible to select class.
		The user can either register for the selected class (or classes) directly or save them in a shopping cart for future use.
			If the user was able to register for the class successfully then a success message will be displayed at the top of the page.
# Registered Classes () 
	– this menu lists all classes registered for the semester and the number of classes will be shown in parenthesis next to the menu name. I have used ‘n’ to represent class numbers. The list of registered classes has a checkbox (or course name with a link) and user can select one or multiple classes to drop the class for the semester. Another button can be added if the user prefers to transfer the class into a shopping cart rather than dropping it.
# Today’s Classes () – 
	this menu lists the classes for the day and a driving route from one class to the next class in sequential order of alphabets. A is the first class and B will be the second class and so on. If there is only one class a single alphabet will be displayed at the exact location of the campus.
# Cart () – 
	this menu lists the classes saved in a shopping cart. Each list of class has a checkbox and the user can either register for the class or delete the class from cart. 


# Technologies used:
HTML, CSS, Responsive Design, JAVASCRIPT, jQuery, AJAX, Goodle Maps API, node.js, Implement REST API, mocha, heroku, mLab, express, testing, modulirzation, router, chai, http-chai, and Travis CI.

# Future work  ##
More functionality can be added to the app. For example, a login feature can be included. Nowadays, most colleges use apps that help users to use the same login credential for any services offered. Moreover, the instructor can enter student ID and the app can be customized to pull student profile instead of the instructor typing in first and last name. The drop down fields could also be populated programmatically.


# Note
The app may not work in Internet Explorer 11 because of some jQuery techniques employed in developing the app.
