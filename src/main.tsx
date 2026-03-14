import { createRoot } from "react-dom/client";
import { Suspense, lazy } from "react";
import "./styles/index.css";

const App = lazy(() => import("./app/App.tsx"));

function Root() {
  return (
    <Suspense fallback={null}>
      <App />
    </Suspense>
  );
}

createRoot(document.getElementById("root")!).render(
  <Root />
);

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch(() => undefined);
  });
}
