from gdacs.api import GDACSAPIError, GDACSAPIReader


class GeoLocationMixin:
    def __init__(self, limite=None) -> None:
        self.limite = limite
        self.client = GDACSAPIReader()

    def get_events(self):
        fl = []
        wf = []
        dr = []

        try:
            fl = self.client.latest_events(
                limite=self.limite, event_type="FL", source_format="geojson"
            )
            wf = self.client.latest_events(
                limite=self.limite, event_type="WF", source_format="geojson"
            )
            dr = self.client.latest_events(
                limite=self.limite, event_type="DR", source_format="geojson"
            )
        except GDACSAPIError as error:
            raise ValueError(error)

        return fl + wf + dr

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
