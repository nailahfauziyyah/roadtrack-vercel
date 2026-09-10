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
// START / END MARKER
// ==========================================

let startEndLayer =
    L.layerGroup().addTo(map);


// ==========================================
// 6. FORMAT ANGKA
// ==========================================

function formatNumber(
    value,
    decimals = 2
) {

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

    const tripId =
        getTripId(properties);

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

        return Number(
            properties.fuel_liter
        );
    }

    if (
        properties.liter_total !== undefined &&
        properties.liter_total !== null
    ) {

        return Number(
            properties.liter_total
        );
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

        return Number(
            properties.cost_rp
        );
    }

    if (
        properties.biaya_rp !== undefined &&
        properties.biaya_rp !== null
    ) {

        return Number(
            properties.biaya_rp
        );
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

        return Number(
            properties.max_speed
        );
    }

    if (
        properties.kecepatan_maks !== undefined &&
        properties.kecepatan_maks !== null &&
        properties.kecepatan_maks !== ""
    ) {

        return Number(
            properties.kecepatan_maks
        );
    }

    const tripMaxSpeed = {

        1: 41.6,
        2: 58.9,
        3: 36.2

    };

    const tripId =
        getTripId(properties);

    if (
        tripMaxSpeed[tripId] !== undefined
    ) {

        return tripMaxSpeed[tripId];
    }

    return null;
}


// ==========================================
// 13. UPDATE DETAIL TRIP
// ==========================================

function updateTripInfo(properties) {

    const tripId =
        getTripId(properties);

    const fuel =
        getFuel(properties);

    const cost =
        getCost(properties);

    const maxSpeed =
        getMaxSpeed(properties);


    const elements = {

        number:
            document.getElementById(
                "trip-number"
            ),

        name:
            document.getElementById(
                "trip-name"
            ),

        route:
            document.getElementById(
                "trip-route"
            ),

        distance:
            document.getElementById(
                "trip-distance"
            ),

        duration:
            document.getElementById(
                "trip-duration"
            ),

        speed:
            document.getElementById(
                "trip-speed"
            ),

        fuel:
            document.getElementById(
                "trip-fuel"
            ),

        date:
            document.getElementById(
                "trip-date"
            ),

        maxSpeed:
            document.getElementById(
                "trip-max-speed"
            ),

        cost:
            document.getElementById(
                "trip-cost"
            )
    };


    if (elements.number) {

        elements.number.textContent =
            tripId || "—";
    }


    if (elements.name) {

        elements.name.textContent =
            properties.nama ||
            `Trip ${tripId}`;
    }


    if (elements.route) {

        elements.route.textContent =
            getTrayek(properties);
    }


    if (elements.distance) {

        elements.distance.textContent =
            formatNumber(
                properties.jarak_km,
                2
            ) + " km";
    }


    if (elements.duration) {

        elements.duration.textContent =
            formatNumber(
                properties.durasi_menit,
                1
            ) + " menit";
    }


    if (elements.speed) {

        elements.speed.textContent =
            formatNumber(
                properties.kecepatan_rata,
                1
            ) + " km/jam";
    }


    if (elements.fuel) {

        if (fuel !== null) {

            elements.fuel.textContent =
                formatNumber(
                    fuel,
                    2
                ) + " L";

        } else {

            elements.fuel.textContent =
                "-";
        }
    }


    if (elements.date) {

        elements.date.textContent =
            properties.tanggal || "-";
    }


    if (elements.maxSpeed) {

        if (maxSpeed !== null) {

            elements.maxSpeed.textContent =
                formatNumber(
                    maxSpeed,
                    1
                ) + " km/jam";

        } else {

            elements.maxSpeed.textContent =
                "-";
        }
    }


    if (elements.cost) {

        if (cost !== null) {

            elements.cost.textContent =
                formatRupiah(cost);

        } else {

            elements.cost.textContent =
                "-";
        }
    }
}


// ==========================================
// 14. UPDATE SUMMARY
// ==========================================

