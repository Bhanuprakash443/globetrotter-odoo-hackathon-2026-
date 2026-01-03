/**
 * Formatting utility functions
 */
export const formatUtils = {
  // Format currency
  formatCurrency: (amount, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount || 0);
  },
  
  // Format number
  formatNumber: (num) => {
    return new Intl.NumberFormat('en-US').format(num || 0);
  },
  
  // Truncate text
  truncate: (text, length = 100) => {
    if (!text) return '';
    if (text.length <= length) return text;
    return text.substring(0, length) + '...';
  },
  
  // Capitalize first letter
  capitalize: (str) => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  },
  
  // Get status badge color
  getStatusColor: (status) => {
    const colors = {
      upcoming: 'bg-blue-100 text-blue-700',
      ongoing: 'bg-yellow-100 text-yellow-700',
      completed: 'bg-green-100 text-green-700',
      cancelled: 'bg-red-100 text-red-700',
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  },
};


