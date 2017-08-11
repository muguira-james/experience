// get radian of input degree
toRad = function(n) {
   var z = n* Math.PI / 180;
   //console.log(n,z);
   return z
};

// turn radian input into degree
toDeg = function(n) {
   return n * 180 / Math.PI;
};

// returns a point bearing, radius from latlng
destinationPoint = function(latlng, brng, dist) {

   dist = dist / 6371;
   brng = toRad(brng);

   var lat1 = toRad(latlng.lat), lon1 = toRad(latlng.lng);

   //console.log(brng,latlng.lat, latlng.lng, lat1,lon1);
   var lat2 = Math.asin(Math.sin(lat1) * Math.cos(dist) +
                        Math.cos(lat1) * Math.sin(dist) * Math.cos(brng));

   var lon2 = lon1 + Math.atan2(Math.sin(brng) * Math.sin(dist) *
                                Math.cos(lat1),
                                Math.cos(dist) - Math.sin(lat1) *
                                Math.sin(lat2));

   // console.log("1",latlng, "brng: ", brng, "dist: ", dist, "lat: ",lat2,"lng: ",lon2);
   if (isNaN(lat2) || isNaN(lon2)) return null;
   //console.log("2", "lat: ",lat2,"lng: ",lon2);
   var pt = new google.maps.LatLng(toDeg(lat2),toDeg(lon2));

   return pt;
};

var Icon2ZoomSize = function(z) {
  switch(z) {
    case 14: { return 60; break; }
    case 15: { return 65; break; }
    case 16: { return 70; break; }
    case 17: { return 75; break; }
    case 18: { return 80; break; }
    case 19: { return 85; break; }ß
  }
};
var computeBounds4Hole = function(c) {
  var minLat = 1000, maxLat = -1000, minLng = 1000, maxLng = -1000;
  for (j=0; j<c.length; j++) {
    if (c[j].lat < minLat) {
      minLat = c[j].lat;
    }
    if (c[j].lat > maxLat) {
      maxLat = c[j].lat;
    }
    if (c[j].lng < minLng) {
      minLng = c[j].lng;
    }
    if (c[j].lng > maxLng) {
      maxLng = c[j].lng;
    }
  }
  //console.log(minLat.toPrecision(8), maxLat.toPrecision(8), minLng.toPrecision(8), maxLng.toPrecision(8));

  var mm_lat, mn_lng, mx_lat, mx_lng;
  mn_lat = minLat - 0.0007;
  mx_lat = maxLat + 0.0007;
  mn_lng = minLng - 0.0007;
  mx_lng = maxLng + 0.0007;

  var m = [];
  m.push(new google.maps.LatLng(mn_lat, mn_lng));
  m.push(new google.maps.LatLng(mn_lat, mx_lng));
  m.push(new google.maps.LatLng(mx_lat, mx_lng));
  m.push(new google.maps.LatLng(mx_lat, mn_lng));

  return m;
};

var CurrentViewId = {
  COURSE_VIEW: 0,
  DEFAULT_VIEW: 1,
  DETAIL_VIEW: 2,
  HOLE_VIEW: 3,
  properties: {
    0: {name: "course", value: 0, code: "C"},
    1: {name: "default", value: 1, code: "Df"},
    2: {name: "detail", value: 2, code: "Dt"},
    3: {name: "hole", value: 3, code: 'H'}
  }
};


var InfoObject = function() {

};

var preferences = {

  "TrumpNationLatLng": {lat: 40.65382, lng: -74.69614},
  "AusyDemo": {lat: -25.363, lng: 131.044},
  "iconSize": 12,
  "currentHole2Draw": 1,
  "currentLocationHole": 1
}