function updateSummary(features) {

    let totalDistance = 0;
    let totalDuration = 0;
    let totalFuel = 0;
    let totalCost = 0;


    features.forEach(
        function(feature) {

            const p =
                feature.properties;

            totalDistance +=
                Number(p.jarak_km) || 0;

            totalDuration +=
                Number(p.durasi_menit) || 0;

            totalFuel +=
                Number(getFuel(p)) || 0;

            totalCost +=
                Number(getCost(p)) || 0;
        }
    );


    const totalTrip =
        document.getElementById(
            "total-trip"
        );

    const totalDistanceElement =
        document.getElementById(
            "total-distance"
        );

    const totalEstimationElement =
        document.getElementById(
            "total-estimation"
        );

    const totalFuelElement =
        document.getElementById(
            "total-fuel"
        );

    const totalCostElement =
        document.getElementById(
            "total-cost"
        );


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
            ? formatNumber(
                maxSpeed,
                1
            ) + " km/jam"
            : "-";


    const fuelText =
        fuel !== null
            ? formatNumber(
                fuel,
                2
            ) + " liter"
            : "-";


    const costText =
        cost !== null
            ? formatRupiah(cost)
            : "-";


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
// 16. START / END ICON
// ==========================================

const startIcon = L.divIcon({

    className:
        "start-marker",

    html: `
        <div style="
            width:14px;
            height:14px;
            background:#22c55e;
            border:3px solid white;
            border-radius:50%;
            box-shadow:0 2px 6px rgba(0,0,0,0.3);
        "></div>
    `,

    iconSize: [
        20,
        20
    ],

    iconAnchor: [
        10,
        10
    ]
});


const endIcon = L.divIcon({

    className:
        "end-marker",

    html: `
        <div style="
            width:14px;
            height:14px;
            background:#ef4444;
            border:3px solid white;
            border-radius:50%;
            box-shadow:0 2px 6px rgba(0,0,0,0.3);
        "></div>
    `,

    iconSize: [
        20,
        20
    ],

    iconAnchor: [
        10,
        10
    ]
});


// ==========================================
// 17. BUAT START / END MARKER
// ==========================================

function createStartEndMarkers(features) {

    startEndLayer.clearLayers();


    features.forEach(
        function(feature) {

            const tripId =
                getTripId(
                    feature.properties
                );

            const coordinates =
                feature.geometry.coordinates;


            if (
                !coordinates ||
                coordinates.length === 0
            ) {
                return;
            }


            const startCoord =
                coordinates[0];

            const endCoord =
                coordinates[
                    coordinates.length - 1
                ];


            const startLatLng = [
                startCoord[1],
                startCoord[0]
            ];

            const endLatLng = [
                endCoord[1],
                endCoord[0]
            ];


            const startMarker =
                L.marker(
                    startLatLng,
                    {
                        icon: startIcon,
                        zIndexOffset: 1000
                    }
                );


            startMarker.bindTooltip(
                `START — Trip ${tripId}`,
                {
                    direction: "top",
                    offset: [
                        0,
                        -8
                    ]
                }
            );


            startMarker.bindPopup(`
                <b>START</b><br>
                Trip ${tripId}<br>
                ${getTrayek(
                    feature.properties
                )}
            `);


            startMarker.tripId =
                tripId;


            startEndLayer.addLayer(
                startMarker
            );


            const endMarker =
                L.marker(
                    endLatLng,
                    {
                        icon: endIcon,
                        zIndexOffset: 1000
                    }
                );


            endMarker.bindTooltip(
                `END — Trip ${tripId}`,
                {
                    direction: "top",
                    offset: [
                        0,
                        -8
                    ]
                }
            );


            endMarker.bindPopup(`
                <b>END</b><br>
                Trip ${tripId}<br>
                ${getTrayek(
                    feature.properties
                )}
            `);


            endMarker.tripId =
                tripId;


            startEndLayer.addLayer(
                endMarker
            );
        }
    );
}


// ==========================================
// 18. UPDATE START / END MARKER
// ==========================================

function updateStartEndMarkers(
    filter
) {

    if (!startEndLayer) {
        return;
    }


    startEndLayer.eachLayer(
        function(marker) {

            if (
                filter === "all"
            ) {

                marker.setOpacity(
                    1
                );

            } else if (
                Array.isArray(filter)
            ) {

                if (
                    filter.includes(
                        marker.tripId
                    )
                ) {

                    marker.setOpacity(
                        1
                    );

                } else {

                    marker.setOpacity(
                        0
                    );
                }

            } else {

                if (
                    marker.tripId ===
                    Number(filter)
                ) {

                    marker.setOpacity(
                        1
                    );

                } else {

                    marker.setOpacity(
                        0
                    );
                }
            }
        }
    );
}


// ==========================================
// 19. LOAD GEOJSON
// ==========================================

fetch(
    "data/rute_final.geojson"
)

    .then(
        function(response) {

            if (!response.ok) {

                throw new Error(
                    "rute_final.geojson tidak ditemukan"
                );
            }

            return response.json();
        }
    )


    .then(
        function(data) {

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


            // ==============================
            // SUMMARY AWAL
            // ==============================

            updateSummary(
                allFeatures
            );


            // ==============================
            // FUEL RECEIPT AWAL
            // ==============================

            updateFuelReceipt(
                allFeatures,
                "Semua Perjalanan"
            );


            // ==============================
            // FILTER
            // ==============================

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


            // ==============================
            // ROUTE LAYER
            // ==============================

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
                                        ] ||
                                        "#e41a1c",

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


                                        if (
                                            selected !== "all" &&
                                            Number(selected) !==
                                            getTripId(p)
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

                                        updateTripInfo(
                                            p
                                        );


                                        if (
                                            tripFilter
                                        ) {

                                            tripFilter.value =
                                                getTripId(p);
                                        }


                                        updateSummary([
                                            feature
                                        ]);


                                        updateFuelReceipt(
                                            [feature],
                                            `Trip ${getTripId(p)}`
                                        );


                                        highlightTrip(
                                            getTripId(p)
                                        );
                                    }
                                );
                            }
                    }
                ).addTo(map);


            // ==============================
            // START / END MARKER
            // ==============================

            createStartEndMarkers(
                allFeatures
            );


            updateStartEndMarkers(
                "all"
            );


            // ==============================
            // ZOOM SEMUA RUTE
            // ==============================

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


            // ==============================
            // LEGEND
            // ==============================

            createLegend();


            // ==============================
            // FILTER EVENT
            // ==============================

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


                            updateFuelReceipt(
                                allFeatures,
                                "Semua Perjalanan"
                            );


                            updateStartEndMarkers(
                                "all"
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


                            updateFuelReceipt(
                                [selectedFeature],
                                `Trip ${value}`
                            );


                            updateStartEndMarkers(
                                Number(value)
                            );


                            highlightTrip(
                                Number(value)
                            );
                        }
                    }
                );
            }


            // ==============================
            // DEFAULT TRIP
            // ==============================

            if (
                allFeatures.length > 0
            ) {

                updateTripInfo(
                    allFeatures[0].properties
                );
            }

        }
    )


    .catch(
        function(error) {

            console.error(
                "ERROR:",
                error
            );


            alert(
                "Gagal memuat data rute. " +
                "Pastikan server dijalankan dari folder roadtrack."
            );
        }
    );


