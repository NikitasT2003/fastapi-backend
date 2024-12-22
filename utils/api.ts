export async function apiRequest<T>(
  endpoint: string,
  method: string,
  body?: any,
  contentType: 'json' | 'form' = 'json'
): Promise<T> {
  const baseUrl = process.env.NEXT_PUBLIC_VERCEL_URL;

  if (!baseUrl) {
    throw new Error('NEXT_PUBLIC_VERCEL_URL is not defined');
  }

  let headers: HeadersInit = {
    'Accept': 'application/json',
  };

  let bodyContent: string | null = null;

  if (contentType === 'json') {
    headers['Content-Type'] = 'application/json';
    bodyContent = JSON.stringify(body);
  } else if (contentType === 'form') {
    headers['Content-Type'] = 'application/x-www-form-urlencoded';
    bodyContent = new URLSearchParams(body).toString();
  }

  const response = await fetch(`${baseUrl}${endpoint}`, {
    method,
    headers,
    body: bodyContent,
  });

  if (!response.ok) {
    let errorData;
    try {
      errorData = await response.json(); // Attempt to parse JSON
    } catch {
      errorData = null; // If parsing fails, set to null
    }
    throw new Error(errorData?.detail || 'An error occurred');
  }

  try {
    return await response.json(); // Return the parsed JSON
  } catch {
    throw new Error('Failed to parse JSON response');
  }
}
