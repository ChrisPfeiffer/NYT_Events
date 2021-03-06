  //builds the url based on the location of the center of the map and the state of the checkboxes
  function buildUrl(center)
  {
    var url = "http://events2339.azurewebsites.net/api/events/getevents?parameters=ll="+center.G+","+center.K+"&facetSearch=category:(";
      if($('#Movies').is(':checked')){url=url+"Movies"}
      if($('#Theater').is(':checked')){url=url+"+Theater"}
      if($('#Art').is(':checked')){url=url+"+Art"}
      if($('#spareTimes').is(':checked')){url=url+"+spareTimes"}
      if($('#forChildren').is(':checked')){url=url+"+forChildren"}
      if($('#Jazz').is(':checked')){url=url+"+Jazz"}
      if($('#Pop').is(':checked')){url=url+"+Pop"}
      if($('#Dance').is(':checked')){url=url+"+Dance"}
      if($('#Comedy').is(':checked')){url=url+"+Comedy"}
      if($('#Classical').is(':checked')){url=url+"+Classical"}
      url = url + "), borough:(";

      if($('#Manhattan').is(':checked')){url=url+"Manhattan"}
      if($('#Brooklyn').is(':checked')){url=url+"+Brooklyn"}
      if($('#Queens').is(':checked')){url=url+"+Queens"}
      if($('#Bronx').is(':checked')){url=url+"+Bronx"}
      if($('#TheBronx').is(':checked')){url=url+"+The Bronx"}
      if($('#StatenIsland').is(':checked')){url=url+"+Staten Island"}
      url=url+")";

return url;
}

$(document).ready(initMap);

var map;
var markers = [];
var center;
var infoWindows = [];
//track the moveFromClick variable to decide whether or not to refresh the map.  Don't refresh map when the movement was caused by the click of a marker
var moveFromClick = false;

function refreshMap(url)
{
      //don't refresh the map if the user just clicked to retrieve an info box
      if(!moveFromClick)
      {
        $.getJSON(url, function (jsonPayload) {
          $.each(jsonPayload, function(i, item){
            var infoWindow = new google.maps.InfoWindow({
              content: '<h4>'+item.event_name+'</h4><br/>'+ item.web_description
            });
            var marker = new google.maps.Marker({
              position: {lat: parseFloat(item.geocode_latitude), lng: parseFloat(item.geocode_longitude)},
              map: map,
              title: item.event_name
            });

            marker.addListener('click', function(){
              moveFromClick = true;
              infoWindow.open(map, marker);
            });

            markers.push(marker);
            infoWindows.push(infoWindow);

          });
        });
      }
      else{moveFromClick=false;}


    }

    function initMap() {
      var latlng = new google.maps.LatLng(40.7127,-74.0059);
      var options = {
        zoom: 14,
        center: latlng,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };

      map = new google.maps.Map(document.getElementById('map'), options);

    var url = buildUrl(map.getCenter());
    
    refreshMap(url);

    function setMapOnAll(map) {
      for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
      }
    }

    function clearMarkers() {
     setMapOnAll(null);
   }

   map.addListener('idle', function()
   {

    center = map.getCenter();

    var url = buildUrl(center);
    if(!moveFromClick)
    {
      clearMarkers();
      markers = [];
      infoWindows = [];
    }
    refreshMap(url);

    console.log(center);
  });

   $('#clusterTruckButton').click(function(){
      console.log('navigating to cluster truck');
      map.setCenter({lat:39.781167, lng:-86.161309});
      map.setZoom(17);
   })

   //the change of a checkbox should cause a new call to the server   
   $('.checkbox').change(function(){

    var url = buildUrl(center);
    if(!moveFromClick)
    {
      clearMarkers();
      markers = [];
      infoWindows = [];
    }
    refreshMap(url);   

  });

 };