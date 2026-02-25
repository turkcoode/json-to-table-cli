# JSON to Table CLI 📊

JSON verisini terminalde güzel tablo formatında gösteren hafif CLI aracı.

## Kurulum

```bash
npm install -g json-to-table-cli
```

## Kullanım

```bash
# Pipe ile
cat data.json | json-table

# Dosyadan
json-table data.json

# API'den
curl -s https://api.example.com/data | json-table

# Belirli alanlar
cat data.json | json-table --fields name,email,role
```

## Örnek

```bash
echo '[{"ad":"Ahmet","yas":25,"sehir":"Istanbul"},{"ad":"Elif","yas":30,"sehir":"Ankara"}]' | json-table
```

Çıktı:
```
┌────────┬─────┬──────────┐
│ ad     │ yas │ sehir    │
├────────┼─────┼──────────┤
│ Ahmet  │ 25  │ Istanbul │
│ Elif   │ 30  │ Ankara   │
└────────┴─────┴──────────┘
2 kayit
```

## Seçenekler

| Parametre | Açıklama |
|-----------|----------|
| `--fields` | Gösterilecek alanlar (virgülle ayır) |
| `--sort` | Sıralama alanı |
| `--limit` | Maksimum satır sayısı |
| `--no-header` | Başlık satırını gizle |
| `--csv` | CSV formatında çıktı |
| `--markdown` | Markdown tablo formatı |

## Programatik Kullanım

```javascript
const { jsonToTable } = require('json-to-table-cli');

const data = [
  { ad: 'Ahmet', yas: 25 },
  { ad: 'Elif', yas: 30 }
];

console.log(jsonToTable(data));
```

## Geliştirici Araçları

Bu araç, [TurkCode](https://turkcode.net) geliştirici araçları serisinin bir parçasıdır.

## Lisans

MIT