// ==========================================
// 20. HIGHLIGHT TRIP
// ==========================================

function highlightTrip(
    tripId
) {

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


                setRouteInteraction(
                    layer,
                    false
                );
            }
        }
    );


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
                        ) ===
                        Number(tripId)
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


    updateStartEndMarkers(
        Number(tripId)
    );
}


// ==========================================
// 21. AKTIF / NONAKTIFKAN INTERAKSI ROUTE
// ==========================================

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
// 22. RESET ROUTES
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


            setRouteInteraction(
                layer,
                true
            );
        }
    );


    updateStartEndMarkers(
        "all"
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
// 23. LEGEND
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
// 24. DEBUG
// ==========================================

console.log(
    "RoadTrack script berhasil dijalankan."
);


// ==========================================
// 25. SELECT DAY
// ==========================================

const dayTrips = {

    1: [1, 2, 3],

    2: [4],

    3: [5],

    4: [6],

    5: [7],

    6: [8],

    7: [9]
};


const routeFilterElement =
    document.getElementById(
        "trip-filter"
    );


const dayFilterElement =
    document.getElementById(
        "day-filter"
    );


// ==========================================
// 26. FILTER STATE
// ==========================================

let activeFilter =
    "none";


// ==========================================
// 27. FILTER LOCK
// ==========================================

function updateFilterLock() {

    if (
        !routeFilterElement ||
        !dayFilterElement
    ) {
        return;
    }


    if (
        activeFilter === "route"
    ) {

        routeFilterElement.disabled =
            false;

        dayFilterElement.disabled =
            true;

        return;
    }


    if (
        activeFilter === "day"
    ) {

        routeFilterElement.disabled =
            true;

        dayFilterElement.disabled =
            false;

        return;
    }


    routeFilterElement.disabled =
        false;

    dayFilterElement.disabled =
        false;
}


// ==========================================
// 28. SELECT ROUTE
// ==========================================

if (routeFilterElement) {

    routeFilterElement.addEventListener(
        "change",
        function() {

            const value =
                this.value;


            // SEMUA PERJALANAN
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


                updateFuelReceipt(
                    allFeatures,
                    "Semua Perjalanan"
                );


                updateStartEndMarkers(
                    "all"
                );


                if (
                    allFeatures.length > 0
                ) {

                    updateTripInfo(
                        allFeatures[0]
                            .properties
                    );
                }


                updateFilterLock();

                return;
            }


            // ROUTE TERTENTU
            activeFilter =
                "route";


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


                updateFuelReceipt(
                    [selectedFeature],
                    `Trip ${value}`
                );


                updateStartEndMarkers(
                    Number(value)
                );


                highlightTrip(
                    Number(value)
                );
            }


            updateFilterLock();
        }
    );
}


