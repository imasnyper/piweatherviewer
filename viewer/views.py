from django.views import View
from django.shortcuts import render

# Create your views here.
class Index(View):
	title = "Wasa Wasa Weather"
	template = 'viewer/index.html'
	component = 'pages/index.js'