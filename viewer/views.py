from django.views import View
from django.shortcuts import render

# Create your views here.
class Index(View):
	title = "Wasa Wasa Weather"
	template = 'viewer/index.html'
	component = 'viewer/bundle.js'

	def get(self, request):
		props = {
			'test': 'this is my test prop',
		}

		context = {
			'title': self.title,
			'component': self.component,
			'props': props,
		}

		return render(request, self.template, context)