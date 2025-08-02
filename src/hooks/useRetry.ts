import { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { fetchUsers } from "../store/thunks/thunks";

export const useRetry = (maxRetries = 5, initialDelay = 1000) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<unknown | null>(null);
  const [remainingAttempts, setRemainingAttempts] =
    useState<number>(maxRetries);
  const dispatch = useDispatch();

  const executeWitRetry = useCallback(async () => {
    setLoading(true);

    try {
      await dispatch(fetchUsers() as any);
    } catch (err: any) {
      setError(err);

      if (remainingAttempts > 0) {
        const delay =
          initialDelay * Math.pow(2, maxRetries - remainingAttempts);
        setTimeout(() => {
          setRemainingAttempts((prev) => prev - 1);
          executeWitRetry();
        }, delay);
      } else {
        console.warn("Max retries exceeded");
      }
    } finally {
      setLoading(false);
    }
  }, [maxRetries, initialDelay, remainingAttempts]);

  return { loading, error, executeWitRetry, remainingAttempts };
};
