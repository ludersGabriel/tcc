import http.server
import socketserver

PORT = 8000

class SimpleHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def do_POST(self):
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length)
        print("Received POST data:", post_data.decode('utf-8'))

        self.send_response(200)
        self.send_header('Content-type', 'text/plain')
        self.end_headers()
        self.wfile.write(b'POST request received')

def run_server():
    with socketserver.TCPServer(("", PORT), SimpleHTTPRequestHandler) as httpd:
        print(f"Serving HTTP on port {PORT}")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nServer is shutting down.")
        finally:
            httpd.server_close()
            print("Server closed successfully.")

if __name__ == "__main__":
    run_server()
