import { format } from 'date-fns';
import { nb } from 'date-fns/locale';

export const formatFullDate = (date?: string) => {
  if (!date) return '';

  return format(new Date(date), 'dd.MM.yyyy HH:mm', { locale: nb });
};

export const formatDate = (date?: string) => {
  if (!date) return '';

  return format(new Date(date), 'd. MMMM yyyy', { locale: nb });
};

export const formatDateWithTime = (date?: string) => {
  if (!date) return '';

  return format(new Date(date), 'd. MMMM yyyy HH:mm', { locale: nb });
};
