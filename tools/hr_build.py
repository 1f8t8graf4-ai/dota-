#!/usr/bin/env python3
"""Рейтинг героев Restless как в League of Graphs — считается раз в сутки (GitHub Actions) из открытой базы deadlock-api.

Запуск: python3 tools/hr_build.py <папка> [герой …]
Пишет <папка>/hr/<hero_id>.json и <папка>/hr/index.json. Сайт (restless/src/lg17.js) читает их с ветки hr-data.

Правила (скрин Андрея со страницы League of Graphs «How are players ranked?», 03.11):
- тир каждой игры = средний ранг ВРАГОВ в этой игре:
    ранговая — по рангам игроков в матче; обычная — по рангам врагов на их аккаунтах (последняя ранговая игра);
- тир выше на 1 — очки ×5;
- винрейт в 1,5 раза выше среднего по герою — ×2; KDA вдвое выше среднего — ×3;
  чем ниже тир, тем меньше они весят: каждый тир ниже Eternus — ×0,6;
- обычная игра = 0,4 ранговой (у League of Graphs так считается флекс);
- нужно 20+ игр (с учётом 0,4); от 20 до 80 — минус столько же процентов, сколько не хватает до 80;
- нужна игра за последние 14 дней; меньше 5 игр за 14 дней — ×0,5 за каждую недостающую;
- два счёта: за всё, что есть в базе (около месяца), и за 14 дней; первый весит 3/4.
Иначе, чем у них: в базе deadlock-api лежит около месяца матчей — это «сезон»; «30 дней» у нас 14 дней.
"""
import json, math, os, ssl, sys, time, urllib.parse, urllib.request

API = 'https://api.deadlock-api.com/v1/sql?query='
DAYS, SHORT = 45, 14            # «всё, что есть» (в базе ~месяц) и «последние дни»
MIN_G, FULL_G, REC_G = 20, 80, 5
EM, LN5 = 11, math.log(5)        # Eternus — 11-й тир
CTX = ssl.create_default_context(cafile=os.environ.get('SSL_CERT_FILE') or None)


def sql(q, tries=5):
    url = API + urllib.parse.quote(q)
    for i in range(tries):
        try:
            with urllib.request.urlopen(urllib.request.Request(url, headers={'User-Agent': 'restless-rating'}), timeout=300, context=CTX) as r:
                d = json.loads(r.read().decode())
            if isinstance(d, dict) and d.get('error'):
                raise RuntimeError(d['error'][:200])
            return d
        except Exception as e:  # сервер общий — иногда падает по памяти: ждём и повторяем
            print(f'  повтор {i + 1}: {str(e)[:120]}', flush=True)
            time.sleep(20 * (i + 1))
    raise RuntimeError('SQL не ответил')


# ранг (11…116: тир×10 + ступень) → тир дробью: 7.0 — Ritualist 1, 11.83 — Eternus 6
TIER = '(floor({x}/10) + ({x}%10 - 1)/6.0)'

Q = '''
WITH R AS (SELECT account_id, arg_max(player_rank_initial_display_rank, start_time) rk FROM match_player
           WHERE start_time > now() - INTERVAL {D} DAY AND match_mode='Ranked' AND player_rank_initial_display_rank > 0 GROUP BY 1),
m AS (SELECT match_id, account_id, team, match_mode='Ranked' AS r, (team=winning_team)::INT w, kills k, deaths d, assists a,
             start_time > now() - INTERVAL {S} DAY AS s, CASE WHEN match_mode='Ranked' THEN 1.0 ELSE 0.4 END wt
      FROM match_player WHERE start_time > now() - INTERVAL {D} DAY AND hero_id={H} AND match_mode IN ('Ranked','Unranked')),
er AS (SELECT match_id, team, avg({T1}) t FROM match_player
       WHERE start_time > now() - INTERVAL {D} DAY AND match_mode='Ranked' AND player_rank_initial_display_rank > 0
         AND match_id IN (SELECT match_id FROM m WHERE r) GROUP BY 1,2),
eu AS (SELECT p.match_id, p.team, avg({T2}) t FROM match_player p JOIN R ON R.account_id = p.account_id
       WHERE p.start_time > now() - INTERVAL {D} DAY AND p.match_mode='Unranked'
         AND p.match_id IN (SELECT match_id FROM m WHERE NOT r) GROUP BY 1,2),
g AS (SELECT m.*, coalesce(er.t, eu.t) et FROM m
      LEFT JOIN er ON er.match_id = m.match_id AND er.team <> m.team
      LEFT JOIN eu ON eu.match_id = m.match_id AND eu.team <> m.team)
SELECT g.account_id id, any_value(R.rk) b, count(*) FILTER (WHERE r) nr, count(*) n,
  sum(wt) gw, sum(wt*w) ww, sum(wt*k) kw, sum(wt*d) dw, sum(wt*a) aw,
  sum(wt*et) FILTER (WHERE et IS NOT NULL) tw, sum(wt) FILTER (WHERE et IS NOT NULL) tc,
  coalesce(sum(wt) FILTER (WHERE s), 0) gs, coalesce(sum(wt*w) FILTER (WHERE s), 0) ws,
  sum(wt*et) FILTER (WHERE s AND et IS NOT NULL) ts, sum(wt) FILTER (WHERE s AND et IS NOT NULL) tcs
FROM g LEFT JOIN R ON R.account_id = g.account_id
GROUP BY 1 HAVING sum(wt) >= {MG} AND count(*) FILTER (WHERE s) >= 1
'''

