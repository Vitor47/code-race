from django.contrib import messages
from django.http import JsonResponse
from django.shortcuts import redirect, render
from django.views.decorators.csrf import csrf_exempt

from .geolocation import GeoLocationMixin


def home(request):
    try:
        geo_location = GeoLocationMixin(10)
        eventos = geo_location.get_events()
    except Exception:
        messages.error(
            request, "Eventos não encontrados algum erro inesperado!"
        )
        return redirect("/")

    return render(
        request, template_name="map/index.html", context={"eventos": eventos}
    )


@csrf_exempt
def search_events(request):
    if request.method == "POST":
        name_city = request.POST.get("name_city")
        try:
            geo_location = GeoLocationMixin()
            eventos = geo_location.filter_events(name_city)
        except:
            messages.error(
                request, "Eventos não encontrados algum erro inesperado!"
            )
            return redirect("/")

        return JsonResponse(
            {"context": {"eventos": eventos}},
            status=200,
            content_type="application/json",
        )
