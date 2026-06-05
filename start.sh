#!/bin/bash
echo "Menjalankan Cloudflare Tunnel..."
cloudflared tunnel --no-autoupdate run --token eyJhIjoiNWE5NzY0ZGZmNzM5YzMwNTIzZjgwNDZiMzg5YWM2M2MiLCJ0IjoiMDgyMDU2ZTctNDJjNS00ZjRkLWJmNjAtYTVlYjk1YTA3Zjc2IiwicyI6Ill6WTNNalV4TURFdFl6aGlNaTAwWkRaaUxXSTJaV010TURGaU16VTFaalV6T0RBeCJ9 &

echo "Menjalankan React Frontend di Port 8081..."
npx serve -s dist -l 8081
