import os
import json
import csv
import math
from datetime import datetime, timedelta

# ==============================================================================
# FUNGSI BANTUAN: Menghitung jarak antara dua titik koordinat (Haversine)
# ==============================================================================
def haversine(lon1, lat1, lon2, lat2):
    """
    Menghitung jarak antara dua titik koordinat (dalam km)
    menggunakan rumus Haversine.
    """
    R = 6371.0

    phi1 = math.radians(lat1)
    phi2 = math.radians(lat2)
    dphi = math.radians(lat2 - lat1)
    dlambda = math.radians(lon2 - lon1)

    a = (
        math.sin(dphi / 2.0) ** 2
        + math.cos(phi1)
        * math.cos(phi2)
        * math.sin(dlambda / 2.0) ** 2
    )

    c = 2.0 * math.atan2(math.sqrt(a), math.sqrt(1.0 - a))

    return R * c


# ==============================================================================
# FUNGSI BANTUAN: Sampling titik di sepanjang geometri rute OSRM
# ==============================================================================
def sample_route_points(coordinates, num_points):
    """
    Mengambil sejumlah titik di sepanjang polyline rute OSRM.
    Titik GPS dibuat mengikuti geometri rute.
    """

    # Hitung jarak kumulatif pada setiap vertex
    cum_dist = [0.0]

    for i in range(1, len(coordinates)):
        d = haversine(
            coordinates[i - 1][0],
            coordinates[i - 1][1],
            coordinates[i][0],
            coordinates[i][1]
        )

        cum_dist.append(cum_dist[-1] + d)

    total_dist = cum_dist[-1]

    sampled_coords = []
    seg_idx = 0

    for i in range(num_points):

        target_d = i * total_dist / (num_points - 1)

        while (
            seg_idx < len(cum_dist) - 1
            and cum_dist[seg_idx + 1] < target_d
        ):
            seg_idx += 1

        if seg_idx >= len(coordinates) - 1:

            sampled_coords.append(coordinates[-1])

        else:

            d_start = cum_dist[seg_idx]
            d_end = cum_dist[seg_idx + 1]

            seg_len = d_end - d_start

            if seg_len > 0:
                fraction = (target_d - d_start) / seg_len
            else:
                fraction = 0.0

            p_start = coordinates[seg_idx]
            p_end = coordinates[seg_idx + 1]

            interp_lon = (
                p_start[0]
                + fraction * (p_end[0] - p_start[0])
            )

            interp_lat = (
                p_start[1]
                + fraction * (p_end[1] - p_start[1])
            )

            sampled_coords.append(
                [interp_lon, interp_lat]
            )

    return sampled_coords


# ==============================================================================
# KONFIGURASI TRIP DAY 2 - DAY 7
# ==============================================================================

