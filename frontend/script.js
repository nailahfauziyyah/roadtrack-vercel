// ==========================================
// ROADTRACK - WEBGIS MONITORING MOBIL
// Routing: OSRM - Driving
// ==========================================


// ==========================================
// 1. INISIALISASI MAP
// ==========================================

const map = L.map("map").setView(
    [-6.9175, 107.6191],
    9
);


// ==========================================
// 2. BASEMAP OPENSTREETMAP
// ==========================================

L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
        maxZoom: 19,
        attribution: "&copy; OpenStreetMap contributors"
    }
).addTo(map);


// ==========================================
// 3. WARNA TRIP
// ==========================================

const colors = [
    "#e41a1c",
    "#377eb8",
    "#4daf4a",
    "#984ea3",
    "#ff7f00",
    "#a65628",
    "#f781bf",
    "#17becf",
    "#bcbd22"
];


// ==========================================
// 4. NAMA TRAYEK
// ==========================================

const tripRoutes = {
    1: "Balaraja - Jakarta",
    2: "Jakarta - Bogor",
    3: "Bogor - Jakarta",
    4: "Jakarta - Purwakarta",
    5: "Purwakarta - Bandung",
    6: "Bandung - Garut",
    7: "Garut - Tasikmalaya",
    8: "Tasikmalaya - Malang",
    9: "Malang - Jakarta"
};


// ==========================================
// 5. VARIABLE
// ==========================================

let routeLayer = null;
let allFeatures = [];


// ==========================================
// 6. FORMAT ANGKA
// ==========================================

function formatNumber(value, decimals = 2) {

    if (
        value === null ||
        value === undefined ||
        value === "" ||
        Number.isNaN(Number(value))
    ) {
        return "-";
    }

    return Number(value).toLocaleString(
        "id-ID",
        {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
        }
    );
}


// ==========================================
// 7. FORMAT RUPIAH
// ==========================================

function formatRupiah(value) {

    if (
        value === null ||
        value === undefined ||
        value === "" ||
        Number.isNaN(Number(value))
    ) {
        return "-";
    }

    return (
        "Rp " +
        Number(value).toLocaleString("id-ID")
    );
}


// ==========================================
// 8. AMBIL ID TRIP
// ==========================================

function getTripId(properties) {

    return Number(
        properties.trip_id
    );
}


// ==========================================
// 9. GET NAMA TRAYEK
// ==========================================

function getTrayek(properties) {

    const tripId = getTripId(properties);

    return (
        tripRoutes[tripId] ||
        properties.nama ||
        properties.trayek ||
        `${properties.asal || "-"} - ${properties.tujuan || "-"}`
    );
}


// ==========================================
// 10. AMBIL DATA BBM
// ==========================================

function getFuel(properties) {

    if (
        properties.fuel_liter !== undefined &&
        properties.fuel_liter !== null
    ) {
        return Number(properties.fuel_liter);
    }

    if (
        properties.liter_total !== undefined &&
        properties.liter_total !== null
    ) {
        return Number(properties.liter_total);
    }

    return null;
}


// ==========================================
// 11. AMBIL DATA BIAYA
// ==========================================

function getCost(properties) {

    if (
        properties.cost_rp !== undefined &&
        properties.cost_rp !== null
    ) {
        return Number(properties.cost_rp);
    }

    if (
        properties.biaya_rp !== undefined &&
        properties.biaya_rp !== null
    ) {
        return Number(properties.biaya_rp);
    }

    return null;
}


// ==========================================
// 12. AMBIL MAX SPEED
// ==========================================

function getMaxSpeed(properties) {

    if (
        properties.max_speed !== undefined &&
        properties.max_speed !== null &&
        properties.max_speed !== ""
    ) {
        return Number(properties.max_speed);
    }

    if (
        properties.kecepatan_maks !== undefined &&
        properties.kecepatan_maks !== null &&
        properties.kecepatan_maks !== ""
    ) {
        return Number(properties.kecepatan_maks);
    }

    // Data max speed dari GPS untuk Trip 1-3
    const tripMaxSpeed = {
        1: 41.6,
        2: 58.9,
        3: 36.2
    };

    const tripId = getTripId(properties);

    if (tripMaxSpeed[tripId] !== undefined) {
        return tripMaxSpeed[tripId];
    }

    return null;
}


