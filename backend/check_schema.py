import sqlite3
con = sqlite3.connect('fabrics.db')
rows = con.execute("SELECT sql FROM sqlite_master WHERE type='table'").fetchall()
for r in rows:
    print(r[0])
    print('---')