trips_config = [

    # --------------------------------------------------------------------------
    # TRIP 4
    # --------------------------------------------------------------------------
    {
        "day": 2,
        "trip_id": 4,
        "asal": "Jakarta",
        "tujuan": "Purwakarta",
        "date_str": "2025-03-04",
        "start_time_str": "08:00:00",
        "duration_seconds": 4716,   # ~1.31 jam
        "geojson_file": "rute_day2.geojson",
        "num_points": 120
    },

    # --------------------------------------------------------------------------
    # TRIP 5
    # --------------------------------------------------------------------------
    {
        "day": 3,
        "trip_id": 5,
        "asal": "Purwakarta",
        "tujuan": "Bandung",
        "date_str": "2025-03-05",
        "start_time_str": "08:00:00",
        "duration_seconds": 2900,   # ~0.81 jam
        "geojson_file": "rute_day3.geojson",
        "num_points": 120
    },

    # --------------------------------------------------------------------------
    # TRIP 6
    # --------------------------------------------------------------------------
    {
        "day": 4,
        "trip_id": 6,
        "asal": "Bandung",
        "tujuan": "Garut",
        "date_str": "2025-03-06",
        "start_time_str": "08:00:00",
        "duration_seconds": 3238,   # ~0.90 jam
        "geojson_file": "rute_day4.geojson",
        "num_points": 120
    },

    # --------------------------------------------------------------------------
    # TRIP 7
    # --------------------------------------------------------------------------
    {
        "day": 5,
        "trip_id": 7,
        "asal": "Garut",
        "tujuan": "Tasikmalaya",
        "date_str": "2025-03-07",
        "start_time_str": "08:00:00",
        "duration_seconds": 3285,   # ~0.91 jam
        "geojson_file": "rute_day5.geojson",
        "num_points": 120
    },

    # --------------------------------------------------------------------------
    # TRIP 8
    # --------------------------------------------------------------------------
    {
        "day": 6,
        "trip_id": 8,
        "asal": "Tasikmalaya",
        "tujuan": "Malang",
        "date_str": "2025-03-08",
        "start_time_str": "08:00:00",
        "duration_seconds": 30535,  # ~8.48 jam
        "geojson_file": "rute_day6.geojson",
        "num_points": 140
    },

    # --------------------------------------------------------------------------
    # TRIP 9
    # --------------------------------------------------------------------------
    {
        "day": 7,
        "trip_id": 9,
        "asal": "Malang",
        "tujuan": "Jakarta",
        "date_str": "2025-03-09",
        "start_time_str": "08:00:00",
        "duration_seconds": 37373,  # ~10.38 jam
        "geojson_file": "rute_day7.geojson",
        "num_points": 150
    }
]


# ==============================================================================
# PROSES UTAMA: GENERASI DATA GPS
# ==============================================================================

