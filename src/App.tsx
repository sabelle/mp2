import { Route, Routes } from "react-router-dom";

import ListPage from "./pages/ListPage";
import DetailPage from "./pages/DetailPage";
import NotFoundPage from "./pages/NotFoundPage";

import "./App.css";

function App() {
  return (
    <Routes>
      <Route path="/" element={<ListPage />} />
      <Route
        path="/cocktails/:id"
        element={<DetailPage />}
      />
      <Route path="/404" element={<NotFoundPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;