import { create } from "zustand";

export interface Message {
    id: string | undefined;
    emitterId: string | undefined;
    receiverId: string | undefined;
    content: string;
}

interface useMessage{
    messages: Message[],
    setMessage : (messages : Message[]) => void,
    clearMessage: () => void,
    addMessage : (message: Message, emitterId: string |  undefined) => void
  }
  
  export const useMessageStore = create<useMessage>((set) => ({
    messages: [],
    setMessage(messagesData) {
        set((state) => ({
            messages: [...state.messages, ...messagesData]
        }));
    },
    clearMessage(){
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
  }))