def main():

    data_dir = os.path.dirname(os.path.abspath(__file__))

    output_csv_path = os.path.join(
        data_dir,
        "gps_simulasi_day2_day7.csv"
    )

    all_records = []
    comparison_results = []

    print(
        "=== MEMULAI GENERASI DATA GPS SIMULASI "
        "(DAY 2 - DAY 7) ===\n"
    )

    for conf in trips_config:

        geojson_path = os.path.join(
            data_dir,
            conf["geojson_file"]
        )

        # ----------------------------------------------------------------------
        # 1. Baca GeoJSON
        # ----------------------------------------------------------------------

        with open(
            geojson_path,
            "r",
            encoding="utf-8"
        ) as f:

            geojson_data = json.load(f)

        feature = geojson_data["features"][0]

        coordinates = feature["geometry"]["coordinates"]

        osrm_total_km = feature["properties"]["jarak_km"]

        num_points = conf["num_points"]

        # ----------------------------------------------------------------------
        # 2. Sampling koordinat
        # ----------------------------------------------------------------------

        sampled_coords = sample_route_points(
            coordinates,
            num_points
        )

        # ----------------------------------------------------------------------
        # 3. Hitung jarak antar titik GPS
        # ----------------------------------------------------------------------

        chord_dists = []

        for i in range(1, num_points):

            d = haversine(
                sampled_coords[i - 1][0],
                sampled_coords[i - 1][1],
                sampled_coords[i][0],
                sampled_coords[i][1]
            )

            chord_dists.append(d)

        total_chord_dist = sum(chord_dists)

        # Sesuaikan total jarak GPS dengan jarak OSRM
        if total_chord_dist > 0:
            scale_factor = (
                osrm_total_km / total_chord_dist
            )
        else:
            scale_factor = 1.0

        seg_dists = [
            d * scale_factor
            for d in chord_dists
        ]

        # ----------------------------------------------------------------------
        # 4. Hitung interval waktu
        # ----------------------------------------------------------------------

        start_dt = datetime.strptime(
            f"{conf['date_str']} {conf['start_time_str']}",
            "%Y-%m-%d %H:%M:%S"
        )

        dt_seconds = (
            conf["duration_seconds"]
            / (num_points - 1)
        )

        dt_hours = dt_seconds / 3600.0

        trip_records = []

        cumulative_distance = 0.0

        # ----------------------------------------------------------------------
        # 5. Bangun data GPS
        # ----------------------------------------------------------------------

        for i in range(num_points):

            curr_lon, curr_lat = sampled_coords[i]

            curr_time = (
                start_dt
                + timedelta(seconds=i * dt_seconds)
            )

            time_str = curr_time.strftime(
                "%Y-%m-%d %H:%M:%S"
            )

            if i == 0:

                speed_kmh = (
                    seg_dists[0] / dt_hours
                )

                cumulative_distance = 0.0

            else:

                cumulative_distance += seg_dists[i - 1]

                speed_kmh = (
                    seg_dists[i - 1] / dt_hours
                )

            record = {
                "trip_id": conf["trip_id"],
                "waktu": time_str,
                "latitude": round(curr_lat, 6),
                "longitude": round(curr_lon, 6),
                "kecepatan_kmh": round(speed_kmh, 1),
                "jarak_km": round(cumulative_distance, 2)
            }

            trip_records.append(record)

        all_records.extend(trip_records)

        # ----------------------------------------------------------------------
        # 6. Simpan hasil perbandingan
        # ----------------------------------------------------------------------

        final_gps_km = trip_records[-1]["jarak_km"]

        comparison_results.append({
            "trip_id": conf["trip_id"],
            "day": conf["day"],
            "asal": conf["asal"],
            "tujuan": conf["tujuan"],
            "osrm_km": osrm_total_km,
            "gps_km": final_gps_km
        })

        # ----------------------------------------------------------------------
        # 7. Tampilkan ringkasan
        # ----------------------------------------------------------------------

        avg_speed = round(
            sum(
                r["kecepatan_kmh"]
                for r in trip_records
            ) / len(trip_records),
            1
        )

        print(
            f"Trip {conf['trip_id']} "
            f"(Day {conf['day']}: "
            f"{conf['asal']} -> {conf['tujuan']}):"
        )

        print(
            f"  - Jumlah baris digenerate : "
            f"{len(trip_records)} baris"
        )

        print(
            f"  - Rentang waktu           : "
            f"{trip_records[0]['waktu']} "
            f"s.d. {trip_records[-1]['waktu']}"
        )

        print(
            f"  - Kecepatan rata-rata     : "
            f"{avg_speed} km/jam"
        )

        print(
            f"  - Total jarak kumulatif   : "
            f"{final_gps_km} km\n"
        )

    # ==============================================================================
    # SIMPAN CSV
    # ==============================================================================

    fieldnames = [
        "trip_id",
        "waktu",
        "latitude",
        "longitude",
        "kecepatan_kmh",
        "jarak_km"
    ]

    with open(
        output_csv_path,
        "w",
        newline="",
        encoding="utf-8"
    ) as csvfile:

        writer = csv.DictWriter(
            csvfile,
            fieldnames=fieldnames
        )

        writer.writeheader()
        writer.writerows(all_records)

    print(
        f"Sukses! Total {len(all_records)} baris "
        f"data GPS berhasil disimpan ke:"
    )

    print(f"-> {output_csv_path}\n")

    # ==============================================================================
    # PERBANDINGAN OSRM VS GPS
    # ==============================================================================

    print("=" * 80)
    print(
        "PERBANDINGAN JARAK RUTE OSRM "
        "VS JARAK KUMULATIF GPS SIMULASI"
    )
    print("=" * 80)

    for res in comparison_results:

        diff = abs(
            res["gps_km"]
            - res["osrm_km"]
        )

        print(
            f"Day {res['day']} "
            f"(Trip {res['trip_id']}: "
            f"{res['asal']} -> {res['tujuan']}):"
        )

        print(
            f"  - Jarak Rute OSRM        : "
            f"{res['osrm_km']:.2f} km"
        )

        print(
            f"  - Jarak Kumulatif GPS    : "
            f"{res['gps_km']:.2f} km"
        )

        print(
            f"  - Selisih                : "
            f"{diff:.2f} km"
        )

        print()

    print("=" * 80)


if __name__ == "__main__":
    main()