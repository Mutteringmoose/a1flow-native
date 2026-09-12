import { useCallback, useEffect, useState } from 'react';

import { ApiError, type ApiGetOptions } from '@/lib/api';

export type EndpointState<T> =
  | { status: 'loading' }
  | { status: 'ready'; data: T }
  | { status: 'error'; error: ApiError };

/**
 * One section, one endpoint, three states.
 *
 * `fetcher` must be stable — a module-level function, or wrapped in useCallback
 * by the caller. It is a dependency of the effect, so an inline arrow would
 * refetch on every render.
 *
 * Note what this deliberately does NOT model: empty and absent. Those are
 * properties of the payload, not of the request, and every section decides them
 * differently — a null section, a zero-length list and a tier-stripped list all
 * come back as a perfectly successful `ready`.
 */
export function useEndpoint<T>(fetcher: (options: ApiGetOptions) => Promise<T>): {
  state: EndpointState<T>;
  retry: () => void;
} {
  const [state, setState] = useState<EndpointState<T>>({ status: 'loading' });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    let active = true;

    fetcher({ signal: controller.signal })
      .then((data) => {
        if (active) setState({ status: 'ready', data });
      })
      .catch((cause: unknown) => {
        if (!active || controller.signal.aborted) return;
        setState({
          status: 'error',
          error: cause instanceof ApiError ? cause : new ApiError('network', '', String(cause)),
        });
      });

    return () => {
      active = false;
      controller.abort();
    };
  }, [attempt, fetcher]);

  // Loading is set here rather than in the effect body — calling setState
  // synchronously inside an effect cascades an extra render.
  const retry = useCallback(() => {
    setState({ status: 'loading' });
    setAttempt((n) => n + 1);
  }, []);

  return { state, retry };
}
