import http.server
import socketserver
import urllib.parse
import os

PORT = 8000

class Handler(http.server.SimpleHTTPRequestHandler):
    def do_POST(self):
        # We only want to handle POST for handler.php and error.php
        if self.path.endswith('handler.php') or self.path.endswith('error.php'):
            content_length = int(self.headers.get('Content-Length', 0))
            if content_length > 0:
                post_data = self.rfile.read(content_length).decode('utf-8')
                parsed_data = urllib.parse.parse_qs(post_data)
                
                if 'data' in parsed_data:
                    data_to_save = parsed_data['data'][0]
                    
                    # Determine where to save based on the request path
                    # e.g., /nearyou/handler.php -> nearyou/result.txt
                    dir_name = os.path.dirname(self.path.lstrip('/'))
                    if not dir_name:
                        dir_name = '.'
                        
                    file_name = 'result.txt'
                    if self.path.endswith('error.php'):
                        file_name = 'error.txt'
                        
                    save_path = os.path.join(dir_name, file_name)
                    
                    try:
                        # Write data to result.txt
                        with open(save_path, 'w', encoding='utf-8') as f:
                            f.write(data_to_save)
                        print(f"Successfully saved data to {save_path}")
                    except Exception as e:
                        print(f"Error writing to {save_path}: {e}")

            # Send 200 OK response back to the client
            self.send_response(200)
            self.send_header('Content-type', 'text/plain')
            self.end_headers()
            self.wfile.write(b"OK")
        else:
            # For any other POST requests, send 405 Method Not Allowed
            self.send_response(405)
            self.end_headers()

if __name__ == '__main__':
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        print(f"Serving HTTP on port {PORT}. Press Ctrl+C to stop.")
        print(f"Open http://127.0.0.1:{PORT}/nearyou/nearyou.html in your browser.")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nShutting down server.")
            httpd.server_close()
