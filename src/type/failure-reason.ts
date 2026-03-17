export interface FailureReason {
  reasonId: number;
  code: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface FailureReasonResponse {
  result: FailureReason[];
}
