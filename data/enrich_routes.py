import json
import math
import pandas as pd

# ============================================================
# 1. LOAD DATA RUTE OPENROUTESERVICE
# ============================================================

with open("data/rute.geojson", "r", encoding="utf-8") as f:
    rute_asli = json.load(f)

# Tambahkan rute Trip 2 sampai Trip 9
for day in range(2, 10):
    filename = f"data/rute_day{day}.geojson"

    with open(filename, "r", encoding="utf-8") as f:
        route_data = json.load(f)

    rute_asli["features"].extend(
        route_data["features"]
    )


# ============================================================
# 2. KONFIGURASI TRIP
# ============================================================

trip_config = {
    1: {
        "nama": "Trip 1",
        "trayek": "Balaraja – Jakarta",
        "arah": "Balaraja ke Jakarta",
        "hari": "Senin",
        "tanggal": "03-03-2025"
    },
    2: {
        "nama": "Trip 2",
        "trayek": "Jakarta – Bogor",
        "arah": "Jakarta ke Bogor",
        "hari": "Senin",
        "tanggal": "03-03-2025"
    },
    3: {
        "nama": "Trip 3",
        "trayek": "Bogor – Jakarta",
        "arah": "Bogor ke Jakarta",
        "hari": "Senin",
        "tanggal": "03-03-2025"
    },
    4: {
        "nama": "Trip 4",
        "trayek": "Jakarta – Purwakarta",
        "arah": "Jakarta ke Purwakarta",
        "hari": "Selasa",
        "tanggal": "04-03-2025"
    },
    5: {
        "nama": "Trip 5",
        "trayek": "Purwakarta – Bandung",
        "arah": "Purwakarta ke Bandung",
        "hari": "Rabu",
        "tanggal": "05-03-2025"
    },
    6: {
        "nama": "Trip 6",
        "trayek": "Bandung – Garut",
        "arah": "Bandung ke Garut",
        "hari": "Kamis",
        "tanggal": "06-03-2025"
    },
    7: {
        "nama": "Trip 7",
        "trayek": "Garut – Tasikmalaya",
        "arah": "Garut ke Tasikmalaya",
        "hari": "Jumat",
        "tanggal": "07-03-2025"
    },
    8: {
        "nama": "Trip 8",
        "trayek": "Tasikmalaya – Malang",
        "arah": "Tasikmalaya ke Malang",
        "hari": "Sabtu",
        "tanggal": "08-03-2025"
    },
    9: {
        "nama": "Trip 9",
        "trayek": "Malang – Jakarta",
        "arah": "Malang ke Jakarta",
        "hari": "Minggu",
        "tanggal": "09-03-2025"
    }
}


# ============================================================
# 3. FUNGSI HAVERSINE
# ============================================================

def haversine(lat1, lon1, lat2, lon2):

    R = 6371

    lat1 = math.radians(lat1)
    lat2 = math.radians(lat2)

    dlat = lat2 - lat1
    dlon = math.radians(lon2 - lon1)

    a = (
        math.sin(dlat / 2) ** 2
        + math.cos(lat1)
        * math.cos(lat2)
        * math.sin(dlon / 2) ** 2
    )

    return 2 * R * math.asin(
        math.sqrt(a)
    )


# ============================================================
# 4. LOAD GPS
# ============================================================

gps = pd.read_csv(
    "data/gps_final.csv"
)

gps["waktu"] = pd.to_datetime(
    gps["waktu"]
)


# ============================================================
# 5. HITUNG STATISTIK GPS
# ============================================================

trip_stats = {}

for trip_id, group in gps.groupby("trip_id"):

    group = group.sort_values(
        "waktu"
    ).copy()

    jarak_gps = 0

    for i in range(1, len(group)):

        jarak_gps += haversine(
            group.iloc[i - 1]["latitude"],
            group.iloc[i - 1]["longitude"],
            group.iloc[i]["latitude"],
            group.iloc[i]["longitude"]
        )

    durasi = (
        group["waktu"].iloc[-1]
        - group["waktu"].iloc[0]
    ).total_seconds() / 60

    kecepatan_rata = (
        jarak_gps / (durasi / 60)
        if durasi > 0
        else 0
    )

    trip_stats[int(trip_id)] = {

        "jarak_gps": round(
            jarak_gps,
            2
        ),

        "durasi_menit": round(
            durasi,
            1
        ),

        "kecepatan_rata": round(
            kecepatan_rata,
            1
        ),

        "kecepatan_maks": round(
            group["kecepatan_kmh"].max(),
            1
        ),

        "jumlah_titik": len(
            group
        ),

        "jam_mulai": group[
            "waktu"
        ].iloc[0].strftime("%H:%M"),

        "jam_selesai": group[
            "waktu"
        ].iloc[-1].strftime("%H:%M"),

        "jam_berangkat": group[
            "waktu"
        ].iloc[0].hour
    }


# ============================================================
# 6. ENRICHMENT DATA RUTE
# ============================================================

