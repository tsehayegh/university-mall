
let publicState = (function() {
   return {
      map: null,
      infoWindow: null,
      markers: [],
      directionsDisplay: null,
      currentLocation: {},
      days: ["sun", "mon", "tue", "wed", "thu", "fri", "sat"],
      userRole: null,
      mediaQueryList: {
      	orientationPortrait: window.matchMedia("(orientation: portrait)"),
      	orientationLandscape: window.matchMedia("(orientation: landscape)"),
      	maxWidthSmall: window.matchMedia("(max-width: 480px)"),
      	maxWidthMedium: window.matchMedia("(max-width: 767px)"),
      	minWidthLarge: window.matchMedia("(min-width: 768px)")
      }
   };
}());


