import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMessage, faSyncAlt } from "@fortawesome/free-solid-svg-icons"; // Import refresh icon
import { useForm, SubmitHandler } from "react-hook-form";
import { useParams } from "react-router-dom";
import { Friends, useFriendsStore } from "../../utils/store/useStoreFriends";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useMessageStore } from "../../utils/store/useStoreMessages";
import useStoreUser from "../../utils/store/useStoreUser";
import { v4 as uuidv4 } from "uuid";

type Input = {
    message: string;
};

function makeLinksClickable(text: string) {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.split(urlRegex).map((part, index) => {
        if (part.match(urlRegex)) {
            return <a key={index} href={part} target="_blank" rel="noopener noreferrer">{part}</a>;
        }
        return part;
    });
}

function Chat() {
    const { id } = useParams();
    const { getFriendById } = useFriendsStore();
    const { user } = useStoreUser();
    const { messages, failedMessages, setMessage, clearMessage, addMessage, addFailedMessage, retryFailedMessage } = useMessageStore();
    const currentActiveChat: Friends | undefined = getFriendById(id);
    const [charCount, setCharCount] = useState(0);
    const { handleSubmit, register, reset, watch } = useForm<Input>();
    const messageValue = watch("message", "")
    const messageEndRef = useRef<HTMLDivElement>(null);

    const onSubmit: SubmitHandler<Input> = (data) => {
        const idForMessage: string = uuidv4();
        const newMessage = {
            id: idForMessage,
            emitterId: user?.id,
            receiverId: id,
            content: data.message,
        };
        addMessage(newMessage, id);

        const sendMessage = async () => {
            try {
                await axios.post("http://localhost:3000/chat/" + idForMessage + "/send", {
                    receiverId: id,
                    content: data.message,
                }, { withCredentials: true });
            } catch (error) {
                console.error(error);
                addFailedMessage(newMessage);
            }
        };
        sendMessage();
        reset();
        setCharCount(0);
    };

    useEffect(() => {
        const fetchMessages = async () => {
            await axios.get("http://localhost:3000/messages/" + id, { withCredentials: true })
                .then((response) => {
                    clearMessage();
                    setMessage(response.data.slice().reverse());
                })
                .catch((error) => {
                    console.error(error);
                });
        };
        fetchMessages();
    }, [id, clearMessage, setMessage]);

    useEffect(() => {
        if (messageEndRef.current) {
            messageEndRef.current.scrollIntoView({ behavior: "smooth" });
            console.log("scroll");
        }
    }, [messages]);

    useEffect(() => {
        setCharCount(messageValue.length);
    }, [messageValue]);

    return (
        <div className="chat-container">
            <h3>{currentActiveChat?.username}</h3>
            <div className="message-zone" style={{ overflowY: 'scroll' }}>
                <ul>
                    {messages.map((message) => {
                        const isFailedMessage = failedMessages.some((failedMessage) => failedMessage.id === message.id);
                        const messageStyle = message.emitterId === id ? { display: "flex", justifyContent: "start" } : { display: "flex", justifyContent: "end", paddingRight: "10px" };
                        const messageBackground = message.emitterId === id ? "rgb(91,75,138,100)" : "rgb(120,88,166,100)";
                        return (
                            <li style={messageStyle} key={message.id}>
                                <span style={{ backgroundColor: messageBackground }}>
                                    {makeLinksClickable(message.content)}
                                </span>
                                {isFailedMessage && (
                                    <button onClick={() => message.id && retryFailedMessage(message.id)} style={{ background: "none", border: "none", cursor: "pointer", marginLeft: "10px" }}>
                                        <FontAwesomeIcon icon={faSyncAlt} size="lg" />
                                    </button>
                                )}
                            </li>
                        );
                    })}
                    <div ref={messageEndRef} />
                </ul>
            </div>
            <div className="inputs">
                <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex" }}>
                    <input
                        className="message-bar"
                        autoComplete="off"
                        type="text"
                        placeholder="Tap your message here"
                        style={{fontSize: "20px"}}
                        {...register("message", {
                            maxLength: {
                                value: 255,
                                message: "255 caractères maximum chef",
                            },
                        })}
                    />
                    <p style={{fontSize: "14px", color: charCount > 255 ? "red" : "black"}}>
                        {charCount} / 255 caractères
                    </p>
                    <button className="message-button" type="submit">
                        <FontAwesomeIcon icon={faMessage}/>
                    </button>
                </form>
                {failedMessages.length > 0 && (
                    <div style={{ display: "flex", alignItems: "center", marginTop: "10px" }}>
                        <span style={{ color: "red", marginRight: "10px" }}>Échec de l'envoi de certains messages</span>
                        <button onClick={() => failedMessages.forEach(message => message.id && retryFailedMessage(message.id))} style={{ background: "none", border: "none", cursor: "pointer" }}>
                            <FontAwesomeIcon icon={faSyncAlt} size="lg" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Chat;
