import { format } from 'date-fns';
import { nb } from 'date-fns/locale';

export const formatFullDate = (date?: string) => {
  if (!date) return '';

  return format(new Date(date), 'dd.MM.yyyy hh:mm', { locale: nb });
};