import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import type { Location, DisabilityType } from './../types';
import LocationFormPopup from './LocationFormPopup';
import styles from './../styles/Map.module.css';

// Исправление иконки маркера
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Хук для управления картой извне (для центрирования)
function SetMapView({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, 12);
  }, [center, map]);
  return null;
}

// Хук для клика
function MapClickHandlerInner({ onMapClick }: { onMapClick: (latlng: L.LatLng) => void }) {
  useMapEvents({
    click(event) {
      onMapClick(event.latlng);
    },
  });
  return null;
}

interface MapClickHandlerProps {
  locations: Location[];
  selectedType: DisabilityType | '';
  selectedCity: string;
  setSelectedCity: (city: string) => void;
  onAddLocation?: (lat: number, lng: number, data: Partial<Location>) => void;
  onRemoveLocation?: (location: Location) => void;
}

const MapClickHandler: React.FC<MapClickHandlerProps> = ({
  locations,
  selectedType,
  selectedCity,
  setSelectedCity,
  onAddLocation,
  onRemoveLocation,
}) => {
  const [newMarker, setNewMarker] = useState<L.LatLng | null>(null);
  const [cityInput, setCityInput] = useState('');
  const [mapCenter] = useState<[number, number]>(
    () =>
      locations.length > 0
        ? [locations[0].latitude, locations[0].longitude]
        : [55.751244, 37.618423], // Москва
  );

  const inputRef = useRef<HTMLInputElement>(null);

  const handleMapClick = (latlng: L.LatLng) => {
    if (onAddLocation && selectedType) {
      setNewMarker(latlng);
    }
  };

  const handleSave = (data: {
    name: string;
    city: string;
    characteristics: Partial<Record<string, boolean>>;
  }) => {
    if (!newMarker || !onAddLocation) return;
    const newLocationData: Partial<Location> = {
      name: data.name,
      city: data.city,
      ...data.characteristics,
    };
    onAddLocation(newMarker.lat, newMarker.lng, {
      ...newLocationData,
    });
    setNewMarker(null);
  };

  const handleCancel = () => {
    setNewMarker(null);
  };

  const handleCitySearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const city = cityInput.trim() || 'Москва';
    console.log('🔍 Устанавливаем город:', city); // ← уже есть
    setCityInput(city);
    setSelectedCity(city);
  };

  const filteredLocations = locations.filter((loc) => loc.city === selectedCity);

  return (
    <>
      {/* Поле ввода города над картой */}
      <form onSubmit={handleCitySearch} className={styles.cityForm}>
        <input
          ref={inputRef}
          type="text"
          value={cityInput}
          onChange={(e) => setCityInput(e.target.value)}
          placeholder="Введите город"
          className={styles.formInput}
        />
        <button type="submit" className={styles.formButton}>
          Найти
        </button>
      </form>

      <div style={{ height: 'calc(100% - 60px)', width: '100%' }}>
        <MapContainer
          center={mapCenter}
          zoom={12}
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom={true}>
          {/* Управление центром карты */}
          <SetMapView center={mapCenter} />

          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="© Данные карты: OSM | Инструмент: Leaflet"
          />

          {onAddLocation && <MapClickHandlerInner onMapClick={handleMapClick} />}

          {/* Временная метка */}
          {newMarker && onAddLocation && selectedType && (
            <Marker position={newMarker}>
              <Popup>
                <LocationFormPopup
                  selectedType={selectedType}
                  onSave={handleSave}
                  onCancel={handleCancel}
                />
              </Popup>
            </Marker>
          )}

          {/* Все постоянные метки */}
          {filteredLocations.map((loc) => (
            <Marker key={loc.id} position={[loc.latitude, loc.longitude]}>
              <Popup>
                <strong>{loc.name}</strong>
                <br />
                Рейтинг доступности: {loc.accessibilityRating}/5
                <br />
                {selectedType && (
                  <>
                    {selectedType === 'physical' && (
                      <>
                        {loc.wheelchairFriendly && '♿ Доступ для колясок: да'}
                        {loc.ramp && '↗️ Пандусы: да'}
                        {loc.elevator && '🛗 Лифт: да'}
                        {loc.accessibleRestroom && '🚻 Доступный туалет: да'}
                        {loc.accessibleParking && '🅿️ Парковка для инвалидов: да'}
                      </>
                    )}
                    {selectedType === 'hearing' && (
                      <>
                        {loc.visualAlerts && '🔔 Визуальные сигналы: да'}
                        {loc.subtitlesAvailable && '📜 Субтитры: да'}
                        {loc.textCommunication && '💬 Текстовое общение: да'}
                      </>
                    )}
                    {selectedType === 'vision' && (
                      <>
                        {loc.brailleSigns && '🦯 Таблички Брайля: да'}
                        {loc.audioGuides && '🎧 Аудиогиды: да'}
                        {loc.highContrastText && '🅰️ Контрастный текст: да'}
                        {loc.goodLighting && '💡 Хорошее освещение: да'}
                      </>
                    )}
                    {selectedType === 'cognitive' && (
                      <>
                        {loc.simpleNavigation && '🧭 Простая навигация: да'}
                        {loc.trainedStaff && '🧑‍🏫 Обученный персонал: да'}
                        {loc.lowNoise && '🔇 Низкий уровень шума: да'}
                      </>
                    )}
                  </>
                )}
                {!selectedType && (
                  <>
                    {(loc.wheelchairFriendly ||
                      loc.brailleSigns ||
                      loc.audioGuides ||
                      loc.lowNoise) && (
                      <small>
                        ℹ️ Характеристики доступны — выберите категорию для подробностей
                      </small>
                    )}
                  </>
                )}
                {/* Кнопка удаления */}
                {onRemoveLocation && (
                  <div style={{ marginTop: '12px' }}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveLocation(loc);
                      }}
                      style={{
                        padding: '4px 8px',
                        backgroundColor: '#dc3545',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '12px',
                      }}>
                      Удалить метку
                    </button>
                  </div>
                )}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </>
  );
};

export default MapClickHandler;
