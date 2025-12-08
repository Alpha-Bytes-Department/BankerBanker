'use client'
import { APIProvider, Map, Marker } from '@vis.gl/react-google-maps';
import { useState } from 'react';

const GMAP = () => {

    const [markerLocation, setMarkerLocation] = useState({
    lat: 51.509865,
    lng: -0.118092,
  });
    return (
        <APIProvider apiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY || ""}>
            <Map
                style={{ borderRadius: "20px" }}
                defaultZoom={13}
                defaultCenter={markerLocation}
                gestureHandling={"greedy"}
                disableDefaultUI
            >
                <Marker position={markerLocation} />
            </Map>
        </APIProvider>)
};

export default GMAP;