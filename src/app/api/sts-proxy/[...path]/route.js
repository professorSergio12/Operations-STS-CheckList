/**
 * Proxy for STS checklist API. Forwards requests to the main app (Oceane-Marine)
 * to avoid CORS when frontend and backend run on different origins/ports.
 */
const BACKEND =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  'http://localhost:3000/api/operations/sts-checklist';

async function handleRequest(request, context, method) {
  const params = await Promise.resolve(context.params || {});
  const pathSegment = Array.isArray(params.path) ? params.path.join('/') : '';
  
  // Get query params from request URL
  const requestUrl = new URL(request.url);
  const queryString = requestUrl.search;
  
  const url = pathSegment 
    ? `${BACKEND}/${pathSegment}${queryString}` 
    : `${BACKEND}${queryString}`;

  const contentType = request.headers.get('content-type') || '';

  const fetchOptions = {
    method: method,
    headers: {},
    duplex: 'half',
  };
  
  // Only add body for POST and PUT
  if (method === 'POST' || method === 'PUT') {
    fetchOptions.body = request.body;
  }
  
  if (contentType) {
    fetchOptions.headers['Content-Type'] = contentType;
  }

  try {
    const res = await fetch(url, fetchOptions);
    const text = await res.text();
    let data;
    try {
      data = text ? JSON.parse(text) : {};
    } catch {
      data = { error: res.statusText || 'Invalid response from server' };
    }
    return Response.json(data, { status: res.status });
  } catch (err) {
    console.error('[sts-proxy]', err);
    return Response.json(
      {
        error:
          err.message ||
          'Cannot reach the main app. Is Oceane-Marine running at ' +
            BACKEND +
            '?',
      },
      { status: 502 }
    );
  }
}

export async function GET(request, context) {
  return handleRequest(request, context, 'GET');
}

export async function POST(request, context) {
  return handleRequest(request, context, 'POST');
}

export async function PUT(request, context) {
  return handleRequest(request, context, 'PUT');
}
