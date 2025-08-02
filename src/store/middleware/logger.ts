import type { Middleware, Action } from "@reduxjs/toolkit";
import { RootState } from "../store";

export const logger: Middleware<{}, RootState> =
  (store) => (next) => (action: Action) => {
    if (process.env.NODE_ENV !== "production") {
      console.groupCollapsed(`Action: ${action.type}`);
      console.log("Previous State:", store.getState());
      console.info("Action Payload:", (action as any).payload);

      const result = next(action);

      console.log("Next State:", store.getState());
      console.groupEnd();
      return result;
    }

    return next(action);
  };
