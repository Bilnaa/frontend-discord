import { create } from "zustand";

export interface Message {
    id: string | undefined;
    emitterId: string | undefined;
    content: string;
    sendAt: string;
}

interface useMessage{
    messages: Message[],
    setMessage : (messages : Message[]) => void
    clearMessage: () => void
    addMessage : (message: Message) => void
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
    addMessage(message) {
        set((state) => ({
            messages: [...state.messages, message]
        }));
    },
  }))