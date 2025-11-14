import './App.css';
import type { Location, DisabilityType } from './types';
import { useEffect, useState } from 'react';
import AccessibilityInfo from './components/AccessibilityInfo';
import MapClickHandler from './components/MapClickHandler';
import BottomNav from './components/BottomNav';

function App() {
  const [selectedType, setSelectedType] = useState<DisabilityType | ''>('');
  const [screen, setScreen] = useState<'map' | 'info'>('map');
  const [selectedCity, setSelectedCity] = useState<string>('Москва');

  const [locations, setLocations] = useState<Location[]>([]); // ← изначально пусто
  const [, setLoading] = useState<boolean>(true);

  // Загружаем локации при старте
  useEffect(() => {
    const loadLocations = async () => {
      try {
        const res = await fetch('http://localhost:8000/api/locations');
        if (!res.ok) throw new Error('Не удалось загрузить локации');
        const data: Location[] = await res.json();
        setLocations(data);
      } catch (err) {
        console.error('Ошибка при загрузке:', err);
        // Можно показать toast или оставить пустым
      } finally {
        setLoading(false);
      }
    };
    loadLocations();
    console.log('📍 selectedCity изменился:', selectedCity);
    console.log('📍 selectedCity изменился:', locations);
  }, []);
  console.log('📍 selectedCity изменился:', locations);

  //  Обновлённая функция добавления — сохраняет в БД и обновляет UI
  const handleAddLocation = async (lat: number, lng: number, data: Partial<Location>) => {
    const newLocationData = {
      ...data,
      latitude: lat,
      longitude: lng,
    };

    console.log('🆕 Отправка на сервер:', newLocationData);

    try {
      const res = await fetch('http://localhost:8000/api/locations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newLocationData),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`HTTP ${res.status}: ${errorText}`);
      }

      const createdLocation: Location = await res.json();
      setLocations((prev) => [...prev, createdLocation]);
      console.log('✅ Локация добавлена:', createdLocation);
    } catch (err) {
      console.error('❌ Ошибка добавления локации:', err);
      alert('Не удалось добавить локацию. Проверьте бэкенд и поля.');
    }
  };

  // Обновлённая функция удаления — через API
  const handleRemoveLocation = async (location: Location) => {
    console.log('🗑️ Удаляем локацию:', location.id);

    try {
      const res = await fetch(`http://localhost:8000/api/locations/${location.id}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Не удалось удалить локацию');

      setLocations((prev) => prev.filter((loc) => loc.id !== location.id));
      console.log('✅ Локация удалена:', location.id);
    } catch (err) {
      console.error('❌ Ошибка удаления:', err);
      alert('Не удалось удалить локацию');
    }
  };

  const screens = {
    info: <AccessibilityInfo selectedType={selectedType} setSelectedType={setSelectedType} />,
    map: (
      <MapClickHandler
        locations={locations}
        selectedType={selectedType}
        selectedCity={selectedCity}
        setSelectedCity={setSelectedCity}
        onAddLocation={handleAddLocation}
        onRemoveLocation={handleRemoveLocation}
      />
    ),
  };

  return (
    <>
      {screens[screen] || <div>Неизвестный экран</div>}
      <BottomNav active={screen} onChange={setScreen} />
    </>
  );
}

export default App;
