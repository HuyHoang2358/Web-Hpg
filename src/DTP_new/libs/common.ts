import { DEBUG_MODE } from '@/DTP_new/configs/globalVariables';

export function hiddenHTMLElementByClassName(hidden_element_classes: string[]) {
  hidden_element_classes.forEach((hidden_class) => {
    const elements = document.querySelectorAll<HTMLElement>('.' + hidden_class);
    for (const item of elements) {
      item.style.display = 'none';
    }
  });
}

export const writeLog = (title: string, data?: any) => {
  if (DEBUG_MODE) console.log(title, data || '');
};

export function convertCoordinates(lat: number, lng: number) {
  // Convert latitude
  const latDeg = Math.floor(lat);
  const latMin = Math.floor((lat - latDeg) * 60);
  const latSec = ((lat - latDeg) * 60 - latMin) * 60;

  // Convert longitude
  const lngDeg = Math.floor(lng);
  const lngMin = Math.floor((lng - lngDeg) * 60);
  const lngSec = ((lng - lngDeg) * 60 - lngMin) * 60;

  // Create result string
  return `${latDeg}°${latMin}'${latSec.toFixed(2)}" N - ${lngDeg}°${lngMin}'${lngSec.toFixed(2)}" E`;
}
