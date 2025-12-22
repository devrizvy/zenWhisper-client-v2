import { Outlet, Navigate } from "react-router-dom";
import { AppSidebar } from "@/components/app-sidebar";
import {
	SidebarTrigger,
	SidebarInset,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Search, Plus, Moon, Sun, FileText, MessageSquare, Users, HelpCircle, BookOpen } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Layout() {
	const { theme, toggleTheme } = useTheme();
	const { isAuthenticated, isLoading } = useAuth();
	const navigate = useNavigate();

	// Show loading screen while checking authentication
	if (isLoading) {
		return (
			<div className="min-h-screen mira-content flex items-center justify-center">
				<div className="text-center">
					<div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto"></div>
					<p className="mt-4 text-muted-foreground">Loading...</p>
				</div>
			</div>
		);
	}

	// Redirect to login if not authenticated
	if (!isAuthenticated) {
		return <Navigate to="/login" replace />;
	}

	return (
		<>
			<AppSidebar />
			<SidebarInset className="mira-content">
				{/* Enhanced Header */}
				<header className="mira-header flex h-16 shrink-0 items-center gap-4 px-6 border-b">
					<SidebarTrigger className="mira-action-btn text-muted-foreground hover:text-foreground p-2 rounded-lg" />

					{/* Search Bar */}
					<div className="flex-1 max-w-md">
						<div className="relative">
							<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
							<Input
								type="text"
								placeholder="Search conversations, notes, or people..."
								className="pl-10 pr-4 mira-search"
							/>
						</div>
					</div>

					{/* Right Actions */}
					<div className="flex items-center gap-2">
						{/* New Quick Action Menu */}
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button
									variant="ghost"
									size="icon"
									className="mira-action-btn text-muted-foreground hover:text-foreground"
								>
									<Plus className="w-4 h-4" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end" className="w-48">
								<DropdownMenuItem onClick={() => navigate("/notes")} className="cursor-pointer">
									<FileText className="mr-2 h-4 w-4" />
									<span>New Note</span>
								</DropdownMenuItem>
								<DropdownMenuItem onClick={() => navigate("/chat/users")} className="cursor-pointer">
									<MessageSquare className="mr-2 h-4 w-4" />
									<span>New Chat</span>
								</DropdownMenuItem>
								<DropdownMenuItem onClick={() => navigate("/group")} className="cursor-pointer">
									<Users className="mr-2 h-4 w-4" />
									<span>Join Group</span>
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>

						{/* Help Menu - replaces fake notification bell */}
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button
									variant="ghost"
									size="icon"
									className="mira-action-btn text-muted-foreground hover:text-foreground"
								>
									<HelpCircle className="w-4 h-4" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end" className="w-48">
								<DropdownMenuItem onClick={() => navigate("/docs")} className="cursor-pointer">
									<BookOpen className="mr-2 h-4 w-4" />
									<span>Documentation</span>
								</DropdownMenuItem>
								<DropdownMenuItem onClick={() => navigate("/faq")} className="cursor-pointer">
									<HelpCircle className="mr-2 h-4 w-4" />
									<span>FAQ</span>
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>

						{/* Theme Toggle */}
						<Button
							variant="ghost"
							size="icon"
							onClick={toggleTheme}
							className="mira-action-btn text-muted-foreground hover:text-foreground"
						>
							{theme === 'dark' ? (
								<Sun className="w-4 h-4" />
							) : (
								<Moon className="w-4 h-4" />
							)}
						</Button>
					</div>
				</header>

				{/* Enhanced Main Content Area */}
				<main className="flex-1 overflow-hidden flex flex-col">
					{/* Content Container with better spacing for chat */}
					<div className="flex-1 flex flex-col min-h-0 mira-scrollbar">
						<Outlet />
					</div>
				</main>
			</SidebarInset>
		</>
	);
}