// ==========================================
// 29. SELECT DAY
// ==========================================

if (dayFilterElement) {

    dayFilterElement.addEventListener(
        "change",
        function() {

            const selectedDay =
                this.value;


            // SEMUA HARI
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


                updateFuelReceipt(
                    allFeatures,
                    "Semua Perjalanan"
                );


                updateStartEndMarkers(
                    "all"
                );


                if (
                    allFeatures.length > 0
                ) {

                    updateTripInfo(
                        allFeatures[0]
                            .properties
                    );
                }


                updateFilterLock();

                return;
            }


            // HARI TERTENTU
            activeFilter =
                "day";


            if (routeFilterElement) {

                routeFilterElement.value =
                    "all";
            }


            const selectedTrips =
                dayTrips[
                    Number(selectedDay)
                ] || [];


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


            // UPDATE SUMMARY
            updateSummary(
                selectedFeatures
            );


            // UPDATE FUEL RECEIPT
            updateFuelReceipt(
                selectedFeatures,
                `Hari ${selectedDay}`
            );


            // UPDATE START / END
            updateStartEndMarkers(
                selectedTrips
            );


            // HIGHLIGHT ROUTE
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


                            setRouteInteraction(
                                layer,
                                false
                            );
                        }
                    }
                );


                // ZOOM KE RUTE HARI TERPILIH
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


            // DETAIL TRIP PERTAMA
            if (
                selectedFeatures.length > 0
            ) {

                updateTripInfo(
                    selectedFeatures[0]
                        .properties
                );
            }


            updateFilterLock();
        }
    );
}


// ==========================================
// 30. FUEL RECEIPT
// ==========================================

const FUEL_PRICE =
    10000;