AVG = '''SELECT sum((team=winning_team)::INT)/count(*) wr, (sum(kills)+sum(assists))/greatest(1,sum(deaths)) kda, count(*) n
FROM match_player WHERE start_time > now() - INTERVAL {D} DAY AND hero_id={H} AND match_mode IN ('Ranked','Unranked')'''


def score(T, wr, kda, A):
    """счёт одного окна (натуральный логарифм): тир ×5, винрейт 1,5× → ×2, KDA 2× → ×3, бонусы ×0,6 за каждый тир ниже Eternus"""
    sc = 0.6 ** max(0.0, EM - T)
    rw = max(.5, min(2.0, wr / max(.01, A['wr'])))
    rk = max(.25, min(4.0, kda / max(.1, A['kda'])))
    return T * LN5 + sc * (math.log(2) * math.log(rw) / math.log(1.5) + math.log(3) * math.log(rk) / math.log(2))


def hero(h):
    t0 = time.time()
    A = sql(AVG.format(D=DAYS, H=h))[0]
    rows = sql(Q.format(D=DAYS, S=SHORT, H=h, MG=MIN_G, T1=TIER.format(x='player_rank_initial_display_rank'), T2=TIER.format(x='R.rk')))
    out = []
    for x in rows:
        if not x['tc']:
            continue                                   # ни в одной игре не знаем ранга врагов — тир не посчитать
        T = x['tw'] / x['tc']
        Ts = x['ts'] / x['tcs'] if x.get('tcs') else T
        wr = x['ww'] / x['gw']
        kda = (x['kw'] + x['aw']) / max(1.0, x['dw'])
        wrs = x['ws'] / x['gs'] if x['gs'] else wr
        S = .75 * score(T, wr, kda, A) + .25 * score(Ts, wrs, kda, A)
        gw, gs = x['gw'], x['gs']
        if gw < FULL_G:
            S += math.log(max(.2, 1 - (FULL_G - gw) / 100))     # от 20 до 80 игр — минус столько же процентов
        if gs < REC_G:
            S += math.log(.5) * (REC_G - gs)                     # меньше 5 игр за 14 дней — ×0,5 за каждую
        out.append((S, x, T, wr, kda))
    out.sort(key=lambda e: -e[0])
    f1 = lambda v: round(v, 1)
    d = {'v': 1, 'hero': h, 't': int(time.time()), 'days': DAYS, 'short': SHORT, 'n': len(out),
         'avg': {'wr': round(100 * A['wr'], 2), 'kda': round(A['kda'], 2), 'games': A['n']},
         'id': [e[1]['id'] for e in out],                        # место = индекс + 1
         'p': [round(1000 * e[0] / LN5) for e in out],           # очки: тир выше = +1000
         'b': [e[1]['b'] or 0 for e in out],                     # свой ранг (последняя ранговая)
         'g': [f1(e[1]['gw']) for e in out],                     # игр с учётом 0,4 за обычные
         'r': [e[1]['nr'] for e in out],                         # из них ранговых
         'wr': [f1(100 * e[3]) for e in out], 'kda': [round(e[4], 2) for e in out],
         'et': [round(e[2], 2) for e in out]}                    # средний тир врагов
    print(f'герой {h}: {len(out)} в рейтинге из {len(rows)}, {time.time() - t0:.0f} с', flush=True)
    return d


def heroes():
    """герои, которых играли за 14 дней (обычная статистика героев — быстрее, чем SQL по всей базе)"""
    url = 'https://api.deadlock-api.com/v1/analytics/hero-stats?min_unix_timestamp=%d' % (int(time.time()) - 14 * 86400)
    for i in range(5):
        try:
            with urllib.request.urlopen(urllib.request.Request(url, headers={'User-Agent': 'restless-rating'}), timeout=120, context=CTX) as r:
                return sorted(h['hero_id'] for h in json.loads(r.read().decode()) if h.get('matches', 0) > 2000)
        except Exception as e:
            print(f'  список героев, повтор {i + 1}: {str(e)[:120]}', flush=True); time.sleep(15 * (i + 1))
    raise RuntimeError('нет списка героев')


def main():
    out = sys.argv[1] if len(sys.argv) > 1 else 'hr-out'
    os.makedirs(os.path.join(out, 'hr'), exist_ok=True)
    hs = [int(x) for x in sys.argv[2:]] or heroes()
    idx = {'t': int(time.time()), 'days': DAYS, 'short': SHORT, 'heroes': {}}
    for h in hs:
        try:
            d = hero(h)
        except Exception as e:
            print(f'герой {h}: не вышло — {e}', flush=True)
            continue
        with open(os.path.join(out, 'hr', f'{h}.json'), 'w') as f:
            json.dump(d, f, separators=(',', ':'))
        idx['heroes'][h] = {'n': d['n'], 'avg': d['avg']}
        time.sleep(3)                                            # не долбим общий сервер
    with open(os.path.join(out, 'hr', 'index.json'), 'w') as f:
        json.dump(idx, f, separators=(',', ':'))
    print('готово:', len(idx['heroes']), 'героев')
    if not idx['heroes']:
        sys.exit(1)


if __name__ == '__main__':
    main()
