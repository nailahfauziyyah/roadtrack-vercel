# RoadTrack — Operational Car Route Monitoring WebGIS

WebGIS untuk memvisualisasikan dan memantau rute perjalanan mobil operasional berdasarkan data GPS dan hasil routing.

## Project Overview

RoadTrack dikembangkan sebagai perpanjangan dari dataset yang diberikan pada tugas Week 5. Project ini mencakup preprocessing data, pengembangan dataset perjalanan, routing menggunakan OSRM, estimasi penggunaan bahan bakar, serta visualisasi hasilnya dalam bentuk WebGIS.

## Features

- Visualisasi rute perjalanan pada basemap OpenStreetMap
- Informasi detail setiap rute melalui popup
- Filter berdasarkan rute
- Filter berdasarkan hari perjalanan
- Dashboard total perjalanan
- Total jarak perjalanan
- Estimasi durasi perjalanan
- Estimasi penggunaan bahan bakar
- Estimasi biaya bahan bakar
- Visualisasi rute aktif pada peta
- Informasi parameter kendaraan dan routing

## Data

Project ini menggunakan dataset awal yang diberikan oleh laboratorium sebagai dasar pengembangan WebGIS.

Dataset GPS awal dari laboratorium, yaitu `gps_mentah.csv`, hanya mengalami perubahan nama menjadi `gps_roadtrack.csv` tanpa mengubah data aslinya.

Data awal yang digunakan meliputi:

- `gps_roadtrack.csv` — dataset GPS awal dari laboratorium, sebelumnya bernama `gps_mentah.csv`
- `ringkasan.json` — data ringkasan perjalanan dari dataset awal
- `rute.geojson` — data rute awal
- `titik_ujung.geojson` — data titik ujung perjalanan

Selanjutnya, data dikembangkan dan diproses untuk menghasilkan:

- `gps_final.csv` — hasil preprocessing dan pengembangan data GPS
- `rute_final.geojson` — hasil routing final yang digunakan pada WebGIS

## Routing

Routing dilakukan menggunakan **OSRM (Open Source Routing Machine)** dengan profile:

- Vehicle: Mobil Operasional
- Routing profile: Driving
- Routing engine: OSRM

Parameter tersebut dipilih karena project berfokus pada pemantauan perjalanan mobil operasional.

## Fuel Estimation

Estimasi bahan bakar menggunakan asumsi:

- Konsumsi kendaraan: 12 km/L
- Jenis bahan bakar: Pertalite
- Harga bahan bakar: Rp10.000/L

Nilai bahan bakar dan biaya merupakan **estimasi**, bukan data pembelian bahan bakar secara aktual.

## Trip Plan

| Hari | Perjalanan |
|---|---|
| Hari 1 | Balaraja → Jakarta → Bogor → Jakarta |
| Hari 2 | Jakarta → Purwakarta |
| Hari 3 | Purwakarta → Bandung |
| Hari 4 | Bandung → Garut |
| Hari 5 | Garut → Tasikmalaya |
| Hari 6 | Tasikmalaya → Malang |
| Hari 7 | Malang → Jakarta |

## Project Structure

roadtrack/
├── data/
│   ├── enrich_routes.py
│   ├── gabung_gps.py
│   ├── generate_gps.py
│   ├── get_route.py
│   ├── gps_final.csv
│   ├── gps_roadtrack.csv
│   ├── ringkasan.json
│   ├── rute_final.geojson
│   ├── rute.geojson
│   └── titik_ujung.geojson
│
├── frontend/
│   ├── index.html
│   ├── script.js
│   └── style.css
│
└── README.md

## Limitations

- Data GPS dan hasil routing digunakan sebagai dasar analisis dan visualisasi.
- Estimasi bahan bakar menggunakan asumsi konsumsi kendaraan 12 km/L.
- Biaya bahan bakar menggunakan asumsi harga Pertalite Rp10.000/L.
- Nilai estimasi tidak merepresentasikan konsumsi bahan bakar aktual kendaraan.
- Durasi perjalanan merupakan hasil routing dan dapat berbeda dengan kondisi perjalanan sebenarnya.

## Technology

- HTML
- CSS
- JavaScript
- Leaflet.js
- OpenStreetMap
- OSRM
- GeoJSON
- CSV
- Python

## Author

**Nailah Fauziyyah**  
S1 Sistem Informasi — Telkom University