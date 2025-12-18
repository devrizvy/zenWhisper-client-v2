import { io, Socket } from "socket.io-client";

// Types for chat data
export interface PrivateMessage {
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

export interface RoomMessage {
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

export interface ChatUser {
	email: string;
	username: string;
	isOnline?: boolean;
	isTyping?: boolean;
	lastSeen?: string;
}

class SocketService {
	private socket: Socket | null = null;
	private readonly SERVER_URL = import.meta.env.VITE_BACKEND_URL;

	// Initialize socket connection
	connect(userEmail: string): Promise<void> {
		return new Promise((resolve, reject) => {
			try {
				this.socket = io(this.SERVER_URL, {
					transports: ["websocket", "polling"],
					upgrade: true,
					rememberUpgrade: true,
				});

				this.socket.on("connect", () => {
					console.log("Connected to server:", this.socket?.id);

					// Register user as online
					this.socket?.emit("user_online", userEmail);
					resolve();
				});

				this.socket.on("connect_error", (error) => {
					console.error("Connection error:", error);
					reject(error);
				});

				this.socket.on("disconnect", () => {
					console.log("Disconnected from server");
				});
			} catch (error) {
				reject(error);
			}
		});
	}

	// Disconnect socket
	disconnect(): void {
		if (this.socket) {
			this.socket.disconnect();
			this.socket = null;
		}
	}

	// Private Chat Methods
	joinPrivateChat(chatId: string, currentUserEmail: string): void {
		this.socket?.emit("join_private_chat", chatId, currentUserEmail);
	}

	leavePrivateChat(chatId: string, userEmail: string): void {
		this.socket?.emit("leave_private_chat", chatId, userEmail);
	}

	sendPrivateMessage(data: {
		chatId: string;
		senderEmail: string;
		senderUsername: string;
		receiverEmail: string;
		receiverUsername: string;
		message: string;
		time: string;
	}): void {
		this.socket?.emit("send_private_message", data);
	}

	onReceivePrivateMessage(callback: (message: PrivateMessage) => void): void {
		this.socket?.on("receive_private_message", callback);
	}

	onNewMessageNotification(
		callback: (data: { from: string; chatId: string; message: string }) => void,
	): void {
		this.socket?.on("new_message_notification", callback);
	}

	onUserStatusChange(
		callback: (data: { userEmail: string; status: string }) => void,
	): void {
		this.socket?.on("user_status_change", callback);
	}

	// Typing indicators for private chat
	startTyping(data: {
		chatId: string;
		userEmail: string;
		username: string;
	}): void {
		this.socket?.emit("typing_start", data);
	}

	stopTyping(data: {
		chatId: string;
		userEmail: string;
		username: string;
	}): void {
		this.socket?.emit("typing_stop", data);
	}

	onUserTyping(
		callback: (data: {
			userEmail: string;
			username: string;
			isTyping: boolean;
		}) => void,
	): void {
		this.socket?.on("user_typing", callback);
	}

	// Room Chat Methods
	joinRoom(roomId: string, username: string): void {
		this.socket?.emit("join_room", roomId, username);
	}

	leaveRoom(roomId: string, username: string): void {
		this.socket?.emit("leave_room", roomId, username);
	}

	sendRoomMessage(data: {
		roomId: string;
		room: string;
		author: string;
		message: string;
		time: string;
	}): void {
		this.socket?.emit("send_room_message", data);
	}

	onReceiveRoomMessage(callback: (message: RoomMessage) => void): void {
		this.socket?.on("receive_room_message", callback);
	}

	onJoiningMessage(
		callback: (message: {
			author: string;
			message: string;
			time: string;
		}) => void,
	): void {
		this.socket?.on("joining_message", callback);
	}

	onLeaveMessage(
		callback: (message: {
			author: string;
			message: string;
			time: string;
		}) => void,
	): void {
		this.socket?.on("leave_message", callback);
	}

	// Utility methods
	isConnected(): boolean {
		return this.socket?.connected || false;
	}

	getSocketId(): string | undefined {
		return this.socket?.id;
	}

	// Remove event listeners
	off(event: string, callback?: (...args: any[]) => void): void {
		this.socket?.off(event, callback);
	}
}

// Create singleton instance
const socketService = new SocketService();

export default socketService;
