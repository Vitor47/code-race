from django.urls import path

from .views import home, search_events

urlpatterns = [
    path("", home, name="home"),
    path("search-events/", search_events, name="search_events"),
]
