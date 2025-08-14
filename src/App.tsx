
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MapsProvider } from "./context/MapsContext";
import { AuthProvider, ProtectedRoute } from "./context/AuthContext";
import Index from "./pages/Index";
import Search from "./pages/Search";
import PropertyDetail from "./pages/PropertyDetail";
import SubmitListing from "./pages/SubmitListing";
import HomeOwnersPage from "./pages/HomeOwnersPage";
import AgentDetail from "./pages/AgentDetail";
import AgentPropertyManagement from "./pages/AgentPropertyManagement";
import ArtisansPage from "./pages/ArtisansPage";
import ArtisanDetail from "./pages/ArtisanDetail";
import NotFound from "./pages/NotFound";
import HomeOwnerLogin from "./pages/HomeOwnerLogin";
import AgentDashboard from "./pages/AgentDashboard";
import ApplyAgent from "./pages/ApplyAgent";
import ApplyArtisan from "./pages/ApplyArtisan";
import SuperAdminLogin from "./pages/SuperAdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import EstateLogin from "./pages/EstateLogin";
import EstateManagement from "./pages/EstateManagement";
import StaffLogin from "./pages/StaffLogin";
import StaffDashboard from "./pages/StaffDashboard";
import TestFirebase from "./pages/TestFirebase";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <MapsProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Index />} />
              <Route path="/search" element={<Search />} />
              <Route path="/property/:id" element={<PropertyDetail />} />
              <Route path="/home-owners" element={<HomeOwnersPage />} />
              <Route path="/home-owners/:id" element={<AgentDetail />} />
              <Route path="/artisans" element={<ArtisansPage />} />
              <Route path="/artisans/:id" element={<ArtisanDetail />} />
              
              {/* Auth routes */}
              <Route path="/home-owner-login" element={<HomeOwnerLogin />} />
              <Route path="/super-admin-login" element={<SuperAdminLogin />} />
              <Route path="/estate-login" element={<EstateLogin />} />
              <Route path="/staff-login" element={<StaffLogin />} />
              <Route path="/apply-home-owner" element={<ApplyAgent />} />
              <Route path="/apply-artisan" element={<ApplyArtisan />} />
              <Route path="/test-firebase" element={<TestFirebase />} />

              {/* Protected routes */}
              <Route 
                path="/submit-listing" 
                element={
                  <ProtectedRoute allowedRoles={['home_owner']} requireApproval>
                    <SubmitListing />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/home-owners/:id/properties" 
                element={
                  <ProtectedRoute allowedRoles={['home_owner', 'admin', 'staff']}>
                    <AgentPropertyManagement />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/home-owner-dashboard" 
                element={
                  <ProtectedRoute allowedRoles={['home_owner']} requireApproval>
                    <AgentDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin-dashboard" 
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/estate-management" 
                element={
                  <ProtectedRoute allowedRoles={['estate_manager']}>
                    <EstateManagement />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/staff-dashboard" 
                element={
                  <ProtectedRoute allowedRoles={['staff']}>
                    <StaffDashboard />
                  </ProtectedRoute>
                } 
              />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </MapsProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
