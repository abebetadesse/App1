const bannedPatterns = [
  /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, // email
  /\b(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}\b/g, // phone
  /paypal|venmo|cashapp|zelle|wire transfer|off platform|outside upwork/gi
];

const fraudDetection = (message) => {
  for (const pattern of bannedPatterns) {
    if (pattern.test(message)) {
      return { flagged: true, reason: 'Contact information detected' };
    }
  }
  return { flagged: false };
};

module.exports = { fraudDetection };
