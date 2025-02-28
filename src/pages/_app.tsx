import { store } from "@/store";
// import "@/styles/globals.css";
import "swiper/css";
import "swiper/css/bundle";
import "swiper/css/navigation"; // If you're using navigation
import "swiper/css/pagination";
import "../styles/globals.css";
import "../styles/index.css";
import type { AppProps } from "next/app";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistStore } from "redux-persist";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { HelmetProvider } from "react-helmet-async"; // Add this line

const persistor = persistStore(store);
export default function App({ Component, pageProps }: AppProps) {
  return (
    <GoogleOAuthProvider clientId="770907976815-d2mc4qlnkl3b6scd1kd8uu3udjeii8dn.apps.googleusercontent.com">
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <HelmetProvider>
            <Component {...pageProps} />
          </HelmetProvider>
        </PersistGate>
      </Provider>
    </GoogleOAuthProvider>
  );
}
