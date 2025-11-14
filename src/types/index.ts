export interface Location {
  id: string;
  name: string;
  city: string;
  latitude: number;
  longitude: number;
  accessibilityRating: number; // 0-5

  // Физическая инвалидность
  wheelchairFriendly?: boolean;
  ramp?: boolean;
  elevator?: boolean;
  accessibleRestroom?: boolean;
  accessibleParking?: boolean;

  // Слух
  visualAlerts?: boolean;
  subtitlesAvailable?: boolean;
  textCommunication?: boolean;

  // Зрение
  brailleSigns?: boolean;
  audioGuides?: boolean;
  highContrastText?: boolean;
  goodLighting?: boolean;

  // Когнитивные и неврологические
  simpleNavigation?: boolean;
  trainedStaff?: boolean;
  lowNoise?: boolean;
} 

export type DisabilityType = "physical" | "hearing" | "vision" | "cognitive";