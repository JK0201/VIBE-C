// Fee configuration for Vibe Market platform
// All rates are in decimal format (e.g., 0.05 = 5%)

export const feeConfig = {
  // Base platform fee for all transactions
  platformFee: 0.05,        // 5% of transaction amount
  
  // Additional fee for urgent requests
  urgentFee: 0.02,          // 2% additional for urgent requests
  
  // Deposit rate for auction bids
  bidDepositRate: 0.01,     // 1% of bid amount as deposit
  
  // Minimum fees (in points)
  minimumFees: {
    platform: 1000,         // Minimum 1,000 points platform fee
    urgent: 500,            // Minimum 500 points urgent fee
    bidDeposit: 100         // Minimum 100 points bid deposit
  },
  
  // Fee distribution
  distribution: {
    platform: 0.7,          // 70% goes to platform
    referral: 0.2,          // 20% for referral program
    reserve: 0.1            // 10% for dispute resolution reserve
  },
  
  // Refund policies
  refund: {
    cancelBeforeAccept: 1.0,      // 100% refund if cancelled before acceptance
    cancelAfterAccept: 0.5,       // 50% refund if cancelled after acceptance
    disputeResolution: 0.8,       // 80% refund if dispute resolved in buyer's favor
    bidDepositReturn: 0.95        // 95% of bid deposit returned (5% processing fee)
  }
};

// Helper functions for fee calculations
export const calculateFees = {
  // Calculate platform fee
  platformFee: (amount, isUrgent = false) => {
    const baseFee = Math.max(
      amount * feeConfig.platformFee,
      feeConfig.minimumFees.platform
    );
    
    if (isUrgent) {
      const urgentFee = Math.max(
        amount * feeConfig.urgentFee,
        feeConfig.minimumFees.urgent
      );
      return baseFee + urgentFee;
    }
    
    return baseFee;
  },
  
  // Calculate bid deposit
  bidDeposit: (bidAmount) => {
    return Math.max(
      bidAmount * feeConfig.bidDepositRate,
      feeConfig.minimumFees.bidDeposit
    );
  },
  
  // Calculate seller's net amount
  sellerNet: (amount, isUrgent = false) => {
    const fees = calculateFees.platformFee(amount, isUrgent);
    return amount - fees;
  },
  
  // Calculate buyer's total cost
  buyerTotal: (amount, isUrgent = false) => {
    const fees = calculateFees.platformFee(amount, isUrgent);
    return amount + fees;
  }
};

// Export as default for easier importing
export default feeConfig;