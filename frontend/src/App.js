import { BrowserRouter, Routes, Route } from "react-router-dom";

import Landing from "./pages/Landing";
import Setup from "./pages/Setup";
import Loading from "./pages/Loading";
import Dashboard from "./pages/Dashboard";
import BatchResults from "./pages/BatchResults";
import PlgResults from "./pages/PlgResults";
import PlgLoading from "./pages/PlgLoading";

import "./App.css";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/setup" element={<Setup />} />
        <Route path="/loading" element={<Loading />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/batch-results" element={<BatchResults />} />
        <Route path="/plg-results" element={<PlgResults />} />
        <Route path="/plg-loading" element={<PlgLoading />} />
      </Routes>
    </BrowserRouter>
  );
}