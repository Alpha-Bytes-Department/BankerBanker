'use client'
import { memo } from 'react';
import { GoogleMap, LoadScript, OverlayView } from '@react-google-maps/api';


const customIcons = {
    red: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
    blue: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
    green: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png',
};

const markers = [
    { id: 1, position: { lat: 40.6892, lng: -74.0445 }, title: 'Statue of Liberty', color: 'red', icon: customIcons.red },
    { id: 2, position: { lat: 40.7484, lng: -73.9857 }, title: 'Empire State Building', color: 'red', icon: customIcons.red },
    { id: 3, position: { lat: 40.7580, lng: -73.9855 }, title: 'Times Square', color: 'red', icon: customIcons.red },
    { id: 4, position: { lat: 40.7794, lng: -73.9632 }, title: 'The Met Museum', color: 'blue', icon: customIcons.blue },
    { id: 5, position: { lat: 40.7530, lng: -73.9772 }, title: 'Grand Central Terminal', color: 'blue', icon: customIcons.blue },
    { id: 6, position: { lat: 40.7052, lng: -73.9967 }, title: 'Brooklyn Bridge', color: 'blue', icon: customIcons.blue },
    { id: 7, position: { lat: 40.7115, lng: -74.0126 }, title: '9/11 Memorial', color: 'blue', icon: customIcons.blue },
    { id: 8, position: { lat: 40.7648, lng: -73.9723 }, title: 'Central Park (South)', color: 'green', icon: customIcons.green },
    { id: 9, position: { lat: 40.7466, lng: -74.0055 }, title: 'High Line Park', color: 'green', icon: customIcons.green },
    { id: 10, position: { lat: 40.8504, lng: -73.8763 }, title: 'The Bronx Zoo', color: 'green', icon: customIcons.green },
];;



const GMAP = () => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;


    const center = {
        lat: 40.7128,
        lng: -74.0060
    }

    return (
        <LoadScript
            googleMapsApiKey={apiKey || ""}
            libraries={['geometry', 'drawing']}
        >
            <GoogleMap
                mapContainerStyle={{width: "100%"}}
                mapContainerClassName='h-[300px] xl:h-[500px]'
                center={center}
                zoom={12}
            >
                {/* Loop through the marker data */}
                {markers.map(marker => (
                    <OverlayView
                        key={marker.id}
                        position={marker.position}
                        mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                    >
                        {/* This is your Custom CSS Marker */}
                        <div
                            style={{
                                backgroundColor: marker.color,
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                color: 'white',
                                boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
                                border: '2px solid white',
                                cursor: 'pointer',
                                transform: 'translate(-50%, -50%)',
                                transition: 'transform 0.2s',
                            }}
                            // Add simple hover effect via inline styles or classNames
                            onMouseEnter={(e) => e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1.1)'}
                            onMouseLeave={(e) => e.currentTarget.style.transform = 'translate(-50%, -50%)'}
                            onClick={() => console.log(marker.title)}
                        >
                            {/* SVG Icon (White Pin) */}
                            <svg
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                                <circle cx="12" cy="10" r="3"></circle>
                            </svg>
                        </div>
                    </OverlayView>
                ))}
            </GoogleMap>
        </LoadScript>
    );
};

export default memo(GMAP);