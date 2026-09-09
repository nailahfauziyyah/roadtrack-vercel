import pandas as pd

# Baca data GPS asli dan GPS simulasi
gps_asli = pd.read_csv("data/gps_roadtrack.csv")
gps_simulasi = pd.read_csv("data/gps_simulasi_day2_day7.csv")

# Gabungkan berdasarkan baris
gps_gabungan = pd.concat(
    [gps_asli, gps_simulasi],
    ignore_index=True
)

# Simpan hasil
gps_gabungan.to_csv(
    "data/gps_final.csv",
    index=False
)

print("=== DATA GPS BERHASIL DIGABUNGKAN ===")
print("Jumlah baris:", len(gps_gabungan))
print("Trip ID:", sorted(gps_gabungan["trip_id"].unique().tolist()))
print()
print("Jumlah data per trip:")
print(gps_gabungan["trip_id"].value_counts().sort_index())
print()
print("File disimpan sebagai:")
print("data/gps_final.csv")