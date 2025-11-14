// AccessibilityInfo.tsx
import React from 'react';
import type { Dispatch, SetStateAction } from 'react';
import type { DisabilityType } from '../types';
import styles from './../styles/AccessibilityInfo.module.css';

interface AccessibilityInfoProps {
  selectedType: DisabilityType | '';
  setSelectedType: Dispatch<SetStateAction<DisabilityType | ''>>;
}

const accessibilityCriteria: Record<DisabilityType, string[]> = {
  physical: [
    'Доступ для колясок: рампы, пандусы, лифты',
    'Ширина дверей и коридоров',
    'Доступность туалета',
    'Парковка для инвалидов',
    'Высота столов и прилавков',
    'Поддержка персонала',
  ],
  hearing: [
    'Визуальные сигналы вместо звуковых',
    'Субтитры на видео и мероприятиях',
    'Возможность текстового общения с персоналом',
  ],
  vision: [
    'Тактильные указатели и брайлевские таблички',
    'Аудиогиды или голосовые подсказки',
    'Крупный шрифт и контрастный текст',
    'Хорошее освещение',
  ],
  cognitive: [
    'Простая и понятная навигация',
    'Обученный персонал',
    'Спокойная обстановка, минимальный шум',
    'Пошаговые инструкции для услуг',
  ],
};

const AccessibilityInfo: React.FC<AccessibilityInfoProps> = ({ selectedType, setSelectedType }) => {
  const handleTypeSelect = (type: DisabilityType | '') => {
    setSelectedType(type);
  };

  const accessibilityItems: Record<DisabilityType, { icon: string; label: string }> = {
    physical: { icon: '♿', label: 'Физическая' },
    hearing: { icon: '🔇', label: 'Слуховая' },
    vision: { icon: '🦯', label: 'Зрительная' },
    cognitive: { icon: '🧠', label: 'Когнитивная' },
  };

  return (
    <div className={styles.accessibilityContainer}>
      <h2 className={styles.accessibilityTitle}>НАСТРОЙКА</h2>

      {/* Кнопки категорий */}
      <div className={styles.categoryButtons}>
        {Object.entries(accessibilityItems).map(([key, item]) => {
          const type = key as DisabilityType;
          const isActive = selectedType === type;
          return (
            <button
              key={type}
              className={`${styles.categoryButton} ${isActive ? styles.categoryButtonActive : ''}`}
              onClick={() => handleTypeSelect(type)}>
              <i
                style={{ backgroundImage: `url(icons/${type}.svg)` }}
                className={styles.iconWrapper}></i>
              <div>{item.label}</div>
            </button>
          );
        })}
        {/* Кнопка "Сбросить" (опционально) */}
        {selectedType && (
          <button
            className={styles.categoryButton}
            onClick={() => handleTypeSelect('')}
            style={{ marginTop: '12px' }}>
            Сбросить фильтр
          </button>
        )}
      </div>

      {/* Отображение критериев */}
      {selectedType && (
        <div className={styles.criteriaSection}>
          <h3>КРИТЕРИИ ДОСТУПНОСТИ:</h3>
          <ul className={styles.propertiesList}>
            {accessibilityCriteria[selectedType].map((crit, idx) => (
              <li key={idx}>{crit}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default AccessibilityInfo;
