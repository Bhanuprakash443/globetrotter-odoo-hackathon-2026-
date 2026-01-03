/**
 * Date utility functions
 */
import { format, parse, differenceInDays, addDays, isWithinInterval } from 'date-fns';

export const dateUtils = {
  // Format date for display
  formatDate: (date, formatStr = 'MMM dd, yyyy') => {
    if (!date) return '';
    const d = typeof date === 'string' ? parse(date, 'yyyy-MM-dd', new Date()) : date;
    return format(d, formatStr);
  },
  
  // Format date range
  formatDateRange: (startDate, endDate) => {
    if (!startDate || !endDate) return '';
    const start = typeof startDate === 'string' ? parse(startDate, 'yyyy-MM-dd', new Date()) : startDate;
    const end = typeof endDate === 'string' ? parse(endDate, 'yyyy-MM-dd', new Date()) : endDate;
    return `${format(start, 'MMM dd')} - ${format(end, 'MMM dd, yyyy')}`;
  },
  
  // Calculate trip duration
  getTripDuration: (startDate, endDate) => {
    if (!startDate || !endDate) return 0;
    const start = typeof startDate === 'string' ? parse(startDate, 'yyyy-MM-dd', new Date()) : startDate;
    const end = typeof endDate === 'string' ? parse(endDate, 'yyyy-MM-dd', new Date()) : endDate;
    return differenceInDays(end, start) + 1;
  },
  
  // Get today's date in YYYY-MM-DD format
  getTodayDate: () => format(new Date(), 'yyyy-MM-dd'),
  
  // Check if date is in range
  isDateInRange: (date, startDate, endDate) => {
    if (!date || !startDate || !endDate) return false;
    const d = typeof date === 'string' ? parse(date, 'yyyy-MM-dd', new Date()) : date;
    const start = typeof startDate === 'string' ? parse(startDate, 'yyyy-MM-dd', new Date()) : startDate;
    const end = typeof endDate === 'string' ? parse(endDate, 'yyyy-MM-dd', new Date()) : endDate;
    return isWithinInterval(d, { start, end });
  },
};


