import core

class Test(core.Endpoint):
	def get(self):
		self.json({'what': 'now'})