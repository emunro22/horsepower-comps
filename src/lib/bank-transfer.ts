// Manual bank transfer details shown to customers at checkout while no card
// processor is active. Update/remove this once a card processor (e.g.
// Cashflows) is live.
export const BANK_TRANSFER_DETAILS = {
  accountName: "Derek's Account",
  sortCode: '60-84-07',
  accountNumber: '18378264',
};

function randomReference(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let ref = '';
  for (let i = 0; i < 6; i++) {
    ref += chars[Math.floor(Math.random() * chars.length)];
  }
  return `HPC-${ref}`;
}

export function generatePaymentReference(): string {
  return randomReference();
}
