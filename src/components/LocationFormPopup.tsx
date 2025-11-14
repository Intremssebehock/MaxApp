// src/components/LocationFormPopup.tsx
import React, { useState } from 'react';
import type { DisabilityType } from '../types';

interface LocationFormPopupProps {
  selectedType: DisabilityType;
  onSave: (data: {
    name: string;
    city: string;
    characteristics: Partial<Record<string, boolean>>;
  }) => void;
  onCancel: () => void;
}

const LocationFormPopup: React.FC<LocationFormPopupProps> = ({
  selectedType,
  onSave,
  onCancel,
}) => {
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [checkboxValues, setCheckboxValues] = useState<Record<string, boolean>>({});

  // Поля для каждой категории
  const criteriaFields: Record<DisabilityType, string[]> = {
    physical: ['wheelchairFriendly', 'ramp', 'elevator', 'accessibleRestroom', 'accessibleParking'],
    hearing: ['visualAlerts', 'subtitlesAvailable', 'textCommunication'],
    vision: ['brailleSigns', 'audioGuides', 'highContrastText', 'goodLighting'],
    cognitive: ['simpleNavigation', 'trainedStaff', 'lowNoise'],
  };

  // Подписи для чекбоксов
  const labelMap: Record<string, string> = {
    wheelchairFriendly: 'Доступ для колясок',
    ramp: 'Пандусы/рампы',
    elevator: 'Лифт',
    accessibleRestroom: 'Доступный туалет',
    accessibleParking: 'Парковка для инвалидов',
    visualAlerts: 'Визуальные сигналы',
    subtitlesAvailable: 'Субтитры',
    textCommunication: 'Текстовое общение',
    brailleSigns: 'Таблички Брайля',
    audioGuides: 'Аудиогиды',
    highContrastText: 'Контрастный текст',
    goodLighting: 'Хорошее освещение',
    simpleNavigation: 'Простая навигация',
    trainedStaff: 'Обученный персонал',
    lowNoise: 'Низкий уровень шума',
  };

  const handleSubmit = () => {
    onSave({
      name,
      city,
      characteristics: checkboxValues,
    });
  };

  return (
    <div>
      <label>
        Название:
        <br />
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ width: '100%', marginBottom: '12px' }}
        />
      </label>

      <label>
        Город:
        <br />
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          style={{ width: '100%', marginBottom: '12px' }}
        />
      </label>

      <div style={{ marginBottom: '16px' }}>
        <h4 style={{ margin: '8px 0' }}>Критерии:</h4>
        {criteriaFields[selectedType].map((field) => (
          <label key={field} style={{ display: 'block', margin: '6px 0' }}>
            <input
              type="checkbox"
              checked={!!checkboxValues[field]}
              onChange={(e) =>
                setCheckboxValues((prev) => ({
                  ...prev,
                  [field]: e.target.checked,
                }))
              }
            />
            <span style={{ marginLeft: '8px' }}>{labelMap[field]}</span>
          </label>
        ))}
      </div>

      <div>
        <button
          onClick={(e) => {
            e.stopPropagation(); 
            handleSubmit();
          }}
          disabled={!name.trim() || !city.trim()}
          style={{ marginRight: '8px' }}
        >
          Сохранить
        </button>
        <button 
            onClick={(e) => {
              e.stopPropagation(); 
              onCancel();
            }}>
          Отмена
        </button>
      </div>
    </div>
  );
};

export default LocationFormPopup;