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
          title: location.title
        });

        const infoWindow = new google.maps.InfoWindow({
          content: `<div><h3>Cidade atual</h3></div>`
        });

        marker.addListener('click', () => {
          infoWindow.open(map, marker);
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

function markedEventsCity(city, eventos) {
  const geocoder = new google.maps.Geocoder();

  geocoder.geocode({ 'address': city }, async function (results, status) {
    if (status === 'OK') {

      map.setCenter(results[0].geometry.location);
      map.setZoom(13);

      const marker = new google.maps.Marker({
        position: results[0].geometry.location,
        map: map,
      });

      const infoWindow = new google.maps.InfoWindow({
        content: `<div><h3>Cidade</h3><p>${city}</p></div>`
      });

      marker.addListener('click', () => {
        infoWindow.open(map, marker);
      });

      if (eventos) {
        eventos.forEach(location => {
          const marker = new google.maps.Marker({
            position: { lat: location.lat, lng: location.lng },
            map: map,
            title: location.evento
          });

          const infoWindow = new google.maps.InfoWindow({
            content: `<div><h3>Desastre natural</h3><p>${location.evento}</p><p>${location.descricao}</p><p>${location.impacto}</p><p>${location.data_evento}</p></div>`
          });

          marker.addListener('click', () => {
            infoWindow.open(map, marker);
          });

        });
      } else {
        swal({
          title: "Opps!",
          text: 'Nenhum evento encontrado',
          icon: "error",
          button: "OK",
        });
      }

    } else {
      swal({
        title: "Opps!",
        text: 'Geocode was not successful for the following reason: ' + status,
        icon: "error",
        button: "OK",
      });
    }
  });
}

function searchCity(name_city) {
  if (name_city != "" && name_city.length >= 5) {
    $('#img-reload').css('display', 'block');
    $("#img-reload").html('<img style="max-width: 24%;" src="/static/images/reload-gif.gif" alt="gif">');
    $('#map').css('webkit-filter', 'blur(8px)');

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
            markedEventsCity(name_city, data.context.eventos)
          }
        }

        $('#img-reload').css('display', 'none');
        $('#map').css('webkit-filter', 'blur(0px)');
      },
      error: function (data) {
        swal({
          title: "Opps!",
          text: data.msg,
          icon: "error",
          button: "OK",
        });
        $('#img-reload').css('display', 'none');
        $('#map').css('webkit-filter', 'blur(0px)');
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

function handleKeyPress(event) {
  if (event.which === 13) {
    geocodeCity();
  }
}


function geocodeCity() {
  const city = document.getElementById("city_input").value;
  searchCity(city)

}

function handleLocationError(browserHasGeolocation, pos) {
  alert(browserHasGeolocation
    ? "Error: The Geolocation service failed."
    : "Error: Your browser doesn't support geolocation.");
}