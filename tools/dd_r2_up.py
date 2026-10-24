#!/usr/bin/env python3
# Прямая заливка в Cloudflare R2 (REST). Ключ НЕ лежит в репо: файл .cf-token
# хранится локально (вне репо), формат — две строки: email\nключ
# (или одна строка, если это ключ cfk_* — тогда email берётся из env CF_EMAIL).
# Использование: python3 tools/dd_r2_up.py файл.mp4 scenes/games/deadlock/venator.mp4 [video/mp4]
import sys, os, urllib.parse, urllib.request

ACC = os.environ.get("CF_ACCOUNT", "30e726a49a27820ac532f8ab97954d0c")
BUCKET = os.environ.get("CF_BUCKET", "kino-media")
TOKEN_FILE = os.environ.get("CF_TOKEN", os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "scripts", ".cf-token"))

def load_token():
    with open(TOKEN_FILE) as f:
        lines = [l.strip() for l in f if l.strip()]
    if len(lines) >= 2:
        return lines[0], lines[1]                      # email\nkey
    if lines and lines[0].startswith("cfk_"):          # только ключ одной строкой
        em = os.environ.get("CF_EMAIL")
        if not em:
            sys.exit(".cf-token содержит только ключ: задай CF_EMAIL=email")
        return em, lines[0]
    sys.exit(".cf-token: жду формат 'email\\nключ'")

def upload(local, key, ctype="video/mp4"):
    email, key_auth = load_token()
    url = f"https://api.cloudflare.com/client/v4/accounts/{ACC}/r2/buckets/{BUCKET}/objects/{urllib.parse.quote(key, safe='')}"
    data = open(local, "rb").read()
    req = urllib.request.Request(url, data=data, method="PUT", headers={
        "X-Auth-Email": email, "X-Auth-Key": key_auth, "Content-Type": ctype})
    with urllib.request.urlopen(req, timeout=300) as r:
        print("HTTP", r.status)
    print(f"OK: {local} -> {key} ({len(data)//1024} KB)")
    print(f"Проверка: curl -sI https://dota.1f8t8graf4.workers.dev/m/{key}")

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("usage: dd_r2_up.py <local> <key> [ctype]"); sys.exit(1)
    upload(sys.argv[1], sys.argv[2], sys.argv[3] if len(sys.argv) > 3 else "video/mp4")