// ==========================================
// 13. UPDATE DETAIL TRIP
// ==========================================

function updateTripInfo(properties) {

    const tripId = getTripId(properties);

    const fuel = getFuel(properties);
    const cost = getCost(properties);
    const maxSpeed = getMaxSpeed(properties);

    const elements = {

        number: document.getElementById("trip-number"),

        name: document.getElementById("trip-name"),

        route: document.getElementById("trip-route"),

        distance: document.getElementById("trip-distance"),

        duration: document.getElementById("trip-duration"),

        speed: document.getElementById("trip-speed"),

        fuel: document.getElementById("trip-fuel"),

        date: document.getElementById("trip-date"),

        maxSpeed: document.getElementById("trip-max-speed"),

        cost: document.getElementById("trip-cost")
    };


    // TRIP NUMBER
    if (elements.number) {

        elements.number.textContent =
            tripId || "—";
    }


    // NAMA
    if (elements.name) {

        elements.name.textContent =
            properties.nama ||
            `Trip ${tripId}`;
    }


    // TRAYEK
    if (elements.route) {

        elements.route.textContent =
            getTrayek(properties);
    }


    // JARAK
    if (elements.distance) {

        elements.distance.textContent =
            formatNumber(
                properties.jarak_km,
                2
            ) + " km";
    }


    // DURASI
    if (elements.duration) {

        elements.duration.textContent =
            formatNumber(
                properties.durasi_menit,
                1
            ) + " menit";
    }


    // KECEPATAN RATA-RATA
    if (elements.speed) {

        elements.speed.textContent =
            formatNumber(
                properties.kecepatan_rata,
                1
            ) + " km/jam";
    }


    // BBM
    if (elements.fuel) {

        if (fuel !== null) {

            elements.fuel.textContent =
                formatNumber(
                    fuel,
                    2
                ) + " L";

        } else {

            elements.fuel.textContent = "-";
        }
    }


    // TANGGAL
    if (elements.date) {

        elements.date.textContent =
            properties.tanggal || "-";
    }


    // MAX SPEED
    if (elements.maxSpeed) {

        if (maxSpeed !== null) {

            elements.maxSpeed.textContent =
                formatNumber(
                    maxSpeed,
                    1
                ) + " km/jam";

        } else {

            elements.maxSpeed.textContent = "-";
        }
    }


    // BIAYA
    if (elements.cost) {

        if (cost !== null) {

            elements.cost.textContent =
                formatRupiah(cost);

        } else {

            elements.cost.textContent = "-";
        }
    }
}


// ==========================================
// 14. UPDATE SUMMARY
// ==========================================

function updateSummary(features) {

    let totalDistance = 0;

    // ======================================
    // TAMBAHAN:
    // TOTAL DURASI PERJALANAN
    // ======================================
    let totalDuration = 0;

    let totalFuel = 0;
    let totalCost = 0;


    features.forEach(function(feature) {

        const p = feature.properties;

        totalDistance +=
            Number(p.jarak_km) || 0;


        // ==================================
        // TAMBAHAN:
        // MENJUMLAHKAN DURASI OSRM
        // ==================================
        totalDuration +=
            Number(p.durasi_menit) || 0;


        totalFuel +=
            Number(getFuel(p)) || 0;

        totalCost +=
            Number(getCost(p)) || 0;
    });


    const totalTrip =
        document.getElementById("total-trip");

    const totalDistanceElement =
        document.getElementById("total-distance");


    // ======================================
    // TAMBAHAN:
    // ELEMENT ESTIMATION
    // ======================================
    const totalEstimationElement =
        document.getElementById("total-estimation");


    const totalFuelElement =
        document.getElementById("total-fuel");

    const totalCostElement =
        document.getElementById("total-cost");


    if (totalTrip) {

        totalTrip.textContent =
            features.length;
    }


    if (totalDistanceElement) {

        totalDistanceElement.textContent =
            formatNumber(
                totalDistance,
                2
            ) + " km";
    }


    // ======================================
    // TAMBAHAN:
    // FORMAT ESTIMASI DURASI
    // ======================================

    if (totalEstimationElement) {

        const hours =
            Math.floor(
                totalDuration / 60
            );

        const minutes =
            Math.round(
                totalDuration % 60
            );


        if (hours > 0) {

            totalEstimationElement.textContent =
                `${hours}j ${minutes}m`;

        } else {

            totalEstimationElement.textContent =
                `${minutes}m`;
        }
    }


    if (totalFuelElement) {

        totalFuelElement.textContent =
            formatNumber(
                totalFuel,
                2
            ) + " L";
    }


    if (totalCostElement) {

        totalCostElement.textContent =
            formatRupiah(totalCost);
    }
}


