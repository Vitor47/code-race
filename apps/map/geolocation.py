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

        return events.model_dump_json()

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
