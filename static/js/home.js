let map;
function initMap() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        map = new google.maps.Map(document.getElementById("map"), {
          zoom: 13,
          center: pos,
        });

        const marker = new google.maps.Marker({
          position: pos,
          map: map,
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

function searchCity(name_city){
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