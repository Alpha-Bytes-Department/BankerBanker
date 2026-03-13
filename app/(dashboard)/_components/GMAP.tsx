'use client'
import { memo, useMemo, useState, useRef, useCallback } from 'react';
import { GoogleMap, LoadScript, OverlayView, Autocomplete } from '@react-google-maps/api';

const LIBRARIES: ("places" | "geometry" | "drawing")[] = ['places', 'geometry', 'drawing'];

type Marker = {
    id: number | string;
    position: { lat: number; lng: number };
    title: string;
    color: string;
    icon?: string;
};

type GMAPProps = {
    markersList: Marker[];
    // Callback to send coordinates to the parent/backend
    onLocationSelect?: (coords: { lat: number; lng: number }) => void;
}

const GMAP = ({ markersList, onLocationSelect }: GMAPProps) => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    const [map, setMap] = useState<google.maps.Map | null>(null);
    const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

    // State to show a "temporary" pin when the user clicks
    const [tempMarker, setTempMarker] = useState<google.maps.LatLngLiteral | null>(null);

    const [center, setCenter] = useState<google.maps.LatLngLiteral>({
        lat: 23.8103, // Default to Dhaka or your preferred start
        lng: 90.4125
    });

    const mapOptions = useMemo<google.maps.MapOptions>(() => ({
        streetViewControl: false,
        mapTypeControl: false,
        fullscreenControl: false,
        rotateControl: false,
        zoomControl: false,
        gestureHandling: 'greedy'
    }), []);

    const onMapClick = useCallback((e: google.maps.MapMouseEvent) => {
        if (e.latLng) {
            const lat = e.latLng.lat();
            const lng = e.latLng.lng();
            const coords = { lat, lng };

            setTempMarker(coords); // Show visual feedback

            if (onLocationSelect) {
                onLocationSelect(coords); // Send to backend/parent
            }
        }
    }, [onLocationSelect]);

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
            }
        }
    };

    return (
        <div>
            <LoadScript googleMapsApiKey={apiKey || ""} libraries={LIBRARIES}>
                <div className="my-5 w-full max-w-md">
                    <Autocomplete
                        onLoad={(auto) => (autocompleteRef.current = auto)}
                        onPlaceChanged={onPlaceChanged}
                    >
                        <input
                            type="text"
                            placeholder="Search and pin a palace..."
                            className="w-full h-12 px-4 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-black shadow-sm"
                        />
                    </Autocomplete>
                </div>

                <div className="relative w-full">
                    <GoogleMap
                        mapContainerStyle={{ width: "100%" }}
                        mapContainerClassName='h-[400px] xl:h-[600px] rounded-xl shadow-inner'
                        center={center}
                        zoom={12}
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