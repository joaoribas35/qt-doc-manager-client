import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);
dayjs.locale('pt-br');

export function formatDate(date: string) {
  return dayjs.utc(date).format('DD/MMM/YYYY');
}

export function formatDateWithWeekday(date: string) {
  return dayjs.utc(date).format('dddd, DD/MMM/YYYY');
}

export function formatDateToNoon(dateString: string): string {
  if (!dateString) return dateString;
  const date = dayjs(dateString);
  return date.hour(12).minute(0).second(0).millisecond(0).format();
}

/**
 * Returns a relative due date label in Portuguese:
 * - Same day: "expira hoje"
 * - Future: "expira em X dias"
 * - Past: "expirou {weekday}, DD/mmm/yyyy" (e.g. "expirou sábado, 14/mar/2026")
 */
export function formatDueDateRelative(dueDate: string): string {
  const due = dayjs(dueDate).startOf('day');
  const today = dayjs().startOf('day');
  const diffDays = due.diff(today, 'day');

  if (diffDays === 0) return 'expira hoje';
  if (diffDays > 0) return `expira em ${diffDays} ${diffDays === 1 ? 'dia' : 'dias'}`;
  return `expirou ${dayjs(dueDate).locale('pt-br').format('dddd, DD/MMM/YYYY').toLowerCase()}`;
}
