import React from "react";
import { BrowserRouter } from "react-router-dom";
import { I18nProvider } from "./i18n/I18nContext";
import { ToastProvider } from "./context/ToastContext";
import { ConfirmProvider } from "./context/ConfirmContext";

import AdminRoutes from "./routes/AdminRoutes";
import AuthRoute from "./routes/AuthRoute";
import TeacherRoutes from "./routes/TeacherRoutes";

export default function App() {
  return (
    <I18nProvider>
      <ToastProvider>
        <ConfirmProvider>
          <BrowserRouter>
              <AuthRoute/>

              <AdminRoutes/>
              
              <TeacherRoutes/>
          </BrowserRouter>
        </ConfirmProvider>
      </ToastProvider>
    </I18nProvider>
  );
}
