export async function apiRequest(endpoint: string, method: string, body?: any, contentType: 'json' | 'form' = 'json') {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  let headers: HeadersInit = {
    'Accept': 'application/json',
  };

  let bodyContent: string | null = null;

  if (contentType === 'json') {
    headers['Content-Type'] = 'application/json';
    bodyContent = JSON.stringify(body);
  } else if (contentType === 'form') {
    headers['Content-Type'] = 'application/x-www-form-urlencoded';
    // Converts the body object into URL-encoded format
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
  
}
