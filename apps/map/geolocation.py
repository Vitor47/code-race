import json

from gdacs.api import GDACSAPIError, GDACSAPIReader


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

            envents_format.append(
                {
                    "evento_id": eventid,
                    "evento": nome_evento,
                    "lat": coordinates[0],
                    "lng": coordinates[1],
                }
            )

        return envents_format

    def filter_events(self, name_city):
        return self.get_events()

    def get_event(self, event_type, event_id):
        try:
            return self.client.get_event(
                event_type=event_type,
                event_id=event_id,
                source_format="geojson",
            )
        except GDACSAPIError as error:
            raise ValueError(error)
