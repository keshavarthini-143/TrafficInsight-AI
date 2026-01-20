
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMap, Circle, Popup } from 'react-leaflet';
import L from 'leaflet';
import { TrafficAnalysis } from '../types';

// Standard marker fix
const DefaultIcon = L.icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

interface TrafficMapProps {
  analysis: TrafficAnalysis | null;
  loading: boolean;
}

const MapController = ({ center, zoom }: { center: [number, number], zoom: number }) => {
  const map = useMap();
  
  useEffect(() => {
    // Force Leaflet to recalculate container size to fix white map issues
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 250);
    return () => clearTimeout(timer);
  }, [map]);

  useEffect(() => {
    map.setView(center, zoom, {
      animate: true,
      duration: 1.5
    });
  }, [center, zoom, map]);

  return null;
};

const TrafficMap: React.FC<TrafficMapProps> = ({ analysis, loading }) => {
  const [mapCenter, setMapCenter] = useState<[number, number]>([20, 0]);
  const [zoom, setZoom] = useState(2);

  useEffect(() => {
    if (analysis && analysis.lat && analysis.lng) {
      setMapCenter([analysis.lat, analysis.lng]);
      setZoom(15);
    }
  }, [analysis]);

  const getOverlayColor = (color: string | undefined) => {
    switch (color) {
      case 'red': return '#ef4444';
      case 'orange': return '#f97316';
      case 'green': return '#10b981';
      default: return '#3b82f6';
    }
  };

  return (
    <div className="relative w-full aspect-[16/10] bg-slate-100 rounded-3xl border border-slate-300 overflow-hidden shadow-2xl z-0">
      <MapContainer
        center={mapCenter}
        zoom={zoom}
        className="h-full w-full"
        zoomControl={true}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MapController center={mapCenter} zoom={zoom} />

        {analysis && !loading && (
          <>
            <Circle 
              center={mapCenter} 
              pathOptions={{
                fillColor: getOverlayColor(analysis.roadColor),
                fillOpacity: 0.2,
                color: getOverlayColor(analysis.roadColor),
                weight: 2,
                className: 'traffic-pulse'
              }} 
              radius={800} 
            />

            <Marker position={mapCenter}>
              <Popup>
                <div className="p-1">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-tight">Traffic Insight</p>
                  <p className="text-slate-900 font-bold leading-snug">{analysis.message}</p>
                </div>
              </Popup>
            </Marker>

            <Circle 
              center={mapCenter} 
              pathOptions={{
                fillColor: getOverlayColor(analysis.roadColor),
                fillOpacity: 0.4,
                stroke: false
              }} 
              radius={150} 
            />
          </>
        )}
      </MapContainer>

      {/* Floating Status UI */}
      <div className="absolute top-4 right-4 z-[1000]">
        <div className="px-4 py-2 bg-white/95 backdrop-blur-sm border border-slate-200 rounded-2xl flex items-center gap-3 shadow-lg">
          <div className={`w-3 h-3 rounded-full ${loading ? 'bg-amber-500 animate-pulse' : 'bg-green-500'}`}></div>
          <span className="text-xs font-bold text-slate-800 uppercase tracking-tight">
            {loading ? 'Processing...' : 'Live System Active'}
          </span>
        </div>
      </div>

      <div className="absolute bottom-6 left-6 z-[1000]">
        <div className="px-4 py-3 bg-white/95 backdrop-blur-sm border border-slate-200 rounded-2xl flex flex-col gap-1 shadow-xl">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Congestion Level</span>
          <div className="flex items-center gap-4">
            <div className="flex gap-1">
              <div className="w-5 h-2 bg-emerald-500 rounded-full"></div>
              <div className="w-5 h-2 bg-orange-500 rounded-full"></div>
              <div className="w-5 h-2 bg-red-500 rounded-full"></div>
            </div>
            <span className="text-[11px] font-bold text-slate-700">REAL-TIME DATA SYNCED</span>
          </div>
        </div>
      </div>

      {loading && (
        <div className="absolute inset-0 z-[2000] flex items-center justify-center bg-slate-100/60 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-3xl shadow-2xl flex flex-col items-center border border-slate-100">
            <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-slate-900 font-bold uppercase tracking-widest text-sm">Scanning Grid...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrafficMap;
