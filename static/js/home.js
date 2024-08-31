let map;
function initMap() {

  const mockedArray = [
    { lat: -34.397, lng: 150.644, title: "Location 1", content: "This is the first location." },
    { lat: -35.307, lng: 149.124, title: "Location 2", content: "This is the second location." },
    { lat: -33.847, lng: 151.264, title: "Location 3", content: "This is the third location." },
    { lat: -37.8136, lng: 144.9631, title: "Location 4", content: "This is the fourth location." }
  ]
  console.log(mockedArray)

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const pos = {
          lat: mockedArray[0].lat,
          lng: mockedArray[0].lng,
        };

        map = new google.maps.Map(document.getElementById("map"), {
          zoom: 13,
          center: pos,
        });


        mockedArray.forEach(location => {
          const marker = new google.maps.Marker({
            position: { lat: location.lat, lng: location.lng },
            map: map,
            title: location.title
          });

          const infoWindow = new google.maps.InfoWindow({
            content: `<div><h3>${location.title}</h3><p>${location.content}</p></div>`
          });

          marker.addListener('click', () => {
            infoWindow.open(map, marker);
          });

        });
      },
      () => {
        handleLocationError(true, map.getCenter());
      }
    );
  } else {
    handleLocationError(false, map.getCenter());
  }
}

function searchCity(name_city) {
  if (name_city != "" && name_city.length >= 5) {
    $('#img-reload').css('display', 'block');
    $("#img-reload").html('<img style="max-width: 24%;" src="/static/images/reload-gif.gif" alt="gif">');

    $.ajax({
      url: "/search-events/",
      type: "POST",
      dataType: "json",
      data: {
        name_city: name_city,
      },
      headers: {
        "X-Requested-With": "XMLHttpRequest",
      },
      success: function (data) {
        if (data) {
          if (data.msg) {
            if (data.msg.length > 0) {
              swal({
                title: "Opps!",
                text: data.msg,
                icon: "error",
                button: "OK",
              });
            }
          }
          else if (data) {
            console.log(data)
          }
        }

        $('#img-reload').css('display', 'none');
      },
      error: function (data) {
        swal({
          title: "Opps!",
          text: data.msg,
          icon: "error",
          button: "OK",
        });
        $('#img-reload').css('display', 'none');
      }
    });
  }
  else {
    swal({
      title: "Opps!",
      text: "Preencha a cidade.",
      icon: "error",
      button: "OK",
    });
  }
}

function geocodeCity() {
  const city = document.getElementById("city_input").value;
  const geocoder = new google.maps.Geocoder();

  geocoder.geocode({ 'address': city }, function (results, status) {
    if (status === 'OK') {
      console.log(results[0].geometry.location)
      map.setCenter(results[0].geometry.location);
      map.setZoom(13);

      new google.maps.Marker({
        position: results[0].geometry.location,
        map: map,
      });
    } else {
      alert('Geocode was not successful for the following reason: ' + status);
    }
  });

  searchCity(city);
}

function handleLocationError(browserHasGeolocation, pos) {
  alert(browserHasGeolocation
    ? "Error: The Geolocation service failed."
    : "Error: Your browser doesn't support geolocation.");
}