// ==========================================
// 15. POPUP
// ==========================================

function createPopup(properties) {

    const tripId =
        getTripId(properties);

    const fuel =
        getFuel(properties);

    const cost =
        getCost(properties);

    const maxSpeed =
        getMaxSpeed(properties);


    const maxSpeedText =
        maxSpeed !== null
            ? formatNumber(maxSpeed, 1) + " km/jam"
            : "-";


    const fuelText =
        fuel !== null
            ? formatNumber(fuel, 2) + " liter"
            : "-";


    const costText =
        cost !== null
            ? formatRupiah(cost)
            : "-";


    // ======================================
    // EDITAN:
    // POPUP MENYESUAIKAN UKURAN
    // ======================================

    return `
        <div style="
            width:100%;
            max-width:280px;
            font-family:Arial,sans-serif;
            line-height:1.5;
            font-size:12px;
            box-sizing:border-box;
        ">

            <h3 style="
                margin:0 0 12px 0;
                font-size:15px;
            ">
                ${properties.nama || `Trip ${tripId}`}
            </h3>

            <p>
                <b>Trip:</b>
                ${tripId}
            </p>

            <p>
                <b>Trayek:</b><br>
                ${getTrayek(properties)}
            </p>

            <p>
                <b>Jarak:</b>
                ${formatNumber(
                    properties.jarak_km,
                    2
                )} km
            </p>

            <p>
                <b>Durasi:</b>
                ${formatNumber(
                    properties.durasi_menit,
                    1
                )} menit
            </p>

            <p>
                <b>Kecepatan rata-rata:</b>
                ${formatNumber(
                    properties.kecepatan_rata,
                    1
                )} km/jam
            </p>

            <p>
                <b>Kecepatan maksimum:</b>
                ${maxSpeedText}
            </p>

            <p>
                <b>BBM:</b>
                ${fuelText}
            </p>

            <p>
                <b>Biaya BBM:</b>
                ${costText}
            </p>

            <p>
                <b>Routing:</b>
                OSRM Driving
            </p>

        </div>
    `;
}


// ==========================================
// 16. LOAD GEOJSON
// ==========================================

