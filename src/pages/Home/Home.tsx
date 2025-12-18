import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const Home = () => {
	const { isAuthenticated } = useAuth();

	if (isAuthenticated) {
		return (
			<div className="min-h-screen min-w-full flex items-center justify-center px-6 bg-background">
				<div className="text-center space-y-4">
					<h1 className="text-3xl font-bold text-green-600">
						Successfully Logged In!
					</h1>
					<p className="text-muted-foreground">Welcome back!</p>
					<NavLink to="/chat/chats">
						<Button size="lg">Go to Chats</Button>
					</NavLink>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen min-w-full flex items-center justify-center px-6 bg-background">
			<div className="max-w-3xl w-full text-center space-y-8">
				{/* Hero */}
				<div className="space-y-4">
					<h1 className="text-4xl md:text-5xl font-bold tracking-tight">
						Study. Chat. Think Better.
					</h1>
					<p className="text-muted-foreground text-lg">
						A focused chat app built for learning — with group discussions,
						favorite chats, AI summaries, and note taking in one place.
					</p>
				</div>

				{/* Actions */}
				<div className="flex flex-col sm:flex-row items-center justify-center gap-4">
					<NavLink to={"/login"}>
						<Button size="lg" className="w-full sm:w-auto">
							Sign In
						</Button>
					</NavLink>
					<NavLink to={"/signup"}>
						<Button variant="outline" size="lg" className="w-full sm:w-auto">
							Create Account
						</Button>
					</NavLink>
					<NavLink to={"/about"}>
						<Button variant="ghost" size="lg" className="w-full sm:w-auto">
							Learn More
						</Button>
					</NavLink>
				</div>

				{/* Feature Highlights */}
				<div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-8">
					<Card>
						<CardContent className="pt-6 space-y-2">
							<h3 className="font-semibold">Smart Chats</h3>
							<p className="text-sm text-muted-foreground">
								Direct, favorite, and group chats designed for study sessions.
							</p>
						</CardContent>
					</Card>

					<Card>
						<CardContent className="pt-6 space-y-2">
							<h3 className="font-semibold">AI Summaries</h3>
							<p className="text-sm text-muted-foreground">
								Turn long discussions into short, clear study notes.
							</p>
						</CardContent>
					</Card>

					<Card>
						<CardContent className="pt-6 space-y-2">
							<h3 className="font-semibold">Built-in Notes</h3>
							<p className="text-sm text-muted-foreground">
								Keep personal notes right beside your conversations.
							</p>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
};

export default Home;
