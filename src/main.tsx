// import React from 'react'
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { NextUIProvider } from "@nextui-org/react";
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
import { ClerkProvider } from "@clerk/clerk-react";
import { ThemeProvider } from "./components/ui/theme-provider.tsx";
import { Toaster } from "@/components/ui/sonner";
import  ReactGA  from "react-ga4";

// Initialize React Ga with your tracking ID
ReactGA.initialize("G-3CT50SR1N7");

ReactGA.send({ hitType: "pageview", page:window.location.pathname, title: "Big" });

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <NextUIProvider>
      <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
        <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
          <Toaster position="top-center" />
          <App />
        </ThemeProvider>
      </ClerkProvider>
    </NextUIProvider>
  </BrowserRouter>
);
