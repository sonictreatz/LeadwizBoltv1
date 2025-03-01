import { format, formatDistanceToNow as formatDistance, parseISO } from 'date-fns';

export const formatDate = (date: Date | string): string => {
  const parsedDate = typeof date === 'string' ? parseISO(date) : date;
  return format(parsedDate, 'MMMM d, yyyy');
};

export const formatTime = (date: Date | string): string => {
  const parsedDate = typeof date === 'string' ? parseISO(date) : date;
  return format(parsedDate, 'h:mm a');
};

export const formatDateTime = (date: Date | string): string => {
  const parsedDate = typeof date === 'string' ? parseISO(date) : date;
  return format(parsedDate, 'MMMM d, yyyy h:mm a');
};

export const formatDistanceToNow = (date: Date | string): string => {
  const parsedDate = typeof date === 'string' ? parseISO(date) : date;
  return formatDistance(parsedDate, { addSuffix: true });
};

export const formatDateRange = (startDate: Date | string, endDate: Date | string): string => {
  const parsedStartDate = typeof startDate === 'string' ? parseISO(startDate) : startDate;
  const parsedEndDate = typeof endDate === 'string' ? parseISO(endDate) : endDate;
  
  // If same day
  if (format(parsedStartDate, 'yyyy-MM-dd') === format(parsedEndDate, 'yyyy-MM-dd')) {
    return `${format(parsedStartDate, 'MMMM d, yyyy')} ${format(parsedStartDate, 'h:mm a')} - ${format(parsedEndDate, 'h:mm a')}`;
  }
  
  // Different days
  return `${format(parsedStartDate, 'MMMM d, yyyy h:mm a')} - ${format(parsedEndDate, 'MMMM d, yyyy h:mm a')}`;
};

export const isToday = (date: Date | string): boolean => {
  const parsedDate = typeof date === 'string' ? parseISO(date) : date;
  const today = new Date();
  return format(parsedDate, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd');
};

export const isTomorrow = (date: Date | string): boolean => {
  const parsedDate = typeof date === 'string' ? parseISO(date) : date;
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return format(parsedDate, 'yyyy-MM-dd') === format(tomorrow, 'yyyy-MM-dd');
};

export const isPast = (date: Date | string): boolean => {
  const parsedDate = typeof date === 'string' ? parseISO(date) : date;
  return parsedDate < new Date();
};

export const isFuture = (date: Date | string): boolean => {
  const parsedDate = typeof date === 'string' ? parseISO(date) : date;
  return parsedDate > new Date();
};