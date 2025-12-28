import { useEffect, useState, useRef } from "react";
import { ArrowLeft, Send, MoreVertical, Smile } from "lucide-react";
import { io } from "socket.io-client";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { usePrivateMessages } from "../../hooks/usePrivateMessages";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

interface Message {
	id: string;
	chatId: string;
	senderEmail: string;
	senderUsername: string;
	receiverEmail: string;
	receiverUsername: string;
	message: string;
	time: string;
	isOwn?: boolean;
	createdAt?: Date;
}

const ChatFeed = () => {
	const location = useLocation();
	const navigate = useNavigate();
	const { id } = useParams(); // get partner email from URL
	const { user, isAuthenticated } = useAuth();

	// Helper function to format time in 12-hour format with AM/PM
	const formatTime12Hour = (date: Date) => {
		return date.toLocaleTimeString([], {
			hour: 'numeric',
			minute: '2-digit',
			hour12: true
		});
	};

	// Try to get partner info from location.state, else use the URL parameter
	let partnerUsername, partnerEmail;
	if (location.state?.partnerUsername && location.state?.partnerEmail) {
		partnerUsername = location.state.partnerUsername;
		partnerEmail = location.state.partnerEmail;
	} else {
		// For now, we'll use the ID as both email and username
		// In a real implementation, you'd fetch user data from your API
		partnerEmail = id || "";
		partnerUsername = id?.split("@")[0] || "Unknown User";
	}

	const currentUserEmail = user?.email || "";
	const currentUsername = user?.username || "";

	const [currentMessage, setCurrentMessage] = useState("");
	const [socket, setSocket] = useState<any>(null);
	const [isTyping, setIsTyping] = useState(false);
	const [typingTimeout, setTypingTimeout] = useState<number | null>(null);
	const [messages, setMessages] = useState<Message[]>([]);
	const [isConnected, setIsConnected] = useState(false);
	const [showEmojiPicker, setShowEmojiPicker] = useState(false);
	const [activeEmojiCategory, setActiveEmojiCategory] = useState("smileys");
	const messagesEndRef = useRef<HTMLDivElement>(null);
	const emojiPickerRef = useRef<HTMLDivElement>(null);

	// Categorized emojis with icons
	const emojiCategories = [
		{
			id: "smileys",
			name: "Smileys",
			icon: "😊",
			emojis: ["😀", "😃", "😄", "😁", "😆", "😅", "🤣", "😂", "🙂", "😉", "😊", "😇", "🥰", "😍", "🤩", "😘", "😗", "😚", "😙", "🥲", "😋", "😛", "😜", "🤪", "😝", "🤑", "🤗", "🤭", "🫢", "🤫", "🤔", "🫡", "🤐", "🤨", "😐", "😑", "😶", "🫥", "😏", "😒", "🙄", "😬", "🤥", "😌", "😔", "😪", "🤤", "😴", "😷", "🤒", "🤕", "🤢", "🤮", "🤧", "🥵", "🥶", "😶‍🌫️", "🥴", "😵", "🤯", "🤠", "🥳", "🥸", "😎", "🤓", "🧐"]
		},
		{
			id: "gestures",
			name: "Gestures",
			icon: "👋",
			emojis: ["👋", "🤚", "🖐️", "✋", "🖖", "👌", "🤌", "🤏", "✌️", "🤞", "🤟", "🤘", "🤙", "👈", "👉", "👆", "🖕", "👇", "☝️", "👍", "👎", "✊", "👊", "🤛", "🤜", "👏", "🙌", "👐", "🤲", "🤝", "🙏", "✍️", "💪", "🦵", "🦶", "👂", "🦻", "👃", "🧠", "🫀", "🫁", "🦷", "🦴", "👀", "👁️", "👅", "👄", "💋", "🩸"]
		},
		{
			id: "hearts",
			name: "Hearts",
			icon: "❤️",
			emojis: ["❤️", "🧡", "💛", "💚", "💙", "💜", "🖤", "🤍", "🤎", "💔", "❤️‍🔥", "❤️‍🩹", "❤️‍👨‍👩‍👧‍👦", "💕", "💞", "💓", "💗", "💖", "💘", "💝", "💟", "♥️", "♦️", "♣️", "♠️", "♠️", "♣️", "♥️", "♦️", "💯", "💢", "💥", "💫", "💦", "💨", "🕳️", "💣", "💬", "💭", "🗯️", "💤", "👁️‍🗨️", "🗨️", "🗯️", "💭", "💤"]
		},
		{
			id: "emotions",
			name: "Emotions",
			icon: "😢",
			emojis: ["👶", "🧒", "👦", "👧", "🧑", "👱", "👨", "🧔", "👩", "🧓", "👴", "👵", "🙍", "🙎", "🙅", "🙆", "💁", "🙋", "🧏", "🙇", "🤦", "🤷", "👨‍🦰", "👩‍🦰", "👨‍🦱", "👩‍🦱", "👨‍🦳", "👩‍🦳", "🧔", "👵", "👴", "👲", "👱‍♀️", "👱", "🧑‍🦰", "🧑‍🦱", "🧑‍🦳", "🧑‍🦲", "👱‍♀️", "👱", "😠", "😡", "🤬", "😈", "👿", "💀", "☠️", "💩", "🤡", "👹", "👺", "👻", "👽", "👾", "🤖"]
		},
		{
			id: "activities",
			name: "Activities",
			icon: "⚽",
			emojis: ["⚽", "🏀", "🏈", "⚾", "🥎", "🎾", "🏐", "🏉", "🥏", "🎱", "🪀", "🏓", "🏸", "🏒", "🏑", "🥍", "🏏", "🪃", "🥅", "⛳", "🪁", "🏹", "🎣", "🤿", "🥊", "🥋", "🎽", "🛹", "🛼", "🛷", "⛸️", "🥌", "🎿", "⛷️", "🏂", "🪂", "🏋️", "🤼", "🤸", "🤺", "⛹️", "🤾", "🏌️", "🏇", "🧘", "🏊", "🤽", "🚣", "🧗", "🚴", "🚵"]
		},
		{
			id: "symbols",
			name: "Symbols",
			icon: "⭐",
			emojis: ["⭐", "🌟", "✨", "⚡", "💥", "💫", "🔥", "💧", "🌈", "☀️", "🌙", "🌎", "🌍", "🌏", "🌐", "🌑", "🌒", "🌓", "🌔", "🌕", "🌖", "🌗", "🌘", "🌚", "🌛", "🌜", "🌝", "🌞", "⭐", "🌟", "🌠", "☁️", "⛅", "⛈️", "🌤", "🌧️", "🌨️", "❄️", "☃️", "⛄", "🌬️", "💨", "💧", "💦", "☔", "☂️", "🌊", "🌫️", "🌪️", "🌈", "🌂"]
		},
		{
			id: "animals",
			name: "Animals",
			icon: "🐶",
			emojis: ["🐶", "🐱", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼", "🐨", "🐯", "🦁", "🐮", "🐷", "🐸", "🐵", "🙈", "🙉", "🙊", "🐒", "🐔", "🐧", "🐦", "🐤", "🐣", "🐥", "🦆", "🦅", "🦉", "🦇", "🐺", "🐗", "🐴", "🦄", "🐝", "🐛", "🦋", "🐌", "🐞", "🐜", "🪲", "🪳", "🪰", "🦟", "🦗", "🕷️", "🦂", "🐢", "🐍", "🦎", "🦖", "🦕", "🐙", "🦑", "🦐", "🦞"]
		},
		{
			id: "food",
			name: "Food",
			icon: "🍕",
			emojis: ["🍕", "🍔", "🍟", "🌭", "🍿", "🧂", "🥓", "🥩", "🍗", "🍖", "🌮", "🌯", "🥙", "🥚", "🍳", "🥘", "🍲", "🥣", "🥗", "🍿", "🧈", "🧂", "🥫", "🍱", "🍘", "🍙", "🍚", "🍛", "🍜", "🍝", "🍠", "🍢", "🍣", "🍤", "🍥", "🥮", "🍡", "🥟", "🥠", "🥡", "🍦", "🍧", "🍨", "🍩", "🍪", "🎂", "🍰", "🧁", "🥧", "🍫", "🍬", "🍭", "🍮", "🍯", "🍼", "🥛", "☕", "🍵", "🍶"]
		}
	];

	// Generate chat ID (consistent ordering)
	const chatId = [currentUserEmail, partnerEmail].sort().join("_");

	// Use TanStack Query for initial messages
	const {
		isPending,
		messages: initialMessages,
		isError,
		error,
	} = usePrivateMessages(chatId);

	// Combine initial messages with real-time socket messages
	useEffect(() => {
		if (initialMessages && initialMessages.length > 0) {
			const transformedMessages: Message[] = initialMessages.map(
				(msg: any) => ({
					id: msg._id,
					chatId: msg.chatId,
					senderEmail: msg.senderEmail,
					senderUsername: msg.senderUsername,
					receiverEmail: msg.receiverEmail,
					receiverUsername: msg.receiverUsername,
					message: msg.message,
					time: msg.time || formatTime12Hour(new Date(msg.createdAt)),
					isOwn: msg.senderEmail === currentUserEmail,
					createdAt: new Date(msg.createdAt),
				}),
			);
			setMessages(transformedMessages);
		}
	}, [initialMessages, currentUserEmail]);

	// Auto-scroll to bottom when messages change
	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	};

	// Close emoji picker when clicking outside
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target as Node)) {
				setShowEmojiPicker(false);
			}
		};

		if (showEmojiPicker) {
			document.addEventListener("mousedown", handleClickOutside);
		}

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [showEmojiPicker]);

	useEffect(() => {
		scrollToBottom();
	}, [messages]);

	// Handle emoji selection
	const handleEmojiSelect = (emoji: string) => {
		setCurrentMessage(prev => prev + emoji);
		setShowEmojiPicker(false);
	};

	// Socket connection setup for real-time messaging
	useEffect(() => {
		if (!chatId || !currentUserEmail || !isAuthenticated) return;

		const newSocket = io(`${import.meta.env.VITE_BACKEND_URL}`);
		setSocket(newSocket);

		newSocket.on("connect", () => {
			setIsConnected(true);
			toast.success(`Connected to ${partnerUsername}`);
			// Join the private chat
			newSocket.emit("join_private_chat", chatId, currentUserEmail);
			newSocket.emit("user_online", currentUserEmail);
		});

		newSocket.on("disconnect", () => {
			setIsConnected(false);
			toast.error("Connection lost. Trying to reconnect...");
		});

		// Listen for incoming messages
		const handleReceiveMessage = (data: any) => {
			setMessages((prevMessages) => {
				// Check if message already exists to avoid duplicates
				const messageExists = prevMessages.some(
					(msg) =>
						msg.message === data.message &&
						msg.senderEmail === data.senderEmail &&
						msg.time === data.time,
				);

				if (messageExists) {
					return prevMessages;
				}

				const newMessage: Message = {
					id: Date.now().toString(),
					chatId: data.chatId,
					senderEmail: data.senderEmail,
					senderUsername: data.senderUsername,
					receiverEmail: data.receiverEmail,
					receiverUsername: data.receiverUsername,
					message: data.message,
					time: data.time || formatTime12Hour(new Date()),
					isOwn: data.senderEmail === currentUserEmail,
					createdAt: new Date(),
				};

				return [...prevMessages, newMessage];
			});
		};

		// Listen for typing indicators
		const handleUserTyping = (data: any) => {
			if (data.userEmail !== currentUserEmail) {
				setIsTyping(data.isTyping);
			}
		};

		newSocket.on("receive_private_message", handleReceiveMessage);
		newSocket.on("user_typing", handleUserTyping);

		// Cleanup function
		return () => {
			newSocket.off("receive_private_message", handleReceiveMessage);
			newSocket.off("user_typing", handleUserTyping);
			if (chatId) {
				newSocket.emit("leave_private_chat", chatId, currentUserEmail);
			}
			newSocket.disconnect();
		};
	}, [chatId, currentUserEmail, isAuthenticated]);

	// Handle typing indicators
	const handleTyping = () => {
		if (socket && chatId) {
			socket.emit("typing_start", {
				chatId,
				userEmail: currentUserEmail,
				username: currentUsername,
			});

			// Clear existing timeout
			if (typingTimeout) {
				window.clearTimeout(typingTimeout);
			}

			// Set new timeout to stop typing indicator
			const timeout = window.setTimeout(() => {
				socket.emit("typing_stop", {
					chatId,
					userEmail: currentUserEmail,
					username: currentUsername,
				});
			}, 1000);

			setTypingTimeout(timeout);
		}
	};

	const handleOnSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (currentMessage.trim() !== "" && socket && chatId) {
			const messageData = {
				chatId,
				senderEmail: currentUserEmail,
				senderUsername: currentUsername,
				receiverEmail: partnerEmail,
				receiverUsername: partnerUsername,
				message: currentMessage,
				time: formatTime12Hour(new Date()),
			};

			// Send message via socket - the server will echo it back
			socket.emit("send_private_message", messageData);

			// Clear input immediately
			setCurrentMessage("");

			// Stop typing indicator
			socket.emit("typing_stop", {
				chatId,
				userEmail: currentUserEmail,
				username: currentUsername,
			});

			// Clear typing timeout
			if (typingTimeout) {
				window.clearTimeout(typingTimeout);
			}
		}
	};

	// Redirect to login if not authenticated
	useEffect(() => {
		if (!isAuthenticated) {
			navigate("/login");
		}
	}, [isAuthenticated, navigate]);

	if (!isAuthenticated) {
		return null;
	}

	if (isError) {
		return (
			<div className="min-h-screen mira-content">
				<div className="flex h-[calc(100vh-4rem)] items-center justify-center">
					<div className="text-center max-w-md p-8">
						<div className="w-20 h-20 mx-auto mb-6 mira-glass rounded-2xl flex items-center justify-center">
							<span className="text-3xl">⚠️</span>
						</div>
						<h2 className="mira-title text-xl mb-4">Error Loading Messages</h2>
						<p className="text-sm text-foreground/70 mb-6">
							{error?.message || "Failed to load messages"}
						</p>
						<button
							onClick={() => window.location.reload()}
							className="mira-action-btn px-6 py-3 text-white rounded-xl transition-all"
							style={{
								background: "oklch(0.55 0.08 145)",
								boxShadow: "0 4px 20px oklch(0.55 0.08 145 / 0.3)",
							}}
						>
							Retry
						</button>
					</div>
				</div>
			</div>
		);
	}

	if (!partnerEmail || !partnerUsername) {
		return (
			<div className="min-h-screen mira-content">
				<div className="flex h-[calc(100vh-4rem)] items-center justify-center">
					<div className="text-center text-foreground max-w-md p-8">
						<div className="w-20 h-20 mx-auto mb-6 mira-glass rounded-2xl flex items-center justify-center zen-float">
							<span className="text-3xl">💬</span>
						</div>
						<h2 className="mira-title text-xl mb-4">No chat selected</h2>
						<p className="text-sm text-foreground/70 mb-6">
							Select a user to start messaging
						</p>
						<button
							onClick={() => navigate("/chat")}
							className="mira-action-btn px-6 py-3 text-white rounded-xl transition-all"
							style={{
								background: "oklch(0.55 0.08 145)",
								boxShadow: "0 4px 20px oklch(0.55 0.08 145 / 0.3)",
							}}
						>
							Go to Messages
						</button>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen mira-content">
			<div className="flex-1 flex flex-col h-[calc(100vh-4rem)]">
				{/* Header */}
				<div className="p-4 mira-glass border-b border-sidebar-border/50 rounded-b-2xl">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-3">
							<button
								onClick={() => navigate("/chat")}
								className="p-3 text-foreground/60 hover:text-foreground hover:bg-sidebar-accent/30 rounded-xl transition-all md:hidden"
							>
								<ArrowLeft size={20} />
							</button>

							<div className="relative">
								<div className="w-12 h-12 rounded-full mira-glass flex items-center justify-center border-2 border-sidebar-border">
									<span
										className="text-sm font-semibold"
										style={{ color: "oklch(0.55 0.08 145)" }}
									>
										{partnerUsername.charAt(0).toUpperCase()}
									</span>
								</div>
								<div className="absolute bottom-0 right-0 w-3 h-3 bg-primary rounded-full border-2 border-sidebar animate-pulse"></div>
							</div>

							<div>
								<h3 className="font-semibold text-foreground">
									{partnerUsername}
								</h3>
								<p className="text-xs text-foreground/60">
									{isTyping
										? "typing..."
										: isConnected
											? "Active now"
											: "Connecting..."}
								</p>
							</div>
						</div>

						<div className="flex items-center gap-2">
							<div
								className={`w-2 h-2 rounded-full ${isConnected ? "bg-primary" : "bg-destructive"}`}
							></div>
							<button className="p-3 text-foreground/60 hover:text-foreground hover:bg-sidebar-accent/30 rounded-xl transition-all">
								<MoreVertical className="w-4 h-4" />
							</button>
						</div>
					</div>
				</div>

				{/* Messages Area */}
				<div className="flex-1 overflow-y-auto p-4 bg-gradient-to-b from-background/50 to-background">
					{isPending ? (
						<div className="flex items-center justify-center h-full">
							<div className="text-center">
								<div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto"></div>
								<h1 className="text-xl font-bold text-foreground mt-4">
									Loading conversation...
								</h1>
							</div>
						</div>
					) : messages.length === 0 ? (
						<div className="flex items-center justify-center h-full">
							<div className="text-center p-8 max-w-md">
								<div className="w-20 h-20 mx-auto mb-6 rounded-2xl flex items-center justify-center mira-glass">
									<span className="text-3xl">👋</span>
								</div>
								<h3 className="mira-title text-xl mb-4">Start a conversation</h3>
								<p className="text-sm text-foreground/70 leading-relaxed">
									Send your first message to {partnerUsername}
								</p>
							</div>
						</div>
					) : (
						<div className="space-y-6 max-w-5xl mx-auto">
							{messages.map((msg, index) => (
								<div
									key={`${msg.senderEmail}-${msg.time}-${msg.id}`}
									className={`group ${msg.isOwn ? "flex justify-end" : "flex justify-start"} animate-fadeIn`}
									style={{ animationDelay: `${index * 50}ms` }}
								>
									<div className={`flex gap-4 max-w-lg lg:max-w-2xl ${msg.isOwn ? "flex-row-reverse" : "flex-row"}`}>
										{/* Avatar */}
										<div className="relative flex-shrink-0">
											<div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
												<span className="text-lg font-bold text-primary-foreground">
													{msg.isOwn ? currentUsername.charAt(0).toUpperCase() : partnerUsername.charAt(0).toUpperCase()}
												</span>
											</div>
											{!msg.isOwn && (
												<div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-background"></div>
											)}
										</div>

										{/* Message Content */}
										<div className={`flex-1 min-w-0 ${msg.isOwn ? "text-right" : "text-left"}`}>
											{/* Header with Author and Time */}
											<div className="flex items-center gap-3 mb-2">
												<span className="font-semibold text-foreground text-sm leading-tight">
													{msg.isOwn ? "You" : msg.senderUsername}
												</span>
												<span className="text-xs text-foreground/50 font-medium bg-background/50 px-2 py-1 rounded-full">
													{msg.time}
												</span>
											</div>

											{/* Message Bubble */}
											<div
												className={`relative inline-block px-5 py-4 rounded-2xl shadow-sm group-hover:shadow-md transition-shadow ${
													msg.isOwn
														? "bg-gradient-to-br from-primary to-primary/90 text-primary-foreground rounded-br-none"
														: "mira-glass rounded-bl-none border border-border/50"
												}`}
											>
												{!msg.isOwn && (
													<div className="absolute -left-2 top-4 w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-r-8 border-r-sidebar-accent/30"></div>
												)}
												{msg.isOwn && (
													<div className="absolute -right-2 top-4 w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-l-8 border-l-primary"></div>
												)}
												<p className="text-base leading-relaxed break-words">
													{msg.message}
												</p>
											</div>

											{/* Message Status for own messages */}
											{msg.isOwn && (
												<div className="flex items-center gap-1 mt-2 justify-end">
													<span className="text-xs text-primary/60">✓ Sent</span>
												</div>
											)}
										</div>
									</div>
								</div>
							))}
							{isTyping && (
								<div className="flex justify-start">
									<div className="flex gap-4 max-w-lg lg:max-w-2xl">
										<div className="relative flex-shrink-0">
											<div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center shadow-lg">
												<span className="text-lg font-bold text-primary-foreground">
													{partnerUsername.charAt(0).toUpperCase()}
												</span>
											</div>
											<div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-background"></div>
										</div>
										<div className="flex-1">
											<div className="flex items-center gap-3 mb-2">
												<span className="font-semibold text-foreground text-sm">
													{partnerUsername}
												</span>
											</div>
											<div className="mira-glass rounded-2xl rounded-bl-none border border-border/50 px-5 py-4 inline-block shadow-sm">
												<div className="flex space-x-1">
													<div
														className="w-2 h-2 rounded-full animate-bounce"
														style={{ backgroundColor: "oklch(0.55 0.08 145)" }}
													></div>
													<div
														className="w-2 h-2 rounded-full animate-bounce"
														style={{
															backgroundColor: "oklch(0.55 0.08 145)",
															animationDelay: "0.1s",
														}}
													></div>
													<div
														className="w-2 h-2 rounded-full animate-bounce"
														style={{
															backgroundColor: "oklch(0.55 0.08 145)",
															animationDelay: "0.2s",
														}}
													></div>
												</div>
											</div>
										</div>
									</div>
								</div>
							)}
							<div ref={messagesEndRef} />
						</div>
					)}
				</div>

				{/* Message Input */}
				<div className="mira-glass border-t border-sidebar-border bg-gradient-to-b from-background/95 to-background/80 backdrop-blur-xl">
					<div className="container mx-auto p-4">
						{/* Connection Status */}
						<div className="flex items-center justify-between mb-3">
							<div className="flex items-center gap-2">
								<div className={`relative`}>
									<div className={`w-2.5 h-2.5 rounded-full ${isConnected ? "bg-green-500 shadow-lg shadow-green-500/50" : "bg-destructive"} ${isConnected ? "animate-pulse" : ""}`}></div>
									{isConnected && <div className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-green-500 animate-ping opacity-75"></div>}
								</div>
								<span className="text-xs text-muted-foreground font-medium">
									{isConnected ? `💬 Chat with ${partnerUsername}` : "🔄 Connecting..."}
								</span>
							</div>
							<div className={`text-xs font-medium ${currentMessage.length >= 450 ? 'text-destructive' : currentMessage.length >= 350 ? 'text-amber-500' : 'text-muted-foreground'}`}>
								{currentMessage.length}/500
							</div>
						</div>

						<form onSubmit={handleOnSubmit} className="space-y-3">
							<div className="flex items-end gap-2">
								{/* Emoji Button */}
								<div className="relative" ref={emojiPickerRef}>
									<Button
										type="button"
										variant="ghost"
										size="sm"
										onClick={() => setShowEmojiPicker(!showEmojiPicker)}
										className={`h-11 w-11 rounded-2xl transition-all duration-300 relative overflow-hidden ${
											showEmojiPicker
												? "text-foreground bg-gradient-to-br from-primary/20 to-accent/20 border-2 border-primary/30 shadow-lg shadow-primary/20"
												: "text-muted-foreground hover:text-foreground hover:bg-gradient-to-br hover:from-primary/10 hover:to-accent/10 border-2 border-transparent hover:border-primary/20"
										}`}
									>
										{showEmojiPicker && (
											<div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 animate-pulse"></div>
										)}
										<Smile className="w-5 h-5 relative z-10" />
									</Button>

									{/* Enhanced Emoji Picker Popover */}
									{showEmojiPicker && (
										<div className="absolute bottom-14 left-0 z-50 w-80 mira-glass border border-border/50 rounded-3xl shadow-2xl bg-background/95 backdrop-blur-xl animate-in fade-in slide-in-from-bottom-3 duration-300 overflow-hidden">
											{/* Header with gradient */}
											<div className="bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 px-4 py-3 border-b border-border/50">
												<div className="flex items-center justify-between">
													<div className="flex items-center gap-2">
														<span className="text-xl">😊</span>
														<h3 className="font-semibold text-foreground text-sm">Emoji Picker</h3>
													</div>
													<button
														type="button"
														onClick={() => setShowEmojiPicker(false)}
														className="p-1 rounded-lg hover:bg-destructive/10 hover:text-destructive transition-all text-muted-foreground"
													>
														<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
															<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
														</svg>
													</button>
												</div>
											</div>

											{/* Category Tabs */}
											<div className="flex gap-1 p-2 overflow-x-auto border-b border-border/30 scrollbar-thin">
												{emojiCategories.map((category) => (
													<button
														key={category.id}
														type="button"
														onClick={() => setActiveEmojiCategory(category.id)}
														className={`flex-shrink-0 p-2 rounded-xl transition-all duration-200 group ${
															activeEmojiCategory === category.id
																? "bg-gradient-to-br from-primary to-accent text-white shadow-lg scale-105"
																: "hover:bg-accent/50 text-muted-foreground hover:text-foreground"
														}`}
														title={category.name}
													>
														<span className="text-lg">{category.icon}</span>
													</button>
												))}
											</div>

											{/* Emoji Grid */}
											<div className="p-3 max-h-64 overflow-y-auto">
												<div className="grid grid-cols-8 gap-1.5">
													{emojiCategories.find(cat => cat.id === activeEmojiCategory)?.emojis.map((emoji, index) => (
														<button
															key={index}
															type="button"
															onClick={() => handleEmojiSelect(emoji)}
															className="aspect-square text-xl flex items-center justify-center rounded-xl hover:bg-gradient-to-br hover:from-primary/20 hover:to-accent/20 transition-all duration-200 transform hover:scale-110 active:scale-95 border border-transparent hover:border-primary/30"
															title={emoji}
														>
															{emoji}
														</button>
													))}
												</div>
											</div>

											{/* Footer */}
											<div className="px-3 py-2 bg-muted/30 border-t border-border/30">
												<div className="flex items-center justify-between text-xs text-muted-foreground">
													<span className="flex items-center gap-1">
														<span>💡</span>
														Click an emoji to add it
													</span>
													<span className="font-medium">
														{emojiCategories.find(cat => cat.id === activeEmojiCategory)?.name}
													</span>
												</div>
											</div>
										</div>
									)}
								</div>

								{/* Message Input */}
								<div className="flex-1 relative group">
									<div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 rounded-2xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 blur-lg"></div>
									<textarea
										value={currentMessage}
										onChange={(e) => {
											if (e.target.value.length <= 500) {
												setCurrentMessage(e.target.value);
												handleTyping();
											}
										}}
										placeholder={`Message ${partnerUsername}...`}
										className="relative w-full min-h-[48px] max-h-40 px-5 py-3.5 pr-16 rounded-2xl resize-none mira-glass border-2 border-border/50 focus:border-primary/50 focus:border-primary/50 focus:ring-4 focus:ring-primary/10 text-base placeholder:text-muted-foreground/50 transition-all duration-300 shadow-sm"
										rows={1}
										onKeyDown={(e) => {
											if (e.key === 'Enter' && !e.shiftKey) {
												e.preventDefault();
												handleOnSubmit(e);
											}
										}}
										style={{
											height: 'auto',
											minHeight: '48px'
										}}
										onInput={(e) => {
											const target = e.target as HTMLTextAreaElement;
											target.style.height = 'auto';
											target.style.height = Math.min(target.scrollHeight, 160) + 'px';
										}}
									/>
									{currentMessage.length > 300 && (
										<div className="absolute right-4 bottom-3 z-10">
											<div className={`px-2 py-1 rounded-lg text-xs font-bold backdrop-blur-sm ${
												currentMessage.length >= 500
													? 'bg-destructive/20 text-destructive'
													: 'bg-amber-500/20 text-amber-500'
											}`}>
												{500 - currentMessage.length}
											</div>
										</div>
									)}
								</div>

								{/* Enhanced Send Button */}
								<Button
									type="submit"
									disabled={!currentMessage.trim() || !isConnected || currentMessage.length >= 500}
									className="h-11 px-5 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground rounded-2xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center gap-2 shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 hover:scale-105 active:scale-95 relative overflow-hidden group"
								>
									<div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
									<Send size={18} className="relative z-10 transition-transform duration-300 group-hover:translate-x-1" />
									{currentMessage.trim() && <span className="hidden sm:inline relative z-10">Send</span>}
								</Button>
							</div>
						</form>

						{/* Typing Indicator */}
						{isTyping && (
							<div className="mt-3 px-4 py-2.5 mira-glass border border-primary/20 rounded-xl inline-flex items-center gap-3 text-sm text-primary animate-in fade-in slide-in-from-left-2 duration-300">
								<div className="flex space-x-1.5">
									<div className="w-2 h-2 rounded-full bg-primary animate-bounce shadow-lg shadow-primary/50"></div>
									<div className="w-2 h-2 rounded-full bg-primary animate-bounce shadow-lg shadow-primary/50" style={{ animationDelay: '0.15s' }}></div>
									<div className="w-2 h-2 rounded-full bg-primary animate-bounce shadow-lg shadow-primary/50" style={{ animationDelay: '0.3s' }}></div>
								</div>
								<span className="font-medium">{partnerUsername} is typing</span>
							</div>
						)}

						{/* Enhanced Help Text */}
						<div className="mt-3 px-4 py-2.5 rounded-xl bg-muted/30 border border-border/30">
							<div className="flex items-center justify-between text-xs">
								<span className="text-muted-foreground flex items-center gap-1.5">
									<span className="text-base">💡</span>
									<span className="font-medium">Press Enter to send, Shift+Enter for new line</span>
								</span>
								<div className="flex items-center gap-2 text-muted-foreground">
									<div className="w-px h-3 bg-border"></div>
									<span className="font-medium">Be thoughtful and respectful</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ChatFeed;
