import urllib.request
import json

url = 'http://localhost:3000/api/chat'
data = json.dumps({
    'messages': [
        {
            'role': 'user',
            'parts': [
                {'type': 'text', 'text': 'Hello world'}
            ]
        }
    ]
}).encode('utf-8')

req = urllib.request.Request(url, data=data, headers={'Content-Type': 'application/json'})

try:
    with urllib.request.urlopen(req, timeout=15) as r:
        print('STATUS', r.status)
        print(r.read().decode('utf-8'))
except Exception as e:
    print('ERROR', repr(e))
