/**
 * Proxy for STS checklist API. Forwards requests to the main app (Oceane-Marine)
 * to avoid CORS when frontend and backend run on different origins/ports.
 */
const BACKEND =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  'http://localhost:3000/api/operations/sts-checklist';

export async function POST(request, context) {
  const params = await Promise.resolve(context.params || {});
  const pathSegment = Array.isArray(params.path) ? params.path.join('/') : '';
  const url = pathSegment ? `${BACKEND}/${pathSegment}` : BACKEND;

  const contentType = request.headers.get('content-type') || '';

  const fetchOptions = {
    method: 'POST',
    headers: {},
    body: request.body,
    duplex: 'half',
  };
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
