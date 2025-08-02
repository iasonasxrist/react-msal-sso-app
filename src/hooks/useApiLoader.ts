import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { LoadingStatus } from "../types/LoadingStatusEnum";

export const useApiLoader = () => {
  const dispatch = useDispatch();
  const [loadingStatus, setLoadingStatus] = useState<LoadingStatus>(
    LoadingStatus.idle
  );
  const [loadingError, setLoadingError] = useState<string | undefined>(
    undefined
  );
  const navigate = useNavigate();
  const apiCall = useCallback(async (thunkFunction: any, payload?: any) => {
    try {
      setLoadingStatus(LoadingStatus.loading);
      const response = await dispatch(
        thunkFunction(payload ?? undefined) as any
      );
      console.log("Approval bypass accepted with response");
      if (thunkFunction.fulfilled.match(response)) {
        console.log("Approval Response data");
        setLoadingStatus(LoadingStatus.success);
      } else {
        console.log("Approval Response Error occurred");
        const errorData = response?.payload;

        const errorMessage = errorData?.errors
          ? Object.values(errorData.errors).flat().join(", ")
          : errorData?.message || "An unexpected error occurred.";

        setLoadingError(errorMessage);
        setLoadingStatus(LoadingStatus.error);
      }
    } catch (error) {
      console.error("Error accepting approval bypass");
    }
  }, []);

  const onFinishAnimation = useCallback(
    (navigationPath?: string | undefined) => {
      setLoadingError(undefined);
      setLoadingStatus(LoadingStatus.idle);
      if (navigationPath) {
        navigate(navigationPath);
      } else {
        navigate(0);
      }
    },
    []
  );

  return {
    loadingStatus,
    loadingError,
    apiCall,
    onFinishAnimation,
  };
};
