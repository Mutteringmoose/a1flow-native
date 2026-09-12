import * as SecureStore from 'expo-secure-store';

/**
 * A1 Flow API client.
 *
 * Native calls execute-api directly. The web app calls relative `/api/*` and
 * Vercel rewrites `/api/:path*` -> `<base>/:path*`, verified in the web repo's
 * vercel.json — so a web path maps to a native path by dropping `/api`.
 */
export const API_BASE_URL = 'https://tqbn8alhp5.execute-api.us-east-2.amazonaws.com/prod';

/** Cognito ID token, not the access token — only the ID token carries email (§13.2). */
const ID_TOKEN_KEY = 'a1_id_token';

const TIMEOUT_MS = 10_000;

export type ApiErrorKind =
  /** Never reached the gateway — offline, DNS, TLS. */
  | 'network'
  /** Reached nothing within TIMEOUT_MS. */
  | 'timeout'
  /** 401. Token absent, expired, or rejected. */
  | 'unauthorized'
  /** 4xx other than 401. Our bug or a bad path. */
  | 'client'
  /** 5xx. Their bug. Retryable. */
  | 'server'
  /** 2xx whose body was not the JSON we expected. */
  | 'parse';

export class ApiError extends Error {
  readonly kind: ApiErrorKind;
  readonly status?: number;
  readonly path: string;

  constructor(kind: ApiErrorKind, path: string, message: string, status?: number) {
    super(message);
    this.name = 'ApiError';
    this.kind = kind;
    this.status = status;
    this.path = path;
  }

  /** One factual sentence, for the error states §4 asks for. No blame, no advice. */
  get userMessage(): string {
    switch (this.kind) {
      case 'network':
        return 'No connection.';
      case 'timeout':
        return 'Request timed out.';
      case 'unauthorized':
        return 'Session expired.';
      case 'server':
        return 'Service unavailable.';
      case 'client':
      case 'parse':
        return 'Data unavailable.';
    }
  }
}

/**
 * Reads the stored ID token. Never throws: a token that cannot be read
 * degrades the call to anonymous, matching the web client's semantics.
 *
 * A missing token is not an error and not a tier signal — free reader routes
 * are deliberately unauthenticated and return the free-tier payload shape with
 * HTTP 200 either way. Tier truth comes from GET /auth/me, never from whether
 * a token existed here (§13.2 — this was a live bug on web).
 */
async function readIdToken(): Promise<string | null> {
  try {
    return await SecureStore.getItemAsync(ID_TOKEN_KEY);
  } catch {
    return null;
  }
}

/** Gateway 404s are `{message}`; our Lambdas' errors are `{error}`. Accept both. */
function extractServerMessage(body: string): string | null {
  try {
    const parsed: unknown = JSON.parse(body);
    if (parsed && typeof parsed === 'object') {
      const record = parsed as Record<string, unknown>;
      for (const key of ['error', 'message'] as const) {
        if (typeof record[key] === 'string' && record[key]) {
          return record[key] as string;
        }
      }
    }
  } catch {
    // Not JSON. Fall through — the status code is the useful part.
  }
  return null;
}

export type ApiGetOptions = {
  /** Caller cancellation, e.g. a screen unmounting. Composed with the timeout. */
  signal?: AbortSignal;
};

/**
 * GET a JSON endpoint. `path` is relative to the stage, with or without a
 * leading slash: `apiGet('/home/dashboard')`.
 */
export async function apiGet<T>(path: string, options: ApiGetOptions = {}): Promise<T> {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  const url = `${API_BASE_URL}${normalized}`;

  const token = await readIdToken();

  // One controller fed by two sources — the timeout and the caller — because
  // AbortSignal.any is not dependable across the Hermes versions we target.
  const controller = new AbortController();
  let timedOut = false;
  // Set the flag before aborting, never in a second timer — two timers racing
  // means the abort can land while timedOut is still false and a timeout gets
  // reported as a network failure.
  const timer = setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, TIMEOUT_MS);

  const abortFromCaller = () => controller.abort();
  options.signal?.addEventListener('abort', abortFromCaller);

  let response: Response;
  try {
    response = await fetch(url, {
      method: 'GET',
      signal: controller.signal,
      headers: {
        Accept: 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
  } catch (cause) {
    // A caller-initiated abort is not an API failure — let it propagate so
    // callers can ignore it the way they ignore any cancellation.
    if (options.signal?.aborted) {
      throw cause;
    }
    throw new ApiError(
      timedOut ? 'timeout' : 'network',
      normalized,
      timedOut ? `GET ${normalized} timed out after ${TIMEOUT_MS}ms` : `GET ${normalized} failed to reach the network`
    );
  } finally {
    clearTimeout(timer);
    options.signal?.removeEventListener('abort', abortFromCaller);
  }

  if (!response.ok) {
    const raw = await response.text().catch(() => '');
    const detail = extractServerMessage(raw) ?? response.statusText;
    const kind: ApiErrorKind =
      response.status === 401 ? 'unauthorized' : response.status >= 500 ? 'server' : 'client';
    throw new ApiError(kind, normalized, `GET ${normalized} -> ${response.status} ${detail}`, response.status);
  }

  try {
    return (await response.json()) as T;
  } catch {
    throw new ApiError('parse', normalized, `GET ${normalized} returned a body that was not JSON`, response.status);
  }
}
