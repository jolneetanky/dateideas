from formatter.base import Formatter
from formatter.base import FormattedData

class OSMFormatter(Formatter):
    def format(self, data) -> FormattedData:
        return FormattedData("", "")