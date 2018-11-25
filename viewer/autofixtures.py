import datetime

from .models import Reading
from autofixture import generators, register, AutoFixture

from dateutil.relativedelta import relativedelta
import pytz

class ReadingAutoFixture(AutoFixture):
	end_date = datetime.datetime.now()
	start_date = end_date + relativedelta(
		months=-(end_date.month - 1),
		day=1,
		hour=0,
		minute=0,
		second=0,
		microsecond=0)
	start_date = pytz.timezone("UTC").localize(start_date)
	end_date = pytz.timezone("UTC").localize(end_date)
	field_values = {
		'date_time': generators.DateTimeGenerator(min_date=start_date, max_date=end_date),
		'temperature': generators.IntegerGenerator(min_value=-10, max_value=33),
		'humidity': generators.PositiveIntegerGenerator(max_value=100),
		'pressure': generators.IntegerGenerator(min_value=850, max_value=1100),
	}

register(Reading, ReadingAutoFixture)