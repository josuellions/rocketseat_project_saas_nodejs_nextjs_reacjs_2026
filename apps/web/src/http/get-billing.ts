import { api } from "./api-client"

interface getBillingResponse {
  result: {
    billing: {
        seats: {
            unit: number;
            amount: number;
            price: number;
        };
        projects: {
            unit: number;
            amount: number;
            price: number;
        };
        total: number;
    };
}
}

interface getBillingRequest {
  organization: string
}

export async function getBilling({organization}: getBillingRequest) {
  const { result } = await api.get(`organization/${organization}/billing`)
    .json<getBillingResponse>()

  return {billing: result.billing};
}