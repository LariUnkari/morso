import http.server
import socketserver

PORT = 8000
DIRECTORY = "build"

class Handler(http.server.SimpleHTTPRequestHandler):
    # Patch in the correct extensions
    extensions_map = {
        '.manifest': 'text/cache-manifest',
    	'.html': 'text/html',
        '.png': 'image/png',
    	'.jpg': 'image/jpg',
    	'.svg':	'image/svg+xml',
    	'.css':	'text/css',
    	'.js':	'application/javascript',
    	'': 'application/octet-stream', # Default
    }
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

# Run the server
with socketserver.TCPServer(("", PORT), Handler) as httpd:
    print("serving at port", PORT)
    httpd.serve_forever()