fetch("../data/rute_final.geojson")

    .then(function(response) {

        if (!response.ok) {

            throw new Error(
                "rute_final.geojson tidak ditemukan"
            );
        }

        return response.json();
    })


    .then(function(data) {

        console.log(
            "GeoJSON OSRM berhasil dimuat:",
            data
        );


        if (
            !data.features ||
            data.features.length === 0
        ) {

            throw new Error(
                "GeoJSON tidak memiliki data"
            );
        }


        allFeatures =
            data.features;


        // ==================================
        // SUMMARY AWAL
        // ==================================

        updateSummary(
            allFeatures
        );


        // ==================================
        // FILTER
        // ==================================

        const tripFilter =
            document.getElementById(
                "trip-filter"
            );


        if (tripFilter) {

            tripFilter.innerHTML = `
                <option value="all">
                    Semua Perjalanan
                </option>
            `;


            allFeatures.forEach(
                function(feature) {

                    const p =
                        feature.properties;

                    const tripId =
                        getTripId(p);


                    const option =
                        document.createElement(
                            "option"
                        );


                    option.value =
                        tripId;


                    option.textContent =
                        `Trip ${tripId} — ${getTrayek(p)}`;


                    tripFilter.appendChild(
                        option
                    );
                }
            );
        }


        // ==================================
        // ROUTE LAYER
        // ==================================

        routeLayer =
            L.geoJSON(
                data,
                {

                    style:
                        function(feature) {

                            const tripId =
                                getTripId(
                                    feature.properties
                                );


                            return {

                                color:
                                    colors[
                                        tripId - 1
                                    ] || "#e41a1c",

                                weight: 5,

                                opacity: 0.9
                            };
                        },


                    onEachFeature:
                        function(
                            feature,
                            layer
                        ) {

                            const p =
                                feature.properties;


                            // ==================================
                            // POPUP
                            // ==================================

                            // EDITAN:
                            // Popup dibuat tetap di dalam
                            // area peta dengan autoPan.

                            layer.bindPopup(
                                createPopup(p),
                                {
                                    autoPan: true,
                                    autoPanPadding: [
                                        40,
                                        40
                                    ],
                                    closeButton: true,
                                    maxWidth: 320,
                                    minWidth: 250
                                }
                            );


                            // HOVER
                            layer.on(
                                "mouseover",
                                function() {

                                    const selected =
                                        tripFilter
                                            ? tripFilter.value
                                            : "all";


                                    // ==================================
                                    // EDITAN:
                                    // Route yang tidak dipilih
                                    // tidak boleh melakukan hover
                                    // ==================================

                                    if (
                                        selected !== "all" &&
                                        Number(selected) !== getTripId(p)
                                    ) {
                                        return;
                                    }


                                    layer.setStyle({

                                        weight: 8,

                                        opacity: 1
                                    });

                                    layer.bringToFront();
                                }
                            );


                            layer.on(
                                "mouseout",
                                function() {

                                    const selected =
                                        tripFilter
                                            ? tripFilter.value
                                            : "all";


                                    if (
                                        selected === "all"
                                    ) {

                                        layer.setStyle({

                                            weight: 5,

                                            opacity: 0.9
                                        });

                                    } else if (
                                        Number(selected) ===
                                        getTripId(p)
                                    ) {

                                        layer.setStyle({

                                            weight: 8,

                                            opacity: 1
                                        });

                                    } else {

                                        layer.setStyle({

                                            weight: 4,

                                            opacity: 0.15
                                        });
                                    }
                                }
                            );


                            // CLICK
                            layer.on(
                                "click",
                                function() {

                                    updateTripInfo(p);


                                    if (tripFilter) {

                                        tripFilter.value =
                                            getTripId(p);
                                    }


                                    updateSummary([
                                        feature
                                    ]);


                                    highlightTrip(
                                        getTripId(p)
                                    );
                                }
                            );
                        }
                }
            ).addTo(map);


        // ==================================
        // ZOOM SEMUA RUTE
        // ==================================

        const bounds =
            routeLayer.getBounds();


        if (
            bounds.isValid()
        ) {

            map.fitBounds(
                bounds,
                {
                    padding: [
                        30,
                        30
                    ]
                }
            );
        }


        // ==================================
        // LEGEND
        // ==================================

        createLegend();


        // ==================================
        // FILTER EVENT
        // ==================================

        if (tripFilter) {

            tripFilter.addEventListener(
                "change",
                function() {

                    const value =
                        this.value;


                    // SEMUA TRIP
                    if (
                        value === "all"
                    ) {

                        resetRoutes();

                        updateSummary(
                            allFeatures
                        );

                        if (
                            allFeatures.length > 0
                        ) {

                            updateTripInfo(
                                allFeatures[0]
                                    .properties
                            );
                        }

                        return;
                    }


                    // TRIP TERTENTU
                    const selectedFeature =
                        allFeatures.find(
                            function(feature) {

                                return (
                                    getTripId(
                                        feature.properties
                                    ) ===
                                    Number(value)
                                );
                            }
                        );


                    if (
                        selectedFeature
                    ) {

                        updateTripInfo(
                            selectedFeature.properties
                        );


                        updateSummary([
                            selectedFeature
                        ]);


                        highlightTrip(
                            Number(value)
                        );
                    }
                }
            );
        }


        // ==================================
        // DEFAULT TRIP
        // ==================================

        if (
            allFeatures.length > 0
        ) {

            updateTripInfo(
                allFeatures[0].properties
            );
        }

    })


    .catch(function(error) {

        console.error(
            "ERROR:",
            error
        );


        alert(
            "Gagal memuat data rute. " +
            "Pastikan server dijalankan dari folder roadtrack."
        );
    });


