
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { MapPin, Search } from 'lucide-react';

interface MapComponentProps {
  onLocationSelect?: (coordinates: [number, number], address: string) => void;
  initialCoordinates?: [number, number];
  initialAddress?: string;
  height?: string;
  interactive?: boolean;
  showSearch?: boolean;
}

const MapComponent: React.FC<MapComponentProps> = ({
  onLocationSelect,
  initialCoordinates = [-46.6333, -23.5505], // São Paulo como padrão
  initialAddress = '',
  height = '300px',
  interactive = true,
  showSearch = true
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const marker = useRef<mapboxgl.Marker | null>(null);
  const [searchAddress, setSearchAddress] = useState(initialAddress);
  const [currentCoordinates, setCurrentCoordinates] = useState<[number, number]>(initialCoordinates);

  useEffect(() => {
    if (!mapContainer.current) return;

    // Inicializar o mapa
    mapboxgl.accessToken = 'pk.eyJ1IjoibG92YWJsZSIsImEiOiJjbHV5aGd5MDYwMXVqMnFwZmJwbjBhMTdlIn0.VK_qmUUaBLVIE_XoNn6N6A';
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: initialCoordinates,
      zoom: 13,
      interactive: interactive
    });

    // Adicionar controles de navegação
    if (interactive) {
      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
    }

    // Criar marcador inicial
    marker.current = new mapboxgl.Marker({
      draggable: interactive
    })
      .setLngLat(initialCoordinates)
      .addTo(map.current);

    // Event listener para arrastar o marcador
    if (interactive && marker.current) {
      marker.current.on('dragend', () => {
        if (marker.current) {
          const lngLat = marker.current.getLngLat();
          const coordinates: [number, number] = [lngLat.lng, lngLat.lat];
          setCurrentCoordinates(coordinates);
          reverseGeocode(coordinates);
        }
      });
    }

    // Event listener para clicar no mapa
    if (interactive) {
      map.current.on('click', (e) => {
        const coordinates: [number, number] = [e.lngLat.lng, e.lngLat.lat];
        updateMarkerPosition(coordinates);
        reverseGeocode(coordinates);
      });
    }

    return () => {
      map.current?.remove();
    };
  }, []);

  const updateMarkerPosition = (coordinates: [number, number]) => {
    if (marker.current && map.current) {
      marker.current.setLngLat(coordinates);
      map.current.setCenter(coordinates);
      setCurrentCoordinates(coordinates);
    }
  };

  const reverseGeocode = async (coordinates: [number, number]) => {
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${coordinates[0]},${coordinates[1]}.json?access_token=${mapboxgl.accessToken}&language=pt`
      );
      const data = await response.json();
      
      if (data.features && data.features.length > 0) {
        const address = data.features[0].place_name;
        setSearchAddress(address);
        onLocationSelect?.(coordinates, address);
      }
    } catch (error) {
      console.error('Erro ao buscar endereço:', error);
    }
  };

  const searchLocation = async () => {
    if (!searchAddress.trim()) return;

    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(searchAddress)}.json?access_token=${mapboxgl.accessToken}&country=BR&language=pt`
      );
      const data = await response.json();
      
      if (data.features && data.features.length > 0) {
        const [lng, lat] = data.features[0].center;
        const coordinates: [number, number] = [lng, lat];
        updateMarkerPosition(coordinates);
        onLocationSelect?.(coordinates, data.features[0].place_name);
      }
    } catch (error) {
      console.error('Erro ao buscar localização:', error);
    }
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocalização não é suportada neste navegador');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coordinates: [number, number] = [
          position.coords.longitude,
          position.coords.latitude
        ];
        updateMarkerPosition(coordinates);
        reverseGeocode(coordinates);
      },
      (error) => {
        console.error('Erro ao obter localização:', error);
        alert('Erro ao obter sua localização atual');
      }
    );
  };

  return (
    <div className="space-y-4">
      {showSearch && (
        <div className="space-y-2">
          <Label>Buscar Endereço</Label>
          <div className="flex gap-2">
            <Input
              value={searchAddress}
              onChange={(e) => setSearchAddress(e.target.value)}
              placeholder="Digite o endereço..."
              onKeyPress={(e) => e.key === 'Enter' && searchLocation()}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={searchLocation}
            >
              <Search className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={getCurrentLocation}
              title="Usar minha localização atual"
            >
              <MapPin className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
      
      <div 
        ref={mapContainer} 
        style={{ height }} 
        className="w-full rounded-lg border overflow-hidden"
      />
      
      {interactive && (
        <p className="text-sm text-muted-foreground">
          Clique no mapa ou arraste o marcador para selecionar uma localização
        </p>
      )}
    </div>
  );
};

export default MapComponent;
