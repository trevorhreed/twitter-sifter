import os
import json
import jinja2
import webapp2

ROOT = os.path.dirname(__file__)

JINJA_ENVIRONMENT = jinja2.Environment(
    loader=jinja2.FileSystemLoader(os.path.join(ROOT, 'views')),
    extensions=['jinja2.ext.autoescape'],
		autoescape=True
)

class Endpoint(webapp2.RequestHandler):
	def json(self, obj):
		self.response.write(json.dumps(obj))
	
	def render(self, view, context={}):
		template = JINJA_ENVIRONMENT.get_template(view)
		self.response.write(template.render(context))