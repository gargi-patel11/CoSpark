import React, { createContext, useContext, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import OnboardingPage from "./pages/OnboardingPage";
import CallPage from "./pages/CallPage";
import ChatPage from "./pages/ChatPage";
import { axiosInstance } from "./lib/AxiosInstance";
import NotificationsPage from "./pages/NotificationsPage";
import PageLoader from "./components/PageLoader";
import useAuthUser from "./hooks/useAuthUser";
import { Toaster } from "react-hot-toast";
import Layout  from "./components/Layout"
import {useTheme} from "./context/ThemeContext.jsx"

export default function App() {
  const {theme , setTheme} = useTheme() ; 
  const { isLoading, authUser } = useAuthUser();
  const isAuthenticated = Boolean(authUser);
  const isOnboarded = authUser?.onBoarding;
  if (isLoading) return <PageLoader />;


  return (

    <div className="h-screen" data-theme={theme}>
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated && isOnboarded ? (
              <Layout activeSidebar= {true}>
                <HomePage />
              </Layout>
            ) : (
              <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
            )
          }
        ></Route>
        <Route
          path="/login"
          element={
            !isAuthenticated ? (
              <LoginPage />
            ) : (
              <Navigate to={!isOnboarded ? "/onboarding" : "/"} />
            )
          }
        >
          {" "}
        </Route>
        <Route
          path="/signUp"
          element={!isAuthenticated ? <SignUpPage /> : <Navigate to="/" />}
        >
          {" "}
        </Route>
        <Route
          path="/onboarding"
          element={
            isAuthenticated ? (
              isOnboarded ? (
                <Navigate to="/" />
              ) : (
                <OnboardingPage />
              )
            ) : (
              <Navigate to="/login" />
            )
          }
        >
          {" "}
        </Route>
        <Route
          path="/call/:id"
          element={isAuthenticated && isOnboarded ?(
            <CallPage />
          ) :(
            <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
          )}
        >
          {" "}
        </Route>
        <Route
          path="/chat/:id"
          element={isAuthenticated && isOnboarded ?(
            <Layout activeSidebar= {false} >
            <ChatPage />
            </Layout>
          ) :(
            <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
          )}
        >
        
        </Route>
        <Route
          path="/notification"
          element={
            isAuthenticated && isOnboarded ?(
              <Layout>
                <NotificationsPage />
              </Layout>
            ) :(
              <Navigate to={!isAuthenticated ?"/login" : "/onboarding" } />
            )
          }
        >
          {" "}
        </Route>
      </Routes>
      <Toaster />
    </div>

  );
}
