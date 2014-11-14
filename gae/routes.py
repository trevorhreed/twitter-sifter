import core
import webapp2

class Index(core.Endpoint):
    def get(self):
        self.render('index.html')

app = webapp2.WSGIApplication([
    ('/', Index),
		('/test', 'api.Test')
], debug=True)