// ==========================================
// 17. HIGHLIGHT TRIP
// ==========================================

function highlightTrip(tripId) {

    if (!routeLayer) {
        return;
    }


    routeLayer.eachLayer(
        function(layer) {

            if (!layer.feature) {
                return;
            }


            const id =
                getTripId(
                    layer.feature.properties
                );


            if (
                id === Number(tripId)
            ) {

                layer.setStyle({

                    weight: 8,

                    opacity: 1
                });


                // ==================================
                // EDITAN:
                // ROUTE TERPILIH AKTIF
                // ==================================

                setRouteInteraction(
                    layer,
                    true
                );


                layer.bringToFront();

            } else {

                layer.setStyle({

                    weight: 4,

                    opacity: 0.15
                });


                // ==================================
                // EDITAN:
                // ROUTE LAIN TIDAK BISA
                // MENERIMA KURSOR / CLICK
                // ==================================

                setRouteInteraction(
                    layer,
                    false
                );
            }
        }
    );


    // ==================================
    // ZOOM KE TRIP
    // ==================================

    const selectedLayer =
        routeLayer
            .getLayers()
            .find(
                function(layer) {

                    if (!layer.feature) {
                        return false;
                    }

                    return (
                        getTripId(
                            layer.feature.properties
                        ) === Number(tripId)
                    );
                }
            );


    if (
        selectedLayer
    ) {

        const bounds =
            selectedLayer.getBounds();


        if (
            bounds.isValid()
        ) {

            map.fitBounds(
                bounds,
                {
                    padding: [
                        60,
                        60
                    ],
                    maxZoom: 10
                }
            );
        }
    }
}


// ==========================================
// 17B. AKTIF / NONAKTIFKAN INTERAKSI ROUTE
// ==========================================

// EDITAN TAMBAHAN:
// Route yang tidak aktif dibuat tidak bisa
// menerima hover maupun click.

function setRouteInteraction(
    layer,
    active
) {

    const element =
        layer.getElement
            ? layer.getElement()
            : layer._path;


    if (!element) {
        return;
    }


    if (active) {

        element.style.pointerEvents =
            "auto";

    } else {

        element.style.pointerEvents =
            "none";
    }
}


// ==========================================
// 18. RESET ROUTES
// ==========================================

function resetRoutes() {

    if (!routeLayer) {
        return;
    }


    routeLayer.eachLayer(
        function(layer) {

            layer.setStyle({

                weight: 5,

                opacity: 0.9
            });


            // ==================================
            // EDITAN:
            // SEMUA ROUTE AKTIF KEMBALI
            // ==================================

            setRouteInteraction(
                layer,
                true
            );
        }
    );


    const bounds =
        routeLayer.getBounds();


    if (
        bounds.isValid()
    ) {

        map.fitBounds(
            bounds,
            {
                padding: [
                    30,
                    30
                ]
            }
        );
    }
}


// ==========================================
// 19. LEGEND
// ==========================================

function createLegend() {

    const legend =
        L.control({
            position: "bottomright"
        });


    legend.onAdd =
        function() {

            const div =
                L.DomUtil.create(
                    "div",
                    "legend"
                );


            div.innerHTML =
                "<b>ROUTE OVERVIEW</b><br>";


            colors.forEach(
                function(
                    color,
                    index
                ) {

                    const tripId =
                        index + 1;


                    div.innerHTML += `
                        <div style="
                            margin:5px 0;
                            white-space:nowrap;
                        ">

                            <span style="
                                display:inline-block;
                                width:22px;
                                height:5px;
                                background:${color};
                                margin-right:6px;
                                vertical-align:middle;
                            "></span>

                            ${tripRoutes[tripId]}

                        </div>
                    `;
                }
            );


            return div;
        };


    legend.addTo(map);
}


// ==========================================
// 20. DEBUG
// ==========================================

console.log(
    "RoadTrack script berhasil dijalankan."
);


// ==========================================
// 21. SELECT DAY
// ==========================================

// Mapping hari ke trip
const dayTrips = {

    1: [1, 2, 3],

    2: [4],

    3: [5],

    4: [6],

    5: [7],

    6: [8],

    7: [9]
};


