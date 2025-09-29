import { useState, useEffect, useCallback } from "react";

export interface NavigationCountsConfig {
  fetchCounts: (
    hubId: number,
    isGlobalView: boolean
  ) => Promise<Record<string, number>>;
  hubId: number;
  isGlobalView?: boolean;
  refreshInterval?: number; // in milliseconds
  enabled?: boolean;
}

export function useNavigationCounts(config: NavigationCountsConfig) {
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchCounts = useCallback(async () => {
    if (!config.enabled) return;

    try {
      setIsRefreshing(true);
      setError(null);
      const newCounts = await config.fetchCounts(
        config.hubId,
        config.isGlobalView || false
      );
      setCounts(newCounts);
    } catch (err) {
      console.error("Failed to fetch navigation counts:", err);
      setError(
        err instanceof Error ? err : new Error("Failed to fetch counts")
      );
    } finally {
      setIsRefreshing(false);
    }
  }, [config.fetchCounts, config.hubId, config.isGlobalView, config.enabled]);

  const refreshCounts = useCallback(async () => {
    await fetchCounts();
  }, [fetchCounts]);

  // Initial fetch and interval setup
  useEffect(() => {
    if (config.enabled) {
      fetchCounts();

      // Set up refresh interval if specified
      if (config.refreshInterval && config.refreshInterval > 0) {
        const interval = setInterval(fetchCounts, config.refreshInterval);
        return () => clearInterval(interval);
      }
    }
    return undefined;
  }, [fetchCounts, config.refreshInterval, config.enabled]);

  // Refetch when hubId or globalView changes
  useEffect(() => {
    if (config.enabled) {
      fetchCounts();
    }
  }, [config.hubId, config.isGlobalView, fetchCounts]);

  return {
    counts,
    isRefreshing,
    refreshCounts,
    error,
  };
}
