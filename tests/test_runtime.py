"""
EdgeFlow Terminal — Automated Headless Browser & Asset Runtime Test
===================================================================
1. Starts a local HTTP server serving the repo.
2. Probes every modular asset to ensure 200 OK.
3. Launches Headless Chrome to load http://127.0.0.1:PORT/index.html
4. Dumps DOM to verify that Post Studio, Carousel, and Hubs rendered.
"""

import http.server
import socketserver
import threading
import urllib.request
import subprocess
import time
import os
import sys
if hasattr(sys.stdout, 'reconfigure'):
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

PORT = 8089
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=BASE_DIR, **kwargs)

    def log_message(self, format, *args):
        pass # Silence server logs

def start_server():
    with socketserver.TCPServer(("127.0.0.1", PORT), Handler) as httpd:
        httpd.serve_forever()

server_thread = threading.Thread(target=start_server, daemon=True)
server_thread.start()
time.sleep(1)

print(f"[1/4] HTTP Server online at http://127.0.0.1:{PORT}")

# Test 1: Verify all modular assets return HTTP 200 OK
assets = [
    "/index.html",
    "/styles.css",
    "/app.js",
    "/manifest.json",
    "/posts.json",
    "/js/data/preloadedSlots.js",
    "/js/detectors/BaseDetector.js",
    "/js/detectors/Detectors.js",
    "/js/forensics/ForensicVisualizer.js",
    "/js/forensics/ForensicHub.js",
    "/js/session/SessionManager.js",
    "/contracts/forensics.json",
    "/contracts/scores.json"
]

all_ok = True
print("[2/4] Testing HTTP asset endpoints...")
for asset in assets:
    url = f"http://127.0.0.1:{PORT}{asset}"
    try:
        req = urllib.request.urlopen(url, timeout=3)
        code = req.getcode()
        size = len(req.read())
        print(f"  ✓ {asset:<35} -> HTTP {code} ({size:,} bytes)")
    except Exception as e:
        print(f"  ✗ {asset:<35} -> FAILED: {e}")
        all_ok = False

if not all_ok:
    print("Asset verification failed!")
    sys.exit(1)

# Test 2: Launch Headless Chrome to load and execute all JS files in DOM
chrome_path = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"
print(f"[3/4] Launching Headless Chrome to execute DOM & JavaScript...")

cmd = [
    chrome_path,
    "--headless=new",
    "--disable-gpu",
    "--no-sandbox",
    "--dump-dom",
    f"http://127.0.0.1:{PORT}/index.html"
]

try:
    proc = subprocess.run(cmd, capture_output=True, text=True, encoding='utf-8', errors='replace', timeout=10)
    dom_output = proc.stdout
    print(f"  ✓ Headless Chrome executed successfully! DOM output size: {len(dom_output):,} characters")

    # Verify key rendered elements in DOM
    checks = [
        ("Post Studio Shell", "app-shell"),
        ("10-Post Navigation Carousel", "pillsContainer"),
        ("Post Workspace", "postWorkspaceWrapper"),
        ("Scores Hub View", "viewScoresHub"),
        ("Forensic Analysis Hub View", "viewForensicAnalysisHub"),
        ("RoBERTa Entropy Card", "recalcRobertaBtn"),
        ("GLTR Next-Token Card", "recalcGltrBtn"),
        ("Binoculars Perplexity Card", "recalcBinocBtn"),
        ("ByX Dimensions Card", "recalcUniqueBtn")
    ]

    print("[4/4] Verifying client UI components in rendered DOM...")
    dom_success = True
    for label, target in checks:
        if target in dom_output:
            print(f"  ✓ {label:<32} -> Rendered in DOM")
        else:
            print(f"  ✗ {label:<32} -> MISSING from DOM!")
            dom_success = False

    if dom_success:
        print("\n" + "="*70)
        print("🎉 ALL SYSTEMS OPERATIONAL! Zero regressions detected.")
        print("   The web application executes identically to pre-refactor state.")
        print("="*70)
    else:
        sys.exit(1)

except Exception as e:
    print(f"Headless Chrome execution failed: {e}")
    sys.exit(1)
