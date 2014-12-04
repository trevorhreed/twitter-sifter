import core
import base64
import json

class Test(core.Endpoint):
	def get(self):
		self.json({'what': 'now'})
		
class Crunch(core.Endpoint):
	def post(self):
		info = json.loads(self.request.body_file.read())
		start = info['data'].index(',') + 1
		b64 = info['data'][start:]
		str = base64.b64decode(b64)
		
		self.write(str)
		
		