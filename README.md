# World Connect — Global Video Roulette

Free MVP of a worldwide 1-to-1 video roulette.

## Live
- Render: https://world-connect-roulette.onrender.com
- GitHub: https://github.com/pavelfilichev8-cmd/laughing-rotary-phone

## Included
- WebRTC camera/microphone
- Supabase Realtime signaling and matchmaking
- country/language filters
- realtime text chat
- browser speech recognition + live subtitles
- optional text translation provider
- STUN + optional TURN configuration
- responsive dark UI
- no recording by default

## Free architecture
Supabase Free provides Realtime with a free quota; WebRTC uses STUN/TURN for connectivity. A TURN server may be added for networks where direct peer-to-peer connectivity fails.

## Important
A normal browser cannot force a global HTTP/SOCKS5 proxy for WebRTC media. Use TURN for WebRTC relay. Proxy gateway support can be added server-side later.

## Local
Open `index.html` directly for the static UI, or serve the folder with any static HTTP server. Camera/microphone require a secure context such as HTTPS or localhost.

## Database
The Supabase project contains `wvr_queue`, `wvr_matches` and `wvr_reports` plus RPC functions for matchmaking/queue cleanup.