function updateFuelReceipt(
    features,
    filterLabel =
        "Semua Perjalanan"
) {

    const receiptRoute =
        document.getElementById(
            "receiptRoute"
        );


    const receiptDistance =
        document.getElementById(
            "receiptDistance"
        );


    const receiptFuel =
        document.getElementById(
            "receiptFuel"
        );


    const receiptPrice =
        document.getElementById(
            "receiptPrice"
        );


    const receiptCost =
        document.getElementById(
            "receiptCost"
        );


    if (
        !features ||
        features.length === 0
    ) {

        if (receiptRoute) {

            receiptRoute.textContent =
                "-";
        }


        if (receiptDistance) {

            receiptDistance.textContent =
                "-";
        }


        if (receiptFuel) {

            receiptFuel.textContent =
                "-";
        }


        if (receiptPrice) {

            receiptPrice.textContent =
                formatRupiah(
                    FUEL_PRICE
                ) +
                " / L";
        }


        if (receiptCost) {

            receiptCost.textContent =
                "-";
        }


        return;
    }


    let totalDistance = 0;
    let totalFuel = 0;
    let totalCost = 0;


    features.forEach(
        function(feature) {

            const p =
                feature.properties;


            totalDistance +=
                Number(
                    p.jarak_km
                ) || 0;


            totalFuel +=
                Number(
                    getFuel(p)
                ) || 0;


            totalCost +=
                Number(
                    getCost(p)
                ) || 0;
        }
    );


    let routeText =
        filterLabel;


    if (
        features.length === 1
    ) {

        routeText =
            getTrayek(
                features[0].properties
            );
    }


    if (receiptRoute) {

        receiptRoute.textContent =
            routeText;
    }


    if (receiptDistance) {

        receiptDistance.textContent =
            formatNumber(
                totalDistance,
                2
            ) +
            " km";
    }


    if (receiptFuel) {

        receiptFuel.textContent =
            formatNumber(
                totalFuel,
                2
            ) +
            " L";
    }


    if (receiptPrice) {

        receiptPrice.textContent =
            formatRupiah(
                FUEL_PRICE
            ) +
            " / L";
    }


    if (receiptCost) {

        receiptCost.textContent =
            formatRupiah(
                totalCost
            );
    }
}


// ==========================================
// 31. PRINT FUEL RECEIPT
// ==========================================

