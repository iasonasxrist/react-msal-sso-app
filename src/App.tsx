import { useEffect } from "react";

import useMsalAuth from "./hooks/useMsalAuth";
import LoadingSpinner from "./Components/ui/LoadingSpinner/LoadingSpinner";
import MyRouter from "./routes/router";
import styles from "./scss_setup/initialSetup.module.scss";
import {
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
} from "@azure/msal-react";
import { initializeMsalInstance } from "./utils/msalInstance";
import { setAxiosAuthInterceptor } from "./api/axiosInstance";

const App = () => {
  const { loading, accounts } = useMsalAuth(); //use Custom logic to provide accounts and loading state

  useEffect(() => {
    const initializeMsal = async () => {
      try {
        await initializeMsalInstance();
      } catch (error) {
        console.error("MSAL initialization error");
      }
    };

    initializeMsal();

    if (accounts.length > 0) {
      setAxiosAuthInterceptor(accounts[0]);
    }
  }, [accounts]);

  if (loading) {
    // return <LoadingSpinner />;
  }

  return (
    <div className={styles.initialSetup}>
      {accounts.length > 0 ? (
        <AuthenticatedTemplate>
          <>{/* <MyRouter /> */}</>
        </AuthenticatedTemplate>
      ) : (
        <UnauthenticatedTemplate>
          {/* <LoadingSpinner /> */}
        </UnauthenticatedTemplate>
      )}
    </div>
  );
};

export default App;
