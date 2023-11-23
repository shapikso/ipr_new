import React from 'react';
import { Routes, Route } from "react-router-dom";
import MainPage from "./pages/Main/MainPage";
import Videos from "./pages/Videos/Videos";
import Layout from "./commponents/Layout/Layout";

function App() {

  return (
      <Layout >
          <Routes>
              <Route path="/" element={<MainPage />} />
              <Route path="/videos" element={<Videos />} />
          </Routes>
     </Layout>

  )
}

export default App
