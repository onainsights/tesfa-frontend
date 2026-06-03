'use client';
import React, { useState, useEffect, useRef } from 'react';
import L, { Layer, Path } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import Loader from '../../../sharedComponents/Loader';
import { DiseaseRisk, Prediction, MapFeature, MapFeatureCollection, Country, Region } from '../../../utils/type';
import { useCountries } from '../../../hooks/useCountries';
import { useRegions } from '../../../hooks/useRegions';
import { usePredictions } from '../../../hooks/usePrediction';
import useWorldLand from '../../../hooks/useWorldLand';

function isCountry(properties: Country | Region): properties is Country {
  return (properties as Country).country_id !== undefined;
}

function isRegion(properties: Country | Region): properties is Region {
  return (properties as Region).region_id !== undefined;
}

const MapClient = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<L.Map | null>(null);
  const geoJsonLayersRef = useRef<{
    worldLand?: L.GeoJSON;
    countries?: L.GeoJSON;
    regions?: L.GeoJSON;
  }>({});
  const [hoveredFeature, setHoveredFeature] = useState<MapFeature | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { countries, loading: loadingC } = useCountries();
  const { regions, loading: loadingR } = useRegions();
  const { predictions } = usePredictions();
  const { worldLand } = useWorldLand();
  const showLoaderOverlay = loadingC;

  useEffect(() => {
    if (!mapRef.current || leafletMapRef.current) return;
    const map = L.map(mapRef.current, {
      center: [10, 36],
      zoom: 1,
      minZoom: 3,
      maxZoom: 12,
      zoomControl: false,
    });

    map.createPane('worldLandPane');
    map.getPane('worldLandPane')!.style.zIndex = '200';

    map.createPane('countriesPane');
    map.getPane('countriesPane')!.style.zIndex = '300';

    map.createPane('regionsPane');
    map.getPane('regionsPane')!.style.zIndex = '400';

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);
    L.control.zoom({ position: 'bottomright' }).addTo(map);
    map.setMaxBounds([[-85, -180], [85, 180]]);
    leafletMapRef.current = map;

    const handleZoom = () => {
      const zoom = map.getZoom();
      const regionsLayer = geoJsonLayersRef.current.regions;
      if (zoom >= 6 && regionsLayer && !map.hasLayer(regionsLayer)) {
        map.addLayer(regionsLayer);
      } else if (zoom < 6 && regionsLayer && map.hasLayer(regionsLayer)) {
        map.removeLayer(regionsLayer);
      }
    };
    map.on('zoomend', handleZoom);

    return () => {
      map.off('zoomend', handleZoom);
      map.remove();
      leafletMapRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!worldLand || !leafletMapRef.current) return;
    if (geoJsonLayersRef.current.worldLand) {
      leafletMapRef.current.removeLayer(geoJsonLayersRef.current.worldLand);
    }
    const layer = L.geoJSON(worldLand, {
      pane: 'worldLandPane',
      style: { fillColor: '#00353D', fillOpacity: 1, weight: 0, color: 'transparent' },
      onEachFeature: (_, layer) => {
        if (layer instanceof L.Path) {
          const el = layer.getElement();
          if (el) (el as SVGPathElement).style.filter = 'hue-rotate(180deg) brightness(0) saturate(0)';
        }
      },
    }).addTo(leafletMapRef.current);
    geoJsonLayersRef.current.worldLand = layer;
  }, [worldLand]);

  useEffect(() => {
    if (!leafletMapRef.current) return;
    if (geoJsonLayersRef.current.countries) {
      leafletMapRef.current.removeLayer(geoJsonLayersRef.current.countries);
      geoJsonLayersRef.current.countries = undefined;
    }
    if (countries.length > 0) {
      const valid = countries.filter(country => country.geometry?.type);
      if (valid.length > 0) {
        const fc: MapFeatureCollection = {
          type: 'FeatureCollection',
          features: valid.map(country => ({
            type: 'Feature',
            properties: { ...country, color: country.conflict_type === 'active' ? '#E8543A' : country.conflict_type === 'post_war' ? '#BA6D58' : '#386c80ff' },
            geometry: country.geometry!,
          })),
        };
        const layer = L.geoJSON(fc, {
          pane: 'countriesPane',
          style: f => ({
            fillColor: f?.properties?.color || '#0F4C75',
            weight: 0.5,
            color: '#fff',
            fillOpacity: 1,
          }),
          onEachFeature: (f, l) => {
            if (!f) return;
            l.on('mouseover', () => {
              setHoveredFeature(f);
            });
            l.on('mouseout', () => {
              setHoveredFeature(null);
            });
          },
        }).addTo(leafletMapRef.current!);
        geoJsonLayersRef.current.countries = layer;
      }
    }
  }, [countries]);

  useEffect(() => {
    if (!leafletMapRef.current) return;
    if (geoJsonLayersRef.current.regions) {
      leafletMapRef.current.removeLayer(geoJsonLayersRef.current.regions);
      geoJsonLayersRef.current.regions = undefined;
    }
    if (regions.length > 0) {
      const valid = regions.filter(region => region.geometry?.type);
      if (valid.length > 0) {
        const fc: MapFeatureCollection = {
          type: 'FeatureCollection',
          features: valid.map(region => ({
            type: 'Feature',
            properties: {
              ...region,
              color: region.is_affected ? '#E8543A' : '#386c80ff',
            },
            geometry: region.geometry!,
          })),
        };
        const layer = L.geoJSON(fc, {
          pane: 'regionsPane',
          style: f => ({
            fillColor: f?.properties?.color || '#386c80ff',
            weight: 0.5,
            color: '#fff',
            fillOpacity: 0.9,
          }),
          onEachFeature: (f, l) => {
            if (!f) return;
            l.on('mouseover', () => {
              setHoveredFeature(f);
            });
            l.on('mouseout', () => {
              setHoveredFeature(null);
            });
          },
        });
        geoJsonLayersRef.current.regions = layer;
        if (leafletMapRef.current.getZoom() >= 6) {
          leafletMapRef.current.addLayer(layer);
        }
      }
    }
  }, [regions]);

  const getPredictionInfo = () => {
    if (!hoveredFeature) return null;
    const p = hoveredFeature.properties;
    if (isCountry(p)) return predictions.find(pred => pred.country === p.country_id);
    if (isRegion(p)) return predictions.find(pred => pred.region === p.region_id);
    return null;
  };

  return (
    <div className="relative w-full h-full overflow-hidden">
      <div
        ref={mapRef}
        className="w-full h-full"
        onMouseMove={e => setMousePosition({ x: e.clientX, y: e.clientY })}
      />
      {showLoaderOverlay && (
        <div className="absolute inset-0 flex items-center justify-center z-[999] pointer-events-none bg-surface/20">
          <Loader />
        </div>
      )}
      {hoveredFeature && !showLoaderOverlay && (
        <div
          className="absolute max-w-xs z-[1000] pointer-events-none bg-accent text-primary-dark p-4 rounded-xl shadow-lg"
          style={{
            left: mousePosition.x + 10,
            top: mousePosition.y + 10,
          }}
        >
          <h3 className="font-bold text-sm">
            {isCountry(hoveredFeature.properties)
              ? hoveredFeature.properties.countries_name
              : isRegion(hoveredFeature.properties)
              ? hoveredFeature.properties.region_name
              : ''}
          </h3>
          <div className="mt-2 text-xs">
            {(() => {
              const info = getPredictionInfo();
              const risks = info?.disease_risks;
              if (info?.description) {
                return (
                  <>
                    <p className="leading-relaxed">{info.description}</p>
                    {(!risks || risks.length === 0) ? (
                      <p className="mt-2 opacity-80">No health risks in this area.</p>
                    ) : (
                      <table className="mt-2 text-xs w-full border-collapse">
                        <thead>
                          <tr className="bg-black/10">
                            <th className="px-2 py-1 text-left rounded-l-sm">Disease</th>
                            <th className="px-2 py-1 text-left">Risk Level</th>
                            <th className="px-2 py-1 text-right rounded-r-sm">Risk %</th>
                          </tr>
                        </thead>
                        <tbody>
                          {risks.map((item, i) => (
                            typeof item === 'object' && item ? (
                              <tr key={i} className={i % 2 === 0 ? "bg-transparent" : "bg-black/5"}>
                                <td className="px-2 py-1">{(item as DiseaseRisk).disease_name || 'Unknown'}</td>
                                <td className="px-2 py-1">{(item as DiseaseRisk).risk_level || 'Unknown'}</td>
                                <td className="px-2 py-1 text-right">
                                  {typeof (item as DiseaseRisk).risk_score === 'number'
                                    ? `${(item as DiseaseRisk).risk_score}%`
                                    : typeof (item as DiseaseRisk).risk_percent === 'number'
                                    ? `${(item as DiseaseRisk).risk_percent}%`
                                    : 'N/A'}
                                </td>
                              </tr>
                            ) : (
                              <tr key={i}>
                                <td className="px-2 py-1" colSpan={3}>{String(item)}</td>
                              </tr>
                            )
                          ))}
                        </tbody>
                      </table>
                    )}
                  </>
                );
              }
              if (!risks || risks.length === 0) return <p className="opacity-80">No health risks in this area.</p>;
              return risks.map((item, i) =>
                typeof item === 'object' && item ? (
                  <p key={i}>
                    <strong>{(item as DiseaseRisk).disease_name || ''}:</strong>{' '}
                    {(item as DiseaseRisk).risk_level || 'Unknown'}
                  </p>
                ) : (
                  <p key={i}>{String(item)}</p>
                )
              );
            })()}
          </div>
        </div>
      )}
      <div
        className="absolute bottom-10 right-16 z-[1150] text-sm px-4 py-2 font-medium bg-none text-white rounded-lg shadow-md"
      >
        Data coverage: 2000–2025
      </div>
      </div>
  );
};
export default MapClient;