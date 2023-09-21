import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App"
import * as serviceWorkerRegistration from "./serviceWorkerRegistration"
import { BrowserRouter } from "react-router-dom"
import "./i18n"
import { Provider } from "react-redux"
import "./index.css"
import store from "./store"
import SessionProvider from "context/sessionContext"
import AttendanceProvider from "context/attendanceContext"

const root = ReactDOM.createRoot(document.getElementById("root"))
root.render(
  <Provider store={store}>
    <SessionProvider>
      <AttendanceProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </AttendanceProvider>
    </SessionProvider>
  </Provider>
)
serviceWorkerRegistration.register()
