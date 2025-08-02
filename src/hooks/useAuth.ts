import useMsalAuth from "./useMsalAuth";

export default function useAuth() {
  const { msalToken, loading, accounts } = useMsalAuth();
  return {
    user: msalToken && accounts.length > 0,
    loading,
  };
}
