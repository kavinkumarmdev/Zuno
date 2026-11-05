import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { LoginPage } from '../pages/auth/LoginPage';
import { RegisterPage } from '../pages/auth/RegisterPage';
import { DashboardPage } from '../pages/dashboard/DashboardPage';
import { ModuleHubPage } from '../pages/modules/ModuleHubPage';
import { ModulesOverviewPage } from '../pages/modules/ModulesOverviewPage';
import { SubscriptionsPage } from '../pages/subscriptions/SubscriptionsPage';
import { ReportStudioPage } from '../pages/reports/ReportStudioPage';
import { HistoryPage } from '../pages/history/HistoryPage';
import { ErrorBoundary } from '../components/ui/ErrorBoundary';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
    errorElement: <ErrorBoundary />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
    errorElement: <ErrorBoundary />,
  },
  {
    path: '/',
    element: <AppLayout />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: 'dashboard',
        element: <DashboardPage />,
      },
      {
        path: 'modules/subscriptions',
        element: <SubscriptionsPage />,
      },
      {
        path: 'modules/reports',
        element: <ReportStudioPage />,
      },
      {
        path: 'modules',
        element: <ModulesOverviewPage />,
      },
      {
        path: 'modules/:moduleKey',
        element: <ModuleHubPage />,
      },
      {
        path: 'history',
        element: <HistoryPage />,
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/dashboard" replace />,
  },
]);