// Ambil kedua filter
const routeFilterElement =
    document.getElementById(
        "trip-filter"
    );

const dayFilterElement =
    document.getElementById(
        "day-filter"
    );


// ==========================================
// 22. FILTER STATE
// ==========================================

// Menandai filter mana yang sedang digunakan
let activeFilter = "none";


// ==========================================
// 23. FILTER LOCK
// ==========================================

function updateFilterLock() {

    if (
        !routeFilterElement ||
        !dayFilterElement
    ) {
        return;
    }


    // ======================================
    // ROUTE AKTIF
    // ======================================

    if (
        activeFilter === "route"
    ) {

        routeFilterElement.disabled =
            false;

        dayFilterElement.disabled =
            true;

        return;
    }


    // ======================================
    // DAY AKTIF
    // ======================================

    if (
        activeFilter === "day"
    ) {

        routeFilterElement.disabled =
            true;

        dayFilterElement.disabled =
            false;

        return;
    }


    // ======================================
    // TIDAK ADA FILTER AKTIF
    // ======================================

    routeFilterElement.disabled =
        false;

    dayFilterElement.disabled =
        false;
}


// ==========================================
// 24. SELECT ROUTE
// ==========================================

if (routeFilterElement) {

    routeFilterElement.addEventListener(
        "change",
        function() {

            const value =
                this.value;


            // ==================================
            // SEMUA PERJALANAN
            // ==================================

            if (
                value === "all"
            ) {

                activeFilter =
                    "none";


                if (dayFilterElement) {

                    dayFilterElement.value =
                        "all";
                }


                resetRoutes();

                updateSummary(
                    allFeatures
                );


                if (
                    allFeatures.length > 0
                ) {

                    updateTripInfo(
                        allFeatures[0].properties
                    );
                }


                updateFilterLock();

                return;
            }


            // ==================================
            // ROUTE TERTENTU
            // ==================================

            activeFilter =
                "route";


            // Pastikan Select Day kembali ALL
            if (dayFilterElement) {

                dayFilterElement.value =
                    "all";
            }


            const selectedFeature =
                allFeatures.find(
                    function(feature) {

                        return (
                            getTripId(
                                feature.properties
                            ) ===
                            Number(value)
                        );
                    }
                );


            if (
                selectedFeature
            ) {

                updateTripInfo(
                    selectedFeature.properties
                );


                updateSummary([
                    selectedFeature
                ]);


                highlightTrip(
                    Number(value)
                );
            }


            updateFilterLock();
        }
    );
}


// ==========================================
// 25. SELECT DAY
// ==========================================

