/* eslint-disable no-unused-vars */
export const SEARCH_CONSTANTS = {
  SORT_OPTIONS: [
    { value: 'relevance', label: 'Most Relevant', icon: '🎯' },
    { value: 'rating', label: 'Highest Rated', icon: '⭐' },
    { value: 'experience', label: 'Most Experienced', icon: '💼' },
    { value: 'price_low', label: 'Price: Low to High', icon: '💰' },
    { value: 'price_high', label: 'Price: High to Low', icon: '💰' },
    { value: 'newest', label: 'Newest First', icon: '🆕' }
  ],

  AVAILABILITY_OPTIONS: [
    { value: 'immediate', label: 'Immediate', description: 'Available now' },
    { value: '1_week', label: 'Within 1 week', description: 'Available in 1 week' },
    { value: '2_weeks', label: 'Within 2 weeks', description: 'Available in 2 weeks' },
    { value: '1_month', label: 'Within 1 month', description: 'Available in 1 month' },
    { value: 'any', label: 'Any availability', description: 'No restriction' }
  ],

  EXPERIENCE_LEVELS: [
    { value: 0, label: 'Any experience' },
    { value: 1, label: '1+ years' },
    { value: 3, label: '3+ years' },
    { value: 5, label: '5+ years' },
    { value: 10, label: '10+ years' }
  ],

  PRICE_RANGES: [
    { min: 0, max: 25, label: 'Under $25/hr' },
    { min: 25, max: 50, label: '$25 - $50/hr' },
    { min: 50, max: 100, label: '$50 - $100/hr' },
    { min: 100, max: 200, label: '$100 - $200/hr' },
    { min: 200, max: 500, label: '$200+/hr' }
  ],

  RESPONSE_TIME_OPTIONS: [
    { value: 'instant', label: 'Instant', description: 'Within minutes' },
    { value: '1h', label: '1 hour', description: 'Within 1 hour' },
    { value: '4h', label: '4 hours', description: 'Within 4 hours' },
    { value: '24h', label: '24 hours', description: 'Within 24 hours' },
    { value: 'any', label: 'Any', description: 'No restriction' }
  ],

  DISTANCE_OPTIONS: [
    { value: 10, label: '10 km' },
    { value: 25, label: '25 km' },
    { value: 50, label: '50 km' },
    { value: 100, label: '100 km' },
    { value: 250, label: '250 km' },
    { value: 500, label: '500 km' },
    { value: 0, label: 'Anywhere' }
  ]
};

export const DEFAULT_SEARCH_FILTERS = {
  serviceCategory: '',
  minExperience: 0,
  maxHourlyRate: 500,
  availability: 'any',
  location: '',
  distance: 50,
  minRating: 0
};