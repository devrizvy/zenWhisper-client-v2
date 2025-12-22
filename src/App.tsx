import { Route, Routes } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider } from "./contexts/AuthContext";
import { Toaster } from "react-hot-toast";
import About from "./pages/About/About";
import Home from "./pages/Home/Home";
import Layout from "./Layout/MainLayout";
import PublicLayout from "./Layout/PublicLayout";
import Favorites from "./pages/Favorites/Favorites";
import Group from "./pages/Group/Group";
import Notes from "./pages/Notes/Notes";
import AISummary from "./pages/AISummary/AISummary";
import Chats from "./pages/Chats/Chats";
import Login from "./pages/Login/Login";
import Signup from "./pages/Signup/Signup";
import Settings from "./pages/Settings/Settings";
import Docs from "./pages/Docs/Docs";
import FAQ from "./pages/FAQ/FAQ";
import Overview from "./pages/Overview/Overview";

export function App() {
	return (
		<ThemeProvider>
			<AuthProvider>
				<Routes>
					{/* Public routes without layout */}
					<Route index element={<Home />} />
					<Route path="/about" element={<About />} />
					<Route path="/login" element={<Login />} />
					<Route path="/signup" element={<Signup />} />

					{/* Public routes with PublicLayout (docs, faq) */}
					<Route path="/docs" element={<PublicLayout />}>
						<Route index element={<Docs />} />
					</Route>
					<Route path="/faq" element={<PublicLayout />}>
						<Route index element={<FAQ />} />
					</Route>

					{/* Protected routes with MainLayout */}
					<Route path="/" element={<Layout />}>
						<Route path="favorites" element={<Favorites />} />
						<Route path="chat/*" element={<Chats />} />
						<Route path="group/*" element={<Group />} />
						<Route path="notes" element={<Notes />} />
						<Route path="ai-summary" element={<AISummary />} />
						<Route path="settings" element={<Settings />} />
						<Route path="overview" element={<Overview />} />
					</Route>
				</Routes>
				<Toaster
					position="top-right"
					toastOptions={{
						duration: 4000,
						style: {
							background: 'var(--background)',
							color: 'var(--foreground)',
							border: '1px solid var(--border)',
							borderRadius: 'var(--radius)',
						},
						success: {
							iconTheme: {
								primary: 'oklch(0.55 0.08 145)',
								secondary: 'var(--background)',
							},
						},
						error: {
							iconTheme: {
								primary: 'oklch(0.60 0.18 25)',
								secondary: 'var(--background)',
							},
						},
					}}
				/>
			</AuthProvider>
		</ThemeProvider>
	);
}

export default App;
