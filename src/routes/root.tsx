//* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useMsal } from "@azure/msal-react";
import { logoutThunk } from "../store/thunks/thunks";
import PageLayout, { IPageLayout } from "../Pages/PageLayout/PageLayout";
import { paths } from "../utils/paths";
import type { AppDispatch, RootState } from "../store";
import { fetchUserRoles } from "../store/thunks/thunks";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

export default function Root() {
  const { instance } = useMsal();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const msalToken = useSelector((state: RootState) => state.msal.msal);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        if (msalToken) {
          const decodedToken: any = jwtDecode(msalToken);
          const entraID = decodedToken?.oid;
          const roles = await dispatch(fetchUserRoles(entraID) as any);
          const isAdminRole = roles.payload.includes("Admin");
          setIsAdmin(isAdminRole);
        } else {
          setIsAdmin(false);
        }
      } catch (error) {
        console.error("Error fetching roles:", error);
        setIsAdmin(false);
      }
    };

    fetchRoles();
  }, [dispatch, instance, msalToken]);

  useEffect(() => {
    if (isAdmin === false && window.location.pathname === "/my_portal") {
      navigate("/");
    }
  }, [isAdmin, navigate]);

  const handleLogout = () => {
    dispatch(logoutThunk(instance));
  };

  if (isAdmin === null) {
    return <div></div>;
  }

  const pageLayoutProps: IPageLayout = {
    navigationProps: {
      paths: paths,
      handlerFunctions: {
        handleLogout: handleLogout,
      },
      isAdmin: true,
    },
    isAdmin: true,
  };

  return <PageLayout {...pageLayoutProps} />;
}
