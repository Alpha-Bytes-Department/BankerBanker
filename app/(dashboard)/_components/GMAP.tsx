'use client'
import { memo, useMemo, useState, useRef, useCallback } from 'react';
import { GoogleMap, LoadScript, OverlayView, Autocomplete } from '@react-google-maps/api';
import type { PlaceData } from "@/app/(dashboard)/(sponsor)/processing/_components/place-types";

const LIBRARIES: ("places" | "geometry" | "drawing")[] = ['places', 'geometry', 'drawing'];
type MapViewMode = "roadmap" | "satellite";

type Marker = {
    id: number | string;
    position: { lat: number; lng: number };
    title: string;
    color: string;
    icon?: string;
};

type GMAPProps = {
    markersList?: Marker[];
    // Callback to send coordinates to the parent/backend
    onLocationSelect?: (coords: { lat: number; lng: number }) => void;
    onPlaceSelect?: (place: PlaceData) => void;
}

const GMAP = ({ markersList, onLocationSelect, onPlaceSelect }: GMAPProps) => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    const [map, setMap] = useState<google.maps.Map | null>(null);
    const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

    // State to show a "temporary" pin when the user clicks
    const [tempMarker, setTempMarker] = useState<google.maps.LatLngLiteral | null>(null);
    const [mapViewMode, setMapViewMode] = useState<MapViewMode>("satellite");

    const [center, setCenter] = useState<google.maps.LatLngLiteral>({
        lat: 40.7128, // Default to New York
        lng: -74.0060
    });

    const mapOptions = useMemo<google.maps.MapOptions>(() => ({
        streetViewControl: false,
        mapTypeControl: false,
        fullscreenControl: false,
        rotateControl: false,
        zoomControl: false,
        gestureHandling: 'greedy'
    }), []);

    const extractLocationData = useCallback((place: google.maps.places.PlaceResult): PlaceData | null => {
        const location = place.geometry?.location;

        if (!location) {
            return null;
        }

        return {
            place_id: place.place_id || "",
            name: place.name || "",
            address: place.formatted_address || place.vicinity || "",
            lat: location.lat(),
            lng: location.lng(),
            types: place.types || [],
            rating: place.rating ?? null,
            photos: place.photos?.slice(0, 3).map((photo) => photo.getUrl({ maxWidth: 1200, maxHeight: 1200 })) || []
        };
    }, []);

    const handlePlaceData = useCallback((label: string, place: google.maps.places.PlaceResult) => {
        const extractedLocation = extractLocationData(place);

        if (extractedLocation) {
            console.log(label, extractedLocation);
            onPlaceSelect?.(extractedLocation);
        }
    }, [extractLocationData, onPlaceSelect]);

    const fetchPinnedPlaceDetails = useCallback((coords: google.maps.LatLngLiteral) => {
        if (!map || !window.google?.maps) {
            return;
        }

        const geocoder = new window.google.maps.Geocoder();

        geocoder.geocode({ location: coords }, (results, status) => {
            const firstResult = results?.[0];

            if (status !== "OK" || !firstResult?.place_id) {
                console.log("Pinned location data", {
                    place_id: "",
                    name: "",
                    address: "",
                    lat: coords.lat,
                    lng: coords.lng,
                    types: [],
                    rating: null,
                    photos: []
                });
                onPlaceSelect?.({
                    place_id: "",
                    name: "",
                    address: "",
                    lat: coords.lat,
                    lng: coords.lng,
                    types: [],
                    rating: null,
                    photos: []
                });
                return;
            }

            const placesService = new window.google.maps.places.PlacesService(map);

            placesService.getDetails(
                {
                    placeId: firstResult.place_id,
                    fields: ["place_id", "name", "formatted_address", "geometry", "types", "rating", "photos"]
                },
                (place, detailsStatus) => {
                    if (detailsStatus === window.google.maps.places.PlacesServiceStatus.OK && place) {
                        handlePlaceData("Pinned location data", place);
                        return;
                    }

                    const fallbackPlace = {
                        place_id: firstResult.place_id,
                        name: firstResult.formatted_address || "",
                        address: firstResult.formatted_address || "",
                        lat: coords.lat,
                        lng: coords.lng,
                        types: firstResult.types || [],
                        rating: null,
                        photos: []
                    };

                    console.log("Pinned location data", fallbackPlace);
                    onPlaceSelect?.(fallbackPlace);
                }
            );
        });
    }, [handlePlaceData, map, onPlaceSelect]);

    const onMapClick = useCallback((e: google.maps.MapMouseEvent) => {
        if (e.latLng) {
            const lat = e.latLng.lat();
            const lng = e.latLng.lng();
            const coords = { lat, lng };

            setTempMarker(coords); // Show visual feedback
            fetchPinnedPlaceDetails(coords);

            if (onLocationSelect) {
                onLocationSelect(coords); // Send to backend/parent
            }
        }
    }, [fetchPinnedPlaceDetails, onLocationSelect]);

    const onPlaceChanged = () => {
        if (autocompleteRef.current) {
            const place = autocompleteRef.current.getPlace();
            const location = place.geometry?.location;

            if (location) {
                const newPos = { lat: location.lat(), lng: location.lng() };
                setCenter(newPos);
                setTempMarker(newPos); // Pin the searched location too
                map?.panTo(newPos);
                map?.setZoom(17);

                if (onLocationSelect) onLocationSelect(newPos);

                handlePlaceData("Searched location data", place);
            }
        }
    };

    return (
        <div>
            <LoadScript googleMapsApiKey={apiKey || ""} libraries={LIBRARIES}>
                <div className="my-5 w-full max-w-md">
                    <Autocomplete
                        onLoad={(auto) => {
                            auto.setFields(["place_id", "name", "formatted_address", "geometry", "types", "rating", "photos"]);
                            autocompleteRef.current = auto;
                        }}
                        onPlaceChanged={onPlaceChanged}
                    >
                        <input
                            type="text"
                            placeholder="Search and pin a place..."
                            className="w-full h-12 px-4 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-black shadow-sm"
                        />
                    </Autocomplete>
                </div>

                <div className="relative w-full">
                    <div className="absolute right-3 top-3 z-10 flex overflow-hidden rounded-lg border border-white/70 bg-white shadow-sm">
                        {[
                            { label: "2D Map", value: "roadmap" as const },
                            { label: "Satellite", value: "satellite" as const },
                        ].map((option) => (
                            <button
                                key={option.value}
                                type="button"
                                onClick={() => setMapViewMode(option.value)}
                                className={`px-3 py-2 text-xs font-semibold transition-colors ${
                                    mapViewMode === option.value
                                        ? "bg-primary text-white"
                                        : "bg-white text-gray-700 hover:bg-gray-50"
                                }`}
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>
                    <GoogleMap
                        mapContainerStyle={{ width: "100%" }}
                        mapContainerClassName='h-[400px] xl:h-[600px] rounded-xl shadow-inner'
                        center={center}
                        zoom={12}
                        mapTypeId={mapViewMode}
                        options={mapOptions}
                        onLoad={(inst) => setMap(inst)}
                        onClick={onMapClick} // <--- This captures the pin action
                    >
                        {/* Render existing markers from backend */}
                        {markersList?.map((marker) => (
                            <OverlayView
                                key={marker.id}
                                position={marker.position}
                                mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                            >
                                <div style={{ backgroundColor: marker.color, width: '40px', height: '40px', borderRadius: '50%', border: '2px solid white', transform: 'translate(-50%, -50%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                                </div>
                            </OverlayView>
                        ))}

                        {/* Render the NEW temporary pin */}
                        {tempMarker && (
                            <OverlayView
                                position={tempMarker}
                                mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                            >
                                <div style={{
                                    position: 'relative',
                                    width: '30px',
                                    height: '30px',
                                    backgroundColor: '#EF4444',
                                    borderRadius: '50% 50% 50% 0',
                                    transform: 'translate(-50%, -100%) rotate(-45deg)', // Position point at coordinates
                                    boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
                                    border: '2px solid white',
                                }}>
                                    {/* Optional inner circle to make it look even more like a pin */}
                                    <div style={{
                                        position: 'absolute',
                                        width: '12px',
                                        height: '12px',
                                        backgroundColor: 'white',
                                        borderRadius: '50%',
                                        top: '50%',
                                        left: '50%',
                                        transform: 'translate(-50%, -50%)',
                                    }} />
                                </div>
                            </OverlayView>
                        )}
                    </GoogleMap>
                </div>
            </LoadScript>
        </div>
    );
};

export default memo(GMAP);
