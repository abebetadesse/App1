export const scanMessageForOffPlatform = (text) => {
  const patterns = [
    /\b[\w\.-]+@[\w\.-]+\.\w{2,}\b/, // email
    /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/, // phone
    /\b(PayPal|Venmo|CashApp|Zelle)\b/i,
    /\b(bank|wire|transfer)\s+.*\b\d+\b/i,
    /\b(whatsapp|telegram|signal)\s+[\+\d]+\b/i
  ];
  return patterns.some(p => p.test(text));
};

export const checkProposalRateLimit = () => {
  const key = 'proposal_submissions';
  const now = Date.now();
  const timestamps = JSON.parse(localStorage.getItem(key) || '[]');
  const recent = timestamps.filter(t => now - t < 60000);
  if (recent.length >= 10) return false;
  recent.push(now);
  localStorage.setItem(key, JSON.stringify(recent));
  return true;
};
