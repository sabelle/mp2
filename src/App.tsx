import { Route, Routes } from "react-router-dom";

import ListPage from "./pages/ListPage";
import DetailPage from "./pages/DetailPage";

import "./App.css";

function App() {
  return (
    <Routes>
      <Route path="/" element={<ListPage />} />

      <Route
        path="/cocktails/:id"
        element={<DetailPage />}
      />
    </Routes>
  );
}

export default App;