import React from "react";

import Layout from "./components/layout/layout,";
import Dashboard from "./view/Dashboard";
import States from "./view/States";
import { Route, Routes } from "react-router";
import Cities from "./view/Cities";
import Places from "./view/Places";
import Foods from "./view/Foods";

const App = () => {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/states" element={<States />} />
        <Route path="/cities" element={<Cities />} />
        <Route path="/places" element={<Places />} />
        <Route path="/foods" element={<Foods />} />
      </Routes>
    </Layout>
  );
};

export default App;
