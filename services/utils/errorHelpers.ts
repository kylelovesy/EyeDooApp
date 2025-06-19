// Create services/utils/errorHelpers.ts
export class ServiceError extends Error {
    constructor(
      public service: string,
      public operation: string,
      public originalError: any,
      message?: string
    ) {
      super(message || `${service}: ${operation} failed`);
    }
  }