function printFuelReceipt() {

    const route =
        document.getElementById(
            "receiptRoute"
        )?.textContent || "-";


    const distance =
        document.getElementById(
            "receiptDistance"
        )?.textContent || "-";


    const fuel =
        document.getElementById(
            "receiptFuel"
        )?.textContent || "-";


    const price =
        document.getElementById(
            "receiptPrice"
        )?.textContent || "-";


    const cost =
        document.getElementById(
            "receiptCost"
        )?.textContent || "-";


    const printWindow =
        window.open(
            "",
            "_blank",
            "width=450,height=700"
        );


    if (!printWindow) {

        alert(
            "Pop-up diblokir browser. Izinkan pop-up untuk mencetak receipt."
        );

        return;
    }


    printWindow.document.write(`

        <!DOCTYPE html>

        <html lang="en">

        <head>

            <meta charset="UTF-8">

            <title>
                RoadTrack Fuel Receipt
            </title>


            <style>

                * {
                    box-sizing: border-box;
                }


                body {

                    margin: 0;

                    padding: 30px 15px;

                    background: #f5f5f5;

                    font-family:
                        Arial,
                        Helvetica,
                        sans-serif;

                    color: #333;
                }


                .receipt {

                    width: 80mm;

                    max-width: 100%;

                    margin: 0 auto;

                    padding: 25px 20px;

                    background: white;

                    box-shadow:
                        0 5px 20px
                        rgba(0, 0, 0, 0.12);
                }


                .receipt-header {

                    text-align: center;

                    padding-bottom: 15px;

                    border-bottom:
                        1px dashed #777;
                }


                .brand {

                    font-size: 21px;

                    font-weight: 800;

                    letter-spacing: 1px;

                    color: #444;
                }


                .subtitle {

                    margin-top: 4px;

                    font-size: 10px;

                    color: #777;

                    letter-spacing: 1.5px;

                    text-transform: uppercase;
                }


                .receipt-icon {

                    margin: 12px auto 0;

                    width: 34px;

                    height: 34px;

                    display: flex;

                    align-items: center;

                    justify-content: center;

                    border-radius: 50%;

                    background: #f7e2ea;

                    color: #9b657b;

                    font-size: 16px;
                }


                .receipt-info {

                    padding: 15px 0;

                    border-bottom:
                        1px dashed #777;
                }


                .row {

                    display: flex;

                    justify-content:
                        space-between;

                    align-items:
                        flex-start;

                    gap: 15px;

                    padding: 6px 0;

                    font-size: 11px;

                    line-height: 1.4;
                }


                .label {

                    color: #777;

                    white-space: nowrap;
                }


                .value {

                    color: #222;

                    font-weight: 600;

                    text-align: right;

                    word-break: break-word;
                }


                .total {

                    margin-top: 15px;

                    padding: 13px 0;

                    border-bottom:
                        1px dashed #777;

                    display: flex;

                    justify-content:
                        space-between;

                    align-items:
                        center;

                    gap: 15px;
                }


                .total-label {

                    font-size: 12px;

                    font-weight: 700;

                    color: #444;
                }


                .total-value {

                    font-size: 17px;

                    font-weight: 800;

                    color: #9b657b;

                    text-align: right;
                }


                .footer {

                    padding-top: 17px;

                    text-align: center;

                    color: #777;

                    font-size: 9px;

                    line-height: 1.6;
                }


                .footer strong {

                    display: block;

                    color: #555;

                    font-size: 10px;

                    margin-bottom: 3px;
                }


                .thank-you {

                    margin-top: 12px;

                    font-size: 9px;

                    letter-spacing: 0.5px;
                }


                @media print {

                    body {

                        padding: 0;

                        background: white;
                    }


                    .receipt {

                        width: 80mm;

                        margin: 0;

                        box-shadow: none;
                    }


                    @page {

                        size: 80mm auto;

                        margin: 0;
                    }
                }

            </style>

        </head>


        <body>

            <div class="receipt">

                <div class="receipt-header">

                    <div class="brand">
                        ROADTRACK
                    </div>

                    <div class="subtitle">
                        Fuel Receipt
                    </div>

                    <div class="receipt-icon">
                        🧾
                    </div>

                </div>


                <div class="receipt-info">

                    <div class="row">

                        <span class="label">
                            Route
                        </span>

                        <span class="value">
                            ${route}
                        </span>

                    </div>


                    <div class="row">

                        <span class="label">
                            Distance
                        </span>

                        <span class="value">
                            ${distance}
                        </span>

                    </div>


                    <div class="row">

                        <span class="label">
                            Fuel Used
                        </span>

                        <span class="value">
                            ${fuel}
                        </span>

                    </div>


                    <div class="row">

                        <span class="label">
                            Fuel Price
                        </span>

                        <span class="value">
                            ${price}
                        </span>

                    </div>

                </div>


                <div class="total">

                    <span class="total-label">
                        TOTAL FUEL COST
                    </span>

                    <span class="total-value">
                        ${cost}
                    </span>

                </div>


                <div class="footer">

                    <strong>
                        RoadTrack Vehicle Monitoring
                    </strong>

                    Operational Car Route Monitoring

                    <div class="thank-you">
                        Thank you
                    </div>

                </div>

            </div>


            <script>

                window.onload =
                    function() {

                        setTimeout(
                            function() {

                                window.print();

                            },
                            300
                        );

                    };


                window.onafterprint =
                    function() {

                        window.close();

                    };

            <\/script>

        </body>

        </html>

    `);


    printWindow.document.close();
}


// ==========================================
// 32. KLIK ROUTE PADA PETA
// ==========================================

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


        setTimeout(
            function() {

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
                    popupElement
                        .getBoundingClientRect();


                const mapRect =
                    mapElement
                        .getBoundingClientRect();


                const padding =
                    15;


                let moveX = 0;
                let moveY = 0;


                if (
                    popupRect.left <
                    mapRect.left +
                    padding
                ) {

                    moveX =
                        mapRect.left +
                        padding -
                        popupRect.left;
                }


                if (
                    popupRect.right >
                    mapRect.right -
                    padding
                ) {

                    moveX =
                        mapRect.right -
                        padding -
                        popupRect.right;
                }


                if (
                    popupRect.top <
                    mapRect.top +
                    padding
                ) {

                    moveY =
                        mapRect.top +
                        padding -
                        popupRect.top;
                }


                if (
                    popupRect.bottom >
                    mapRect.bottom -
                    padding
                ) {

                    moveY =
                        mapRect.bottom -
                        padding -
                        popupRect.bottom;
                }


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

            },
            100
        );
    }
);


// ==========================================
// 33. STATUS FILTER AWAL
// ==========================================

updateFilterLock();