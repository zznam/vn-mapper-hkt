import { useState, useEffect, useCallback } from 'react';
import { ICoordinate, IHouse } from '../../../../packages/core/src/mock-data';
import { API_BASE_URL } from '../config/api';

export interface MapData {
  route: ICoordinate[];
  houses: IHouse[];
}

export interface UseMapDataResult {
  data: MapData | null;
  isLoading: boolean;
  error: string | null;
  retry: () => void;
}

const MAX_RETRIES = 3;
const INITIAL_BACKOFF_MS = 800;

async function fetchMapData(signal: AbortSignal): Promise<MapData> {
  // Fetch route coords and houses in parallel
  const [routeRes, housesRes] = await Promise.all([
    fetch(`${API_BASE_URL}/api/routes`, { signal }),
    fetch(`${API_BASE_URL}/api/houses?limit=100`, { signal }),
  ]);

  if (!routeRes.ok) {
    throw new Error(`Routes API responded with ${routeRes.status}`);
  }
  if (!housesRes.ok) {
    throw new Error(`Houses API responded with ${housesRes.status}`);
  }

  const [routeJson, housesJson] = await Promise.all([routeRes.json(), housesRes.json()]);

  return {
    route: routeJson.coordinates as ICoordinate[],
    houses: housesJson.items as IHouse[],
  };
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function useMapData(): UseMapDataResult {
  const [data, setData] = useState<MapData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const retry = useCallback(() => {
    setError(null);
    setIsLoading(true);
    setRetryCount((c) => c + 1);
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    let cancelled = false;

    const load = async () => {
      setIsLoading(true);
      setError(null);

      let lastError: string = 'Unknown error';
      for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
        if (cancelled) return;

        try {
          const result = await fetchMapData(controller.signal);
          if (!cancelled) {
            setData(result);
            setIsLoading(false);
          }
          return;
        } catch (err: unknown) {
          if (controller.signal.aborted) return;

          lastError =
            err instanceof Error ? err.message : 'Không thể kết nối máy chủ';

          if (attempt < MAX_RETRIES - 1) {
            const backoff = INITIAL_BACKOFF_MS * Math.pow(2, attempt);
            await sleep(backoff);
          }
        }
      }

      if (!cancelled) {
        setError(lastError);
        setIsLoading(false);
      }
    };

    load();

    return () => {
      cancelled = true;
      controller.abort();
    };
  // retryCount is an incrementing counter that re-triggers the effect on retry()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [retryCount]);

  return { data, isLoading, error, retry };
}