if (dayFilterElement) {

    dayFilterElement.addEventListener(
        "change",
        function() {

            const selectedDay =
                this.value;


            // ==================================
            // SEMUA HARI
            // ==================================

            if (
                selectedDay === "all"
            ) {

                activeFilter =
                    "none";


                if (routeFilterElement) {

                    routeFilterElement.value =
                        "all";
                }


                resetRoutes();

                updateSummary(
                    allFeatures
                );


                if (
                    allFeatures.length > 0
                ) {

                    updateTripInfo(
                        allFeatures[0].properties
                    );
                }


                updateFilterLock();

                return;
            }


            // ==================================
            // HARI TERTENTU
            // ==================================

            activeFilter =
                "day";


            // Pastikan Select Route kembali ALL
            if (routeFilterElement) {

                routeFilterElement.value =
                    "all";
            }


            // Ambil trip berdasarkan hari
            const selectedTrips =
                dayTrips[
                    Number(selectedDay)
                ] || [];


            // Ambil feature berdasarkan hari
            const selectedFeatures =
                allFeatures.filter(
                    function(feature) {

                        return selectedTrips.includes(
                            getTripId(
                                feature.properties
                            )
                        );
                    }
                );


            // ==================================
            // UPDATE SUMMARY
            // ==================================

            updateSummary(
                selectedFeatures
            );


            // ==================================
            // HIGHLIGHT ROUTE
            // ==================================

            if (routeLayer) {

                routeLayer.eachLayer(
                    function(layer) {

                        if (!layer.feature) {
                            return;
                        }


                        const tripId =
                            getTripId(
                                layer.feature.properties
                            );


                        if (
                            selectedTrips.includes(
                                tripId
                            )
                        ) {

                            layer.setStyle({

                                weight: 8,

                                opacity: 1
                            });


                            // ==================================
                            // EDITAN:
                            // ROUTE PADA HARI TERPILIH AKTIF
                            // ==================================

                            setRouteInteraction(
                                layer,
                                true
                            );


                            layer.bringToFront();

                        } else {

                            layer.setStyle({

                                weight: 4,

                                opacity: 0.15
                            });


                            // ==================================
                            // EDITAN:
                            // ROUTE HARI LAIN NONAKTIF
                            // ==================================

                            setRouteInteraction(
                                layer,
                                false
                            );
                        }
                    }
                );


                // ==================================
                // ZOOM KE RUTE HARI TERPILIH
                // ==================================

                const selectedLayers =
                    routeLayer
                        .getLayers()
                        .filter(
                            function(layer) {

                                if (!layer.feature) {
                                    return false;
                                }


                                return selectedTrips.includes(
                                    getTripId(
                                        layer.feature.properties
                                    )
                                );
                            }
                        );


                if (
                    selectedLayers.length > 0
                ) {

                    const dayGroup =
                        L.featureGroup(
                            selectedLayers
                        );


                    const bounds =
                        dayGroup.getBounds();


                    if (
                        bounds.isValid()
                    ) {

                        map.fitBounds(
                            bounds,
                            {
                                padding: [
                                    40,
                                    40
                                ]
                            }
                        );
                    }
                }
            }


            // ==================================
            // DETAIL TRIP PERTAMA
            // ==================================

            if (
                selectedFeatures.length > 0
            ) {

                updateTripInfo(
                    selectedFeatures[0].properties
                );
            }


            // ==================================
            // LOCK FILTER
            // ==================================

            updateFilterLock();
        }
    );
}


// ==========================================
// 26. KLIK ROUTE PADA PETA
// ==========================================

// Kalau user klik garis route,
// Select Route menjadi filter aktif.

map.on(
    "popupopen",
    function(e) {

        if (
            routeFilterElement &&
            routeFilterElement.value !== "all"
        ) {

            activeFilter =
                "route";
        }


        updateFilterLock();


        // ======================================
        // EDITAN TAMBAHAN:
        // PASTIKAN POPUP FULL DI DALAM MAP
        // ======================================

        setTimeout(function() {

            const popup =
                e.popup;

            const popupElement =
                popup.getElement();

            const mapElement =
                map.getContainer();


            if (
                !popupElement ||
                !mapElement
            ) {
                return;
            }


            const popupRect =
                popupElement.getBoundingClientRect();

            const mapRect =
                mapElement.getBoundingClientRect();


            // Jarak aman dari tepi map
            const padding = 15;


            let moveX = 0;
            let moveY = 0;


            // ==================================
            // CEK SISI KIRI
            // ==================================

            if (
                popupRect.left <
                mapRect.left + padding
            ) {

                moveX =
                    mapRect.left +
                    padding -
                    popupRect.left;
            }


            // ==================================
            // CEK SISI KANAN
            // ==================================

            if (
                popupRect.right >
                mapRect.right - padding
            ) {

                moveX =
                    mapRect.right -
                    padding -
                    popupRect.right;
            }


            // ==================================
            // CEK SISI ATAS
            // ==================================

            if (
                popupRect.top <
                mapRect.top + padding
            ) {

                moveY =
                    mapRect.top +
                    padding -
                    popupRect.top;
            }


            // ==================================
            // CEK SISI BAWAH
            // ==================================

            if (
                popupRect.bottom >
                mapRect.bottom - padding
            ) {

                moveY =
                    mapRect.bottom -
                    padding -
                    popupRect.bottom;
            }


            // ==================================
            // GESER MAP
            // ==================================

            if (
                moveX !== 0 ||
                moveY !== 0
            ) {

                map.panBy(
                    [
                        moveX,
                        moveY
                    ],
                    {
                        animate: true,
                        duration: 0.35
                    }
                );
            }

        }, 100);
    }
);


// ==========================================
// 27. STATUS FILTER AWAL
// ==========================================

updateFilterLock();