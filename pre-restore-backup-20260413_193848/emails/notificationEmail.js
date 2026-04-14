export const proposalReceivedEmail = (jobTitle, freelancerName) => `
  <h1>New Proposal Received</h1>
  <p>${freelancerName} has submitted a proposal for your job "${jobTitle}".</p>
  <a href="${process.env.VITE_CLIENT_URL}/jobs">View Proposals</a>
`;
