import requests
import json
import time


# ==========================================
# OSRM ROUTING
# PROFILE: DRIVING
# ==========================================

OSRM_URL = "https://router.project-osrm.org/route/v1/driving"


# ==========================================
# DAFTAR PERJALANAN
# ==========================================

trips = [
    {
        "trip_id": 1,
        "nama": "Trip 1",
        "asal": "Balaraja",
        "tujuan": "Jakarta",
        "start": (106.486745, -6.200583),
        "end": (106.893611, -6.121562),
        "output": "rute.geojson"
    },

    {
        "trip_id": 2,
        "nama": "Trip 2",
        "asal": "Jakarta",
        "tujuan": "Bogor",
        "start": (106.893611, -6.121562),
        "end": (106.799568, -6.597629),
        "output": "rute_day2.geojson"
    },

    {
        "trip_id": 3,
        "nama": "Trip 3",
        "asal": "Bogor",
        "tujuan": "Jakarta",
        "start": (106.799568, -6.597629),
        "end": (106.893611, -6.121562),
        "output": "rute_day3.geojson"
    },

    {
        "trip_id": 4,
        "nama": "Trip 4",
        "asal": "Jakarta",
        "tujuan": "Purwakarta",
        "start": (106.8272, -6.1754),
        "end": (107.4433, -6.5569),
        "output": "rute_day4.geojson"
    },

    {
        "trip_id": 5,
        "nama": "Trip 5",
        "asal": "Purwakarta",
        "tujuan": "Bandung",
        "start": (107.4433, -6.5569),
        "end": (107.6098, -6.9175),
        "output": "rute_day5.geojson"
    },

    {
        "trip_id": 6,
        "nama": "Trip 6",
        "asal": "Bandung",
        "tujuan": "Garut",
        "start": (107.6098, -6.9175),
        "end": (107.9015, -7.2167),
        "output": "rute_day6.geojson"
    },

    {
        "trip_id": 7,
        "nama": "Trip 7",
        "asal": "Garut",
        "tujuan": "Tasikmalaya",
        "start": (107.9015, -7.2167),
        "end": (108.2207, -7.3274),
        "output": "rute_day7.geojson"
    },

    {
        "trip_id": 8,
        "nama": "Trip 8",
        "asal": "Tasikmalaya",
        "tujuan": "Malang",
        "start": (108.2207, -7.3274),
        "end": (112.6304, -7.9797),
        "output": "rute_day8.geojson"
    },

    {
        "trip_id": 9,
        "nama": "Trip 9",
        "asal": "Malang",
        "tujuan": "Jakarta",
        "start": (112.6304, -7.9797),
        "end": (106.8272, -6.1754),
        "output": "rute_day9.geojson"
    }
]


# ==========================================
# FUNGSI ROUTING
# ==========================================

def get_route(trip):

    start_lon, start_lat = trip["start"]
    end_lon, end_lat = trip["end"]

    coordinates = (
        f"{start_lon},{start_lat};"
        f"{end_lon},{end_lat}"
    )

    url = f"{OSRM_URL}/{coordinates}"

    params = {
        "overview": "full",
        "geometries": "geojson",
        "steps": "false"
    }

    response = requests.get(
        url,
        params=params,
        timeout=60
    )

    print(
        f"\nTrip {trip['trip_id']}: "
        f"{trip['asal']} -> {trip['tujuan']}"
    )

    print(
        "HTTP Status:",
        response.status_code
    )

    if response.status_code != 200:
        print(
            "ERROR:",
            response.text
        )
        return None

    data = response.json()

    if data.get("code") != "Ok":
        print(
            "Routing gagal:",
            data.get("code")
        )
        return None

    route = data["routes"][0]

    distance_km = (
        route["distance"] / 1000
    )

    duration_min = (
        route["duration"] / 60
    )

    if duration_min > 0:
        speed = (
            distance_km /
            (duration_min / 60)
        )
    else:
        speed = 0

    geometry = route["geometry"]

    print(
        "Status       : BERHASIL"
    )

    print(
        f"Jarak        : "
        f"{distance_km:.2f} km"
    )

    print(
        f"Durasi       : "
        f"{duration_min:.1f} menit"
    )

    print(
        f"Kecepatan    : "
        f"{speed:.1f} km/jam"
    )

    print(
        f"Jumlah titik : "
        f"{len(geometry['coordinates'])}"
    )


    # ======================================
    # GEOJSON
    # ======================================

    feature = {
        "type": "Feature",
        "properties": {
            "trip_id": trip["trip_id"],
            "nama": trip["nama"],
            "asal": trip["asal"],
            "tujuan": trip["tujuan"],
            "jarak_km": round(
                distance_km,
                2
            ),
            "durasi_menit": round(
                duration_min,
                1
            ),
            "kecepatan_rata": round(
                speed,
                1
            ),
            "routing_engine": "OSRM",
            "routing_profile": "driving"
        },
        "geometry": geometry
    }


    geojson = {
        "type": "FeatureCollection",
        "features": [feature]
    }


    output_path = (
        f"data/{trip['output']}"
    )


    with open(
        output_path,
        "w",
        encoding="utf-8"
    ) as f:

        json.dump(
            geojson,
            f,
            ensure_ascii=False,
            indent=2
        )


    print(
        "GeoJSON berhasil disimpan:",
        output_path
    )

    return True


# ==========================================
# JALANKAN SEMUA TRIP
# ==========================================

for trip in trips:

    try:

        get_route(trip)

        # Jeda supaya request tidak terlalu cepat
        time.sleep(1)

    except Exception as e:

        print(
            f"ERROR Trip {trip['trip_id']}:",
            e
        )


print(
    "\n=========================================="
)

print(
    "SEMUA RUTE OSRM SELESAI DIPROSES"
)

print(
    "Routing engine : OSRM"
)

print(
    "Profile        : driving"
)

print(
    "Kendaraan      : Mobil"
)

print(
    "=========================================="
)