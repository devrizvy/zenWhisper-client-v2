import { useEffect, useState, useRef } from "react";
import { ArrowLeft, Send, Users, LogOut, Settings, Zap, Smile } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useSocketChat } from "../../hooks/useSocketChat";
import { Button } from "@/components/ui/button";
import useRoomMessages from "../../hooks/useRoomMessages";
import toast from "react-hot-toast";

interface RoomMessage {
	id: string;
	roomId: string;
	room: string;
	author: string;
	message: string;
	time: string;
	isOwn?: boolean;
	isSystem?: boolean;
	createdAt?: Date;
}

const RoomChat = () => {
	const navigate = useNavigate();
	const { id } = useParams();
	const location = useLocation();
	const { user, isAuthenticated } = useAuth();
	const username = user?.username || "";
	const userEmail = user?.email || "";

	const [message, setMessage] = useState("");
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

	// Use useSocketChat hook for socket functionality
	const {
		isConnected,
		roomMessages,
		sendRoomMessage,
		joinRoom,
		leaveRoom: socketLeaveRoom,
		getMessagesForRoom,
	} = useSocketChat({
		userEmail,
		username,
		autoConnect: true,
	});

	// Use useRoomMessages hook for initial message loading
	const { isPending, messages: initialMessages, isError, error } = useRoomMessages(id || "");
	const [messages, setMessages] = useState<RoomMessage[]>([]);

	// Get room name from location state or localStorage
	const roomName =
		location.state?.roomName ||
		localStorage.getItem("currentRoomName") ||
		"Neural Hub";

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
		setMessage(prev => prev + emoji);
		setShowEmojiPicker(false);
	};

	// Join room when connected and room info is available
	useEffect(() => {
		if (isConnected && id && username) {
			joinRoom(id);
			toast.success(`Connected to ${roomName}`);
		}
	}, [isConnected, id, username, roomName, joinRoom]);

	// Update messages when initialMessages are loaded (this runs once)
	useEffect(() => {
		if (initialMessages && initialMessages.length > 0) {
			const formattedMessages: RoomMessage[] = initialMessages.map((msg: any) => ({
				id: msg._id || Date.now().toString(),
				roomId: msg.roomId || id || "",
				room: roomName,
				author: msg.author || "Unknown",
				message: msg.message || "",
				time: formatTime12Hour(new Date(msg.createdAt)),
				isOwn: msg.author === username,
				isSystem: false,
				createdAt: new Date(msg.createdAt),
			}));
			setMessages(formattedMessages);
		} else if (!isPending && !isError) {
			// Add welcome message if no messages exist
			const welcomeMessage: RoomMessage = {
				id: Date.now().toString(),
				roomId: id || "",
				room: roomName,
				author: "System",
				message: `🚀 Welcome to the ${roomName} classroom`,
				time: formatTime12Hour(new Date()),
				isSystem: true,
				createdAt: new Date(),
			};
			setMessages([welcomeMessage]);
		}
	}, [initialMessages, id, roomName, username, user?.email, isPending, isError]);

	// Add new socket messages to existing messages
	useEffect(() => {
		const socketMessages = getMessagesForRoom(id || "");
		// Only process if we have new socket messages that aren't already in our state
		if (socketMessages.length > 0) {
			setMessages((prevMessages) => {
				const existingMessageIds = new Set(prevMessages.map(msg => msg.id));
				const newMessages = socketMessages
					.filter(msg => !existingMessageIds.has(msg.id))
					.map((msg) => ({
						id: msg.id,
						roomId: msg.roomId,
						room: roomName,
						author: msg.author,
						message: msg.message,
						time: msg.time,
						isOwn: msg.isOwn || msg.author === username,
						isSystem: msg.isSystem,
						createdAt: msg.createdAt,
					}));

				return [...prevMessages, ...newMessages];
			});
		}
	}, [roomMessages, id, roomName, username, getMessagesForRoom]);

	// Helper function to format time in 12-hour format with AM/PM
	const formatTime12Hour = (date: Date) => {
		return date.toLocaleTimeString([], {
			hour: 'numeric',
			minute: '2-digit',
			hour12: true
		});
	};

	
	const handleSendMessage = (e: React.FormEvent) => {
		e.preventDefault();

		if (message.trim() && id) {
			// Send message via socket service
			sendRoomMessage({
				roomId: id,
				room: roomName,
				message: message.trim(),
			});
			setMessage("");
		}
	};

	const leaveRoom = () => {
		if (id) {
			socketLeaveRoom(id);
		}
		localStorage.removeItem("currentRoom");
		localStorage.removeItem("currentRoomName");
		navigate("/group");
	};

	if (!isAuthenticated) {
		return null;
	}

	return (
		<div className="flex flex-col h-screen mira-content">
			{/* Classroom Header */}
			<div className="mira-glass border-b border-sidebar-border shadow-sm">
				<div className="container mx-auto px-4 py-4">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-4">
							<Button
								variant="ghost"
								size="icon"
								onClick={leaveRoom}
								className="p-2 text-foreground/60 hover:text-foreground hover:bg-sidebar-accent/30 rounded-lg transition-colors"
							>
								<ArrowLeft size={24} />
							</Button>

							<div className="flex items-center gap-3">
								<div className="relative">
									<div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
										<span className="text-xl font-bold text-primary-foreground">#</span>
									</div>
									<div className="absolute -top-1 -right-1">
										<div className="w-3 h-3 bg-primary rounded-full"></div>
									</div>
								</div>

								<div>
									<h2 className="text-xl font-bold text-foreground flex items-center gap-2">
										<span className="text-primary">#</span>
										{roomName}
									</h2>
									<p className="text-sm text-foreground/60 flex items-center gap-2">
										<div className={`relative flex h-2 w-2 ${isConnected ? "bg-green-500 animate-pulse" : "bg-destructive"}`}>
											<div className="absolute inline-flex h-full w-full rounded-full bg-current"></div>
										</div>
										{isConnected ? "Connected" : "Connecting..."}
									</p>
								</div>
							</div>
						</div>

						<div className="flex items-center gap-2">
							<Button
								variant="ghost"
								size="icon"
								className="text-muted-foreground hover:text-foreground"
							>
								<Users className="w-5 h-5" />
							</Button>
							<Button
								variant="ghost"
								size="icon"
								className="text-muted-foreground hover:text-foreground"
							>
								<Settings className="w-5 h-5" />
							</Button>
							<Button
								variant="ghost"
								size="icon"
								className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
							>
								<LogOut className="w-5 h-5" />
							</Button>
						</div>
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
								Loading classroom messages...
							</h1>
						</div>
					</div>
				) : isError ? (
					<div className="flex items-center justify-center h-full">
						<div className="text-center max-w-md">
							<div className="w-20 h-20 mx-auto mb-6 rounded-2xl flex items-center justify-center mira-glass">
								<span className="text-3xl">⚠️</span>
							</div>
							<h2 className="mira-title text-xl mb-4">Error Loading Messages</h2>
							<p className="text-sm text-muted-foreground mb-6">
								{error?.message || "Failed to load room messages"}
							</p>
							<Button onClick={() => window.location.reload()} className="px-6 py-3">
								Try Again
							</Button>
						</div>
					</div>
				) : (
					<div className="space-y-6 max-w-5xl mx-auto">
						{messages.map((msg, index) => {
							const messageKey = `${msg.id}-${index}`;
							return (
								<div
									key={messageKey}
									className={`group ${msg.isSystem ? "flex justify-center" : `${msg.isOwn ? "flex justify-end" : "flex justify-start"} animate-fadeIn`}`}
									style={{ animationDelay: `${index * 50}ms` }}
								>
									{msg.isSystem ? (
										<div className="px-6 py-3 bg-primary/10 border border-primary/20 rounded-full text-sm text-primary font-medium mira-glass">
											<span className="flex items-center gap-2">
												<Zap className="w-4 h-4" />
												{msg.message}
											</span>
										</div>
									) : (
										<div className={`flex gap-4 max-w-lg lg:max-w-2xl ${msg.isOwn ? "flex-row-reverse" : "flex-row"}`}>
											{/* Avatar */}
											<div className="relative flex-shrink-0">
												<div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
													<span className="text-lg font-bold text-primary-foreground">
														{msg.author.charAt(0).toUpperCase()}
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
														{msg.isOwn ? "You" : msg.author}
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
									)}
								</div>
							);
						})}
						<div ref={messagesEndRef} />
					</div>
				)}
			</div>


			{/* Input Section */}
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
								{isConnected ? `📚 Connected to ${roomName}` : "🔄 Connecting..."}
							</span>
						</div>
						<div className={`text-xs font-medium ${message.length >= 450 ? 'text-destructive' : message.length >= 350 ? 'text-amber-500' : 'text-muted-foreground'}`}>
							{message.length}/500
						</div>
					</div>

					<form onSubmit={handleSendMessage} className="space-y-3">
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
									value={message}
									onChange={(e) => {
										if (e.target.value.length <= 500) {
											setMessage(e.target.value);
										}
									}}
									placeholder={`Share your thoughts in ${roomName} classroom...`}
									className="relative w-full min-h-[48px] max-h-40 px-5 py-3.5 pr-16 rounded-2xl resize-none mira-glass border-2 border-border/50 focus:border-primary/50 focus:border-primary/50 focus:ring-4 focus:ring-primary/10 text-base placeholder:text-muted-foreground/50 transition-all duration-300 shadow-sm"
									rows={1}
									onKeyDown={(e) => {
										if (e.key === 'Enter' && !e.shiftKey) {
											e.preventDefault();
											handleSendMessage(e);
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
								{message.length > 300 && (
									<div className="absolute right-4 bottom-3 z-10">
										<div className={`px-2 py-1 rounded-lg text-xs font-bold backdrop-blur-sm ${
											message.length >= 500
												? 'bg-destructive/20 text-destructive'
												: 'bg-amber-500/20 text-amber-500'
										}`}>
											{500 - message.length}
										</div>
									</div>
								)}
							</div>

							{/* Enhanced Send Button */}
							<Button
								type="submit"
								disabled={!message.trim() || !isConnected || message.length >= 500}
								className="h-11 px-5 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground rounded-2xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center gap-2 shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 hover:scale-105 active:scale-95 relative overflow-hidden group"
							>
								<div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
								<Send size={18} className="relative z-10 transition-transform duration-300 group-hover:translate-x-1" />
								{message.trim() && <span className="hidden sm:inline relative z-10">Send</span>}
							</Button>
						</div>
					</form>

					{/* Enhanced Help Text */}
					<div className="mt-3 px-4 py-2.5 rounded-xl bg-muted/30 border border-border/30">
						<div className="flex items-center justify-between text-xs">
							<span className="text-muted-foreground flex items-center gap-1.5">
								<span className="text-base">💡</span>
								<span className="font-medium">Press Enter to send, Shift+Enter for new line</span>
							</span>
							<div className="flex items-center gap-2 text-muted-foreground">
								<div className="w-px h-3 bg-border"></div>
								<span className="font-medium">Be respectful and constructive</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default RoomChat;
