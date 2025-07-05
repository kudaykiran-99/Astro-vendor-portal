import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Dashboard from "../dashboard/Dashboard";
import PrivateRoutes from "./PrivateRoutes";
import LayoutWithDashboard from "./LayoutWithDashboard";
import Login from "../auth/Login";
import PageNotFound from "../pageNotFound/PageNotFound";
import MainDashboard from '../dashboard/newDashboard/MainDashboard';
import Form2 from "../dashboard/approvedVendor/Form2"
import Form3 from '../dashboard/poDetails/Form3';
import Form1 from '../dashboard/vendorRegistration/Form1';
import CustomLayout from "../../components/DKG_CustomLayout";

const RoutesComponent = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route element={<CustomLayout />}>
          <Route path="/vendor/:vendorId" element={<Form2 />} />
          <Route path="purchaseOrder" element={<Form3 />} />
        </Route>
        <Route element={<PrivateRoutes />}>
          <Route path="/app" element={<LayoutWithDashboard/>}>
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<MainDashboard />} />
            {/* <Route path="approvedVendor/:vendorId" element={<Form2 />} /> */}
          </Route>
        </Route>
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default RoutesComponent;