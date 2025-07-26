# React MSAL SSO Application

This is a modern React application built with Vite, demonstrating a robust and secure authentication flow using the Microsoft Authentication Library (MSAL) for React. It enables Single Sign-On (SSO) with Microsoft Entra ID (Azure AD), allowing users to sign in with their Microsoft work or personal accounts.

The project features a clean architecture with centralized API handling via Axios interceptors and state management powered by Redux Toolkit.

## ✨ Key Features

-   **Microsoft SSO Integration:** Secure user authentication against Microsoft Entra ID.
-   **Automated Token Handling:** Axios interceptors automatically attach authentication tokens to outgoing API requests.
-   **Automatic Token Refresh:** Interceptors handle token expiration and silent renewal without interrupting the user.
-   **Protected Routes:** A clear separation between public and private parts of the application.
-   **Centralized State Management:** Uses Redux Toolkit for a predictable and scalable state container.
-   **Blazing Fast Development:** Built with Vite for near-instant server startup and Hot Module Replacement (HMR).
-   **Type-Safe Codebase:** Written entirely in TypeScript.

## 🛠️ Tech Stack

-   **Framework:** [React](https://reactjs.org/)
-   **Build Tool:** [Vite](https://vitejs.dev/)
-   **Authentication:** [Microsoft Authentication Library (MSAL) for React](https://github.com/AzureAD/microsoft-authentication-library-for-js)
-   **API Client:** [Axios](https://axios-http.com/)
-   **State Management:** [Redux Toolkit](https://redux-toolkit.js.org/) & [React-Redux](https://react-redux.js.org/)
-   **Language:** [TypeScript](https://www.typescriptlang.org/)
-   **Styling:** SCSS Modules

---

## 🚀 Getting Started

Follow these instructions to set up and run the project locally.

### Prerequisites

-   [Node.js](https://nodejs.org/) (version 18.x or higher is recommended)
-   [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
-   An active **Microsoft Azure subscription**.
-   An **App Registration** in Microsoft Entra ID to get the necessary client and tenant IDs.

### 1. Clone the Repository

```bash
git clone https://github.com/iasonasxrist/react-msal-sso-app.git
cd react-msal-sso-app
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

You need to create a `.env` file in the root of the project. Copy the example file and fill in the values from your Azure App Registration portal.

First, copy the example file:

```bash
cp .env.example .env
```

Now, open the `.env` file and add your specific credentials. It should look like this:

```env
# .env

# Your Application (client) ID from Azure App Registration
VITE_CLIENT_ID="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"

# Your Directory (tenant) ID from Azure App Registration
VITE_TENANT_ID="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"

# The Redirect URI configured in your Azure App Registration (e.g., http://localhost:5173)
VITE_REDIRECTION_URL="http://localhost:5173"

# The base URL for your backend API
VITE_BACKEND="https://your-api-endpoint.com/api"

# API Scopes defined in your App Registration's "Expose an API" section
VITE_SCOPES="api://xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/Your.Scope"
```

**Important:** Do not commit your `.env` file to version control. The `.gitignore` file should already be configured to ignore it.

### 4. Run the Development Server

```bash
npm run dev
```

The application should now be running on `http://localhost:5173` (or another port if 5173 is busy).

---

## 🔐 Authentication Flow Explained

This project uses a robust interceptor-based approach to manage authentication tokens.

1.  **Login:** When a user logs in, `msalInstance` handles the redirect to Microsoft's login page and securely stores the session details.
2.  **API Request:** When the application makes an API call with `axioSign`, the **request interceptor** automatically triggers.
3.  **Token Acquisition:** The interceptor calls `msalInstance.acquireTokenSilent()`. MSAL efficiently retrieves a valid access token from its cache without prompting the user.
4.  **Authorization Header:** The interceptor injects the token into the `Authorization: Bearer <token>` header of the API request.
5.  **Handling 401 Errors:** If an API call fails with a 401 Unauthorized error (e.g., token expired), the **response interceptor** catches it. It attempts to refresh the token silently and automatically retries the original request with the new token. If refreshing fails, it logs the user out.

This flow ensures that the React components remain clean and are not cluttered with authentication logic.

## 📜 Available Scripts

-   `npm run dev`: Starts the development server with HMR.
-   `npm run build`: Compiles and bundles the application for production.
-   `npm run lint`: Lints the codebase for errors and style issues.
-   `npm run preview`: Serves the production build locally to preview it.
