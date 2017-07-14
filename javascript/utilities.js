
function drawHoleLayout(holeNumber, geometry, Tphoto, Flagphoto, FlagLocation, tLocation) {
  //console.log(holeNumber + "    " + holeLatLong);
  //console.log(holeLatLong.Features[1]);
  var indx = holeNumber - 1;

  // console.log(indx);

  var holeStyle = { "color": "#ffff00", "weight": 2, "opacity": 0.65 };
  L.geoJSON(geometry, {style: holeStyle}).addTo(myFeatureGroup);



  //var Tee_icon = new TeeIcon( { iconUrl: Tphoto });
  //var Pin_icon = new PinIcon( { iconUrl: Flagphoto});
  //console.log(geometry, tLocation);
  //L.marker(tLocation, {icon: Tee_icon}).addTo(myFeatureGroup);

  //L.marker(FlagLocation, {icon: Pin_icon}).addTo(myFeatureGroup);

  // var z = new L.Marker(holeLatLong.Features[indx].properties.labelLocation, {
  //   icon: new L.DivIcon({
  //       className: 'my-div-icon',
  //       iconSize: new L.Point(120,50),
  //       html: '<h3>Hole 1: 464 Yards</h3>'
  //     })
  // }).addTo(mymap);
}

var toRad = function(n) {
   var z = n* Math.PI / 180;
   //console.log(n,z);
   return z
}

var toDeg = function(n) {
   return n * 180 / Math.PI;
}

var destinationPoint = function(latlng, brng, dist) {
   dist = dist / 6371;
   brng = toRad(brng);

   var lat1 = toRad(latlng[0]), lon1 = toRad(latlng[1]);

   //console.log(brng,latlng[0], latlng[1], lat1,lon1);
   var lat2 = Math.asin(Math.sin(lat1) * Math.cos(dist) +
                        Math.cos(lat1) * Math.sin(dist) * Math.cos(brng));

   var lon2 = lon1 + Math.atan2(Math.sin(brng) * Math.sin(dist) *
                                Math.cos(lat1),
                                Math.cos(dist) - Math.sin(lat1) *
                                Math.sin(lat2));

   if (isNaN(lat2) || isNaN(lon2)) return null;
   //console.log(lat2,lon2);
   return new L.LatLng(toDeg(lat2), toDeg(lon2));
}

function drawPlayersOnHole(holeFeature, layer, playerdb) {

  var teeOffset = 90;
  var fairwayOffset = 90;
  var greenOffset = 90;
  var startPoint ;
  var radius = 0.01;

  playerdb.Features.forEach(function(player) {
    console.log(player.properties.name);
    if (player.properties.locationOnHole == 'tee') {
      startPoint = holeFeature.properties.TeeLocation;
      bearing = teeOffset;
      teeOffset = teeOffset + 180;
    }

    if (player.properties.locationOnHole == 'fairway') {
      startPoint = holeFeature.properties.labelLocation;
      bearing = fairwayOffset;
      fairwayOffset = fairwayOffset + 180;
    }

    if (player.properties.locationOnHole == 'green') {
      startPoint = holeFeature.properties.FlagLocation;
      bearing = greenOffset;
      greenOffset = greenOffset + 180;
    }

    console.log(startPoint);
    playerLocation = destinationPoint(startPoint, bearing, radius);
    var PlayerIcon = L.icon({
          iconUrl: player.properties.photo,
          iconSize:     [80, 80],
          iconAnchor:   [40, 42]
      });
    console.log(PlayerIcon, bearing);
    L.marker(playerLocation, {icon: PlayerIcon}).addTo(mymap).bindPopup(player.properties.name);

  })
}
