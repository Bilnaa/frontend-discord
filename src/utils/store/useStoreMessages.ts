import { create } from "zustand";
import axios from "axios";

export interface Message {
    id: string | undefined;
    emitterId: string | undefined;
    receiverId: string | undefined;
    content: string;
}

interface useMessage {
    messages: Message[],
    failedMessages: Message[],
    setMessage: (messages: Message[]) => void,
    clearMessage: () => void,
    addMessage: (message: Message, emitterId: string | undefined) => void,
    addFailedMessage: (message: Message) => void,
    retryFailedMessages: () => void,
    retryFailedMessage: (messageId: string) => void,
}

export const useMessageStore = create<useMessage>((set) => ({
    messages: [],
    failedMessages: [],
    setMessage(messagesData) {
        set((state) => ({
            messages: [...state.messages, ...messagesData]
        }));
    },
    clearMessage() {
        set(() => ({
            messages: []
        }));
    },
    addMessage(message, chatId) {
        if (message.receiverId === chatId || message.emitterId === chatId) {
            set((state) => ({
                messages: [...state.messages, message]
            }));
        }
    },
    addFailedMessage(message) {
        set((state) => ({
            failedMessages: [...state.failedMessages, message]
        }));
    },
    retryFailedMessages() {
        set((state) => {
            const newFailedMessages = [...state.failedMessages];
            newFailedMessages.forEach(async (message) => {
                try {
                    await axios.post(`http://localhost:3000/chat/${message.id}/send`, {
                        receiverId: message.receiverId,
                        content: message.content,
                    }, { withCredentials: true });
                    set((state) => ({
                        messages: [...state.messages, message],
                        failedMessages: state.failedMessages.filter((msg) => msg.id !== message.id),
                    }));
                } catch (error) {
                    console.error("Failed to resend message", error);
                }
            });
            return { failedMessages: newFailedMessages };
        });
    },
    retryFailedMessage(messageId) {
        set((state) => {
            const message = state.failedMessages.find((msg) => msg.id === messageId);
            if (message) {
                axios.post(`http://localhost:3000/chat/${message.id}/send`, {
                    receiverId: message.receiverId,
                    content: message.content,
                }, { withCredentials: true })
                .then(() => {
                    set((state) => ({
                        messages: [...state.messages, message],
                        failedMessages: state.failedMessages.filter((msg) => msg.id !== messageId),
                    }));
                })
                .catch((error) => {
                    console.error("Failed to resend message", error);
                });
            }
            return {}; // Ajout d'un retour d'objet partiel vide pour éviter l'erreur
        });
    },
}));