import React, { useState, useEffect } from "react";
import {
	Eye,
	EyeOff,
	Shield,
	CheckCircle,
	AlertCircle,
	UserPlus,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate, NavLink } from "react-router-dom";
import api from "../../services/axios";

interface ValidationState {
	email: boolean;
	password: boolean;
	username: boolean;
}

const Signup: React.FC = () => {
	const { isAuthenticated } = useAuth();
	const navigate = useNavigate();
	const [showPassword, setShowPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<string | null>(null);
	const [formData, setFormData] = useState({
		username: "",
		email: "",
		password: "",
		confirmPassword: "",
	});
	const [validation, setValidation] = useState<ValidationState>({
		email: false,
		password: false,
		username: false,
	});

	// Redirect if already authenticated
	useEffect(() => {
		if (isAuthenticated) {
			navigate("/chat/chats");
		}
	}, [isAuthenticated, navigate]);

	const validateEmail = (email: string) => {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailRegex.test(email);
	};

	const validatePassword = (password: string) => {
		return password.length >= 6;
	};

	const validateUsername = (username: string) => {
		return username.length >= 3 && username.length <= 20;
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));

		// Real-time validation
		switch (name) {
			case "email":
				setValidation((prev) => ({ ...prev, email: validateEmail(value) }));
				break;
			case "password":
				setValidation((prev) => ({
					...prev,
					password: validatePassword(value),
				}));
				break;
			case "username":
				setValidation((prev) => ({
					...prev,
					username: validateUsername(value),
				}));
				break;
		}

		setError(null);
		setSuccess(null);
	};

	const getPasswordStrength = (password: string) => {
		if (password.length === 0)
			return { strength: 0, color: "text-sidebar-foreground/40", label: "" };
		if (password.length < 6)
			return { strength: 1, color: "text-red-600", label: "Weak" };
		if (password.length < 10)
			return { strength: 2, color: "text-yellow-600", label: "Fair" };
		if (password.length < 14)
			return { strength: 3, color: "text-blue-600", label: "Good" };
		return { strength: 4, color: "text-green-600", label: "Strong" };
	};

	const passwordStrength = getPasswordStrength(formData.password);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		// Validation
		if (
			!formData.username ||
			!formData.email ||
			!formData.password ||
			!formData.confirmPassword
		) {
			setError("Please fill in all fields");
			return;
		}

		if (!validateEmail(formData.email)) {
			setError("Please enter a valid email address");
			return;
		}

		if (!validatePassword(formData.password)) {
			setError("Password must be at least 6 characters long");
			return;
		}

		if (!validateUsername(formData.username)) {
			setError("Username must be between 3 and 20 characters");
			return;
		}

		if (formData.password !== formData.confirmPassword) {
			setError("Passwords do not match");
			return;
		}

		setIsLoading(true);
		setError(null);

		try {
			// Call your backend signup endpoint
			await api.post("/signup", {
				username: formData.username,
				email: formData.email,
				password: formData.password,
			});

			setSuccess("Account created successfully! Redirecting to login...");

			// Auto-login after successful signup
			setTimeout(() => {
				navigate("/login");
			}, 2000);
		} catch (err: any) {
			if (err.response?.data?.message) {
				setError(err.response.data.message);
			} else {
				setError("Connection error. Please try again.");
			}
			console.error("Signup error:", err);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="min-h-screen min-w-full zen-pattern chat-container flex items-center justify-center p-6">
			<div className="w-full max-w-md">
				{/* Logo and title */}
				<div className="text-center mb-8">
					<div className="w-16 h-16 glass-panel rounded-2xl flex items-center justify-center mx-auto mb-4">
						<UserPlus
							className="w-8 h-8"
							style={{ color: "oklch(0.55 0.08 145)" }}
						/>
					</div>
					<h1 className="zen-title text-3xl mb-2">Join zenWhisper</h1>
					<p className="text-sidebar-foreground/60 text-sm">
						Create your account for educational collaboration
					</p>
				</div>

				{/* Signup form */}
				<div className="glass-panel rounded-2xl p-8">
					<form onSubmit={handleSubmit} className="space-y-5">
						{/* Username field */}
						<div className="space-y-2">
							<label className="text-sidebar-foreground text-sm font-medium flex items-center justify-between">
								<span>Username</span>
								{formData.username &&
									(validation.username ? (
										<CheckCircle className="w-4 h-4 text-green-600" />
									) : (
										<AlertCircle className="w-4 h-4 text-red-600" />
									))}
							</label>
							<input
								type="text"
								name="username"
								value={formData.username}
								onChange={handleChange}
								placeholder="Choose a username"
								className="w-full px-4 py-3 zen-search rounded-xl text-sidebar-foreground placeholder-sidebar-foreground/40 focus:outline-none transition-all"
								disabled={isLoading}
							/>
							{formData.username && (
								<p className="text-xs text-sidebar-foreground/60">
									{validation.username
										? "Username available"
										: "3-20 characters required"}
								</p>
							)}
						</div>

						{/* Email field */}
						<div className="space-y-2">
							<label className="text-sidebar-foreground text-sm font-medium flex items-center justify-between">
								<span>Email Address</span>
								{formData.email &&
									(validation.email ? (
										<CheckCircle className="w-4 h-4 text-green-600" />
									) : (
										<AlertCircle className="w-4 h-4 text-red-600" />
									))}
							</label>
							<input
								type="email"
								name="email"
								value={formData.email}
								onChange={handleChange}
								placeholder="Enter your email"
								className="w-full px-4 py-3 zen-search rounded-xl text-sidebar-foreground placeholder-sidebar-foreground/40 focus:outline-none transition-all"
								disabled={isLoading}
							/>
							{formData.email && (
								<p className="text-xs text-sidebar-foreground/60">
									{validation.email
										? "Valid email address"
										: "Please enter a valid email"}
								</p>
							)}
						</div>

						{/* Password field */}
						<div className="space-y-2">
							<label className="text-sidebar-foreground text-sm font-medium flex items-center justify-between">
								<span>Password</span>
								{formData.password &&
									(validation.password ? (
										<CheckCircle className="w-4 h-4 text-green-600" />
									) : (
										<AlertCircle className="w-4 h-4 text-red-600" />
									))}
							</label>
							<div className="relative">
								<input
									type={showPassword ? "text" : "password"}
									name="password"
									value={formData.password}
									onChange={handleChange}
									placeholder="Create a password"
									className="w-full px-4 py-3 zen-search rounded-xl text-sidebar-foreground placeholder-sidebar-foreground/40 focus:outline-none transition-all pr-12"
									disabled={isLoading}
								/>
								<button
									type="button"
									onClick={() => setShowPassword(!showPassword)}
									className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sidebar-foreground/60 hover:text-sidebar-foreground transition-colors"
								>
									{showPassword ? (
										<EyeOff className="w-4 h-4" />
									) : (
										<Eye className="w-4 h-4" />
									)}
								</button>
							</div>
							{formData.password && (
								<div className="space-y-1">
									<div className="flex items-center gap-2">
										<div className="flex gap-1">
											{[...Array(4)].map((_, i) => (
												<div
													key={i}
													className={`h-1 w-6 rounded-full transition-all ${
														i < passwordStrength.strength
															? "bg-current"
															: "bg-sidebar-accent/30"
													} ${passwordStrength.color}`}
												/>
											))}
										</div>
										<span className={`text-xs ${passwordStrength.color}`}>
											{passwordStrength.label}
										</span>
									</div>
									<p className="text-xs text-sidebar-foreground/60">
										Minimum 6 characters
									</p>
								</div>
							)}
						</div>

						{/* Confirm password field */}
						<div className="space-y-2">
							<label className="text-sidebar-foreground text-sm font-medium">
								Confirm Password
							</label>
							<div className="relative">
								<input
									type={showPassword ? "text" : "password"}
									name="confirmPassword"
									value={formData.confirmPassword}
									onChange={handleChange}
									placeholder="Confirm your password"
									className="w-full px-4 py-3 zen-search rounded-xl text-sidebar-foreground placeholder-sidebar-foreground/40 focus:outline-none transition-all"
									disabled={isLoading}
								/>
								{formData.confirmPassword &&
									formData.password === formData.confirmPassword && (
										<div className="absolute right-3 top-1/2 transform -translate-y-1/2">
											<CheckCircle className="w-4 h-4 text-green-600" />
										</div>
									)}
							</div>
							{formData.confirmPassword && (
								<p className="text-xs text-sidebar-foreground/60">
									{formData.password === formData.confirmPassword
										? "Passwords match"
										: "Passwords do not match"}
								</p>
							)}
						</div>

						{/* Error/Success message */}
						{error && (
							<div className="p-3 bg-red-50 border border-red-200 rounded-lg">
								<p className="text-red-600 text-sm">{error}</p>
							</div>
						)}

						{success && (
							<div className="p-3 bg-green-50 border border-green-200 rounded-lg">
								<p className="text-green-600 text-sm flex items-center gap-2">
									<CheckCircle className="w-4 h-4" />
									{success}
								</p>
							</div>
						)}

						{/* Submit button */}
						<button
							type="submit"
							disabled={
								isLoading ||
								!validation.email ||
								!validation.password ||
								!validation.username
							}
							className="w-full py-3 px-4 font-medium rounded-xl zen-action-btn disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
							style={{
								background: "oklch(0.55 0.08 145)",
								boxShadow: "0 4px 20px oklch(0.55 0.08 145 / 0.3)",
							}}
						>
							{isLoading ? (
								<>
									<div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
									<span>Creating account...</span>
								</>
							) : (
								<>
									<span>Create Account</span>
								</>
							)}
						</button>
					</form>

					{/* Security note */}
					<div className="mt-6 pt-6 zen-separator">
						<div className="flex items-center justify-center gap-2 text-sidebar-foreground/60 text-xs">
							<Shield className="w-3 h-3" />
							<span>Your data is secure and protected</span>
						</div>
					</div>
				</div>

				{/* Login link */}
				<div className="text-center mt-8">
					<p className="text-sidebar-foreground/60 text-sm">
						Already have an account?{" "}
						<NavLink
							to="/login"
							className="text-primary hover:text-primary-foreground transition-colors font-medium"
						>
							Sign in here
						</NavLink>
					</p>
				</div>
			</div>
		</div>
	);
};

export default Signup;
