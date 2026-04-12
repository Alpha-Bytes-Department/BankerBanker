export interface LoanQuotePrefillState {
  requestId: number;
  propertyName?: string;
  propertyAddress?: string;
  propertyType?: string;
  requestedAmount?: number;
  loanTerm?: number;
  ltv?: number;
  occupancy?: number;
  yearBuilt?: number;
  propertyImageUrl?: string;
}

const STORAGE_PREFIX = "lender-submit-quote-state-";

const getStorageKey = (requestId: number | string) =>
  `${STORAGE_PREFIX}${requestId}`;

export const getSubmitQuotePath = (requestId: number | string) =>
  `/loan-requests/${requestId}/submit-quote`;

export const saveLoanQuotePrefillState = (
  requestId: number | string,
  state: LoanQuotePrefillState,
) => {
  if (typeof window === "undefined") {
    return;
  }

  try {
    sessionStorage.setItem(getStorageKey(requestId), JSON.stringify(state));
  } catch (error) {
    console.error("Unable to save quote prefill state", error);
  }
};

export const readLoanQuotePrefillState = (
  requestId: number | string,
): LoanQuotePrefillState | null => {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = sessionStorage.getItem(getStorageKey(requestId));
    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw) as LoanQuotePrefillState;
    return parsed;
  } catch (error) {
    console.error("Unable to read quote prefill state", error);
    return null;
  }
};