for feature in rute_asli["features"]:

    p = feature["properties"]

    trip_id = int(
        p["trip_id"]
    )

    config = trip_config[
        trip_id
    ]


    # --------------------------------------------------------
    # IDENTITAS PERJALANAN
    # --------------------------------------------------------

    p["nama"] = config["nama"]

    p["kendaraan"] = (
        "Mobil operasional"
    )

    p["kode_kendaraan"] = "K-10"

    p["trayek"] = config[
        "trayek"
    ]

    p["arah"] = config[
        "arah"
    ]

    p["hari"] = config[
        "hari"
    ]

    p["tanggal"] = config[
        "tanggal"
    ]


    # --------------------------------------------------------
    # DATA RUTE DARI ORS
    # --------------------------------------------------------

    jarak_ors = float(
        p["jarak_km"]
    )

    durasi_ors = p.get(
        "durasi_menit",
        None
    )

    if durasi_ors is not None:

        durasi_ors = float(
            durasi_ors
        )


    # --------------------------------------------------------
    # DATA GPS
    # --------------------------------------------------------

    if trip_id in trip_stats:

        stats = trip_stats[
            trip_id
        ]

        p["jam_mulai"] = (
            stats["jam_mulai"]
        )

        p["jam_selesai"] = (
            stats["jam_selesai"]
        )

        p["jam_berangkat"] = (
            stats["jam_berangkat"]
        )

        p["jumlah_titik"] = (
            stats["jumlah_titik"]
        )


        # ----------------------------------------------------
        # TRIP 4–9
        # Statistik kecepatan dari GPS
        # ----------------------------------------------------

        if trip_id >= 4:

            p["kecepatan_maks"] = (
                stats["kecepatan_maks"]
            )

            p["durasi_gps_menit"] = (
                stats["durasi_menit"]
            )

            p["kecepatan_gps_rata"] = (
                stats["kecepatan_rata"]
            )


    # --------------------------------------------------------
    # DURASI & KECEPATAN RUTE ORS
    # --------------------------------------------------------

    p["durasi_menit"] = round(
        durasi_ors,
        1
    )

    if durasi_ors > 0:

        p["kecepatan_rata"] = round(
            jarak_ors / (
                durasi_ors / 60
            ),
            1
        )

    else:

        p["kecepatan_rata"] = None


    # --------------------------------------------------------
    # KECEPATAN MAKSIMUM
    # --------------------------------------------------------

    # Trip 1–3 tidak menggunakan
    # kecepatan maksimum dari GPS lama.

    if trip_id <= 3:

        p["kecepatan_maks"] = None


    # --------------------------------------------------------
    # JARAK RESMI
    # --------------------------------------------------------

    p["jarak_km"] = jarak_ors


    # ========================================================
    # 7. PERHITUNGAN BBM
    # ========================================================

    p["jenis_bbm"] = (
        "Pertalite"
    )

    p["harga_per_liter"] = 10000

    p["efisiensi_acuan"] = 12.0


    # Asumsi:
    # 1 liter = 12 km

    liter_total = (
        jarak_ors / 12.0
    )

    biaya = (
        liter_total * 10000
    )


    p["liter_total"] = round(
        liter_total,
        2
    )

    p["liter_jalan"] = round(
        liter_total,
        2
    )

    p["liter_idle"] = 0

    p["menit_idle"] = 0


    # ========================================================
    # 8. EFISIENSI BBM
    # ========================================================

    if jarak_ors > 0:

        p["liter_per_100km"] = round(
            (
                liter_total
                / jarak_ors
            ) * 100,
            2
        )

        p["km_per_liter"] = round(
            jarak_ors
            / liter_total,
            2
        )

    else:

        p["liter_per_100km"] = 0

        p["km_per_liter"] = 0


    # ========================================================
    # 9. BIAYA
    # ========================================================

    p["biaya_rp"] = round(
        biaya
    )

    p["liter_boros"] = 0

    p["biaya_boros_rp"] = 0


    # ========================================================
    # 10. INFORMASI RUTE
    # ========================================================

    p["malam"] = False

    p["profil_rute"] = (
        "driving-car"
    )

    p["metode_rute"] = (
        "Fastest Route"
    )


# ============================================================
# 11. URUTKAN TRIP
# ============================================================

rute_asli["features"] = sorted(
    rute_asli["features"],
    key=lambda x: int(
        x["properties"]["trip_id"]
    )
)


# ============================================================
# 12. SIMPAN HASIL AKHIR
# ============================================================

with open(
    "data/rute_final.geojson",
    "w",
    encoding="utf-8"
) as f:

    json.dump(
        rute_asli,
        f,
        ensure_ascii=False,
        indent=2
    )


# ============================================================
# 13. CEK HASIL
# ============================================================

trip_ids = [
    f["properties"]["trip_id"]
    for f in rute_asli["features"]
]


print(
    "=== ENRICHMENT BERHASIL ==="
)

print(
    "Jumlah feature:",
    len(rute_asli["features"])
)

print(
    "Trip ID:",
    trip_ids
)

print(
    "File:",
    "data/rute_final.geojson"
)


print(
    "\n=== CEK DATA RUTE ==="
)

for feature in rute_asli[
    "features"
]:

    p = feature[
        "properties"
    ]

    print(
        f"Trip {p['trip_id']}: "
        f"{p['trayek']} | "
        f"{p['jarak_km']} km | "
        f"{p['durasi_menit']} menit | "
        f"Rata-rata "
        f"{p.get('kecepatan_rata', '-')} km/jam | "
        f"Maks "
        f"{p.get('kecepatan_maks', '-')} km/jam | "
        f"BBM "
        f"{p.get('liter_total', '-')} L | "
        f"Biaya Rp"
        f"{p.get('biaya_rp', '-')}"
    )