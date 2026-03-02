import config from "@/lib/config-env";

interface CreatePaymentParams {
  name: string;
  email: string;
  amount: number;
  mobile: string;
  description: string;
  redirectURL: string;
  expiredAt: string; // ISO 8601
}

interface MayarPaymentResponse {
  statusCode: number;
  messages: string;
  data: {
    id: string;
    transactionId: string;
    link: string;
  };
}

const MAYAR_BASE_URL = "https://api.mayar.id/hl/v1";

export async function createMayarPayment(
  params: CreatePaymentParams,
): Promise<MayarPaymentResponse> {
  const response = await fetch(`${MAYAR_BASE_URL}/payment/create`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.env.mayarApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Mayar API error: ${response.status} - ${errorText}`);
  }

  return response.json();
}
