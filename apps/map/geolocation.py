import json
from datetime import datetime

from gdacs.api import GDACSAPIError, GDACSAPIReader
from geopy.geocoders import Nominatim


class GeoLocationMixin:
    def __init__(self, limite=None) -> None:
        self.limite = limite
        self.client = GDACSAPIReader()

    def get_events(self):
        try:
            events = self.client.latest_events(
                limit=self.limite,
            )
        except GDACSAPIError as error:
            raise ValueError(error)

        events_json = json.loads(events.model_dump_json())

        envents_format = []
        for evento in events_json["features"]:
            coordinates = evento.get("geometry", {}).get("coordinates")
            eventid = evento.get("properties", {}).get("eventid")
            nome_evento = evento.get("properties", {}).get("name")
            descricao = evento.get("properties", {}).get("htmldescription")
            data_evento = evento.get("properties", {}).get("fromdate")
            impacto = (
                evento.get("properties", {})
                .get("severitydata", {})
                .get("severitytext")
            )
            paises_afetados = evento.get("properties", {}).get(
                "affectedcountries"
            )
            envents_format.append(
                {
                    "id": eventid,
                    "evento": nome_evento or "",
                    "lat": coordinates[1],
                    "lng": coordinates[0],
                    "descricao": descricao or "",
                    "impacto": impacto or "",
                    "data_evento": datetime.strptime(
                        data_evento, "%Y-%m-%dT%H:%M:%S"
                    ).strftime("%d/%m/%Y"),
                    "paises_afetados": [
                        pais.get("countryname") for pais in paises_afetados
                    ],
                }
            )

        return envents_format

    @staticmethod
    def obter_coordenadas(cidade):
        geolocator = Nominatim(user_agent="ram")
        localizacao = geolocator.geocode(cidade)

        if localizacao:
            return localizacao.latitude, localizacao.longitude
        else:
            return None, None

    def filter_events(self, name_city):
        lat, lng = self.obter_coordenadas(name_city)

        if not lat and not lng:
            raise ValueError(
                f"Não foi possível encontrar a localização para {name_city}."
            )

        events = self.get_events()

        return list(
            filter(lambda event: event["lat"] == lat and event["lon"], events)
        )

    def get_event(self, event_type, event_id):
        try:
            return self.client.get_event(
                event_type=event_type,
                event_id=event_id,
                source_format="geojson",
            )
        except GDACSAPIError as error:
            raise ValueError(error)
