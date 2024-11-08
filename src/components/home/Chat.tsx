import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMessage } from "@fortawesome/free-solid-svg-icons";
import { useForm, SubmitHandler } from "react-hook-form";
import { useParams } from "react-router-dom";
import { Friends, useFriendsStore } from "../../utils/store/useStoreFriends";
import { useEffect, useState } from "react";
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
    let rendered = false;
    const { getFriendById } = useFriendsStore();
    const { user } = useStoreUser();
    const { messages, setMessage, clearMessage, addMessage } = useMessageStore();
    const currentActiveChat: Friends | undefined = getFriendById(id);
    const [charCount, setCharCount] = useState(0);
    const { handleSubmit, register, reset, watch } = useForm<Input>();
    const messageValue = watch("message", "")

    const onSubmit: SubmitHandler<Input> = (data) => {
        addMessage({
            id: uuidv4(),
            emitterId: user?.id,
            receiverId: id,
            content: data.message,
        });

        const sendMessage = async () => {
            await axios
                .post("http://localhost:3000/chat/" + uuidv4() + "/send", {
                    receiverId: id,
                    content: data.message,
                }, { withCredentials: true })
                .then((response) => {
                    console.log(response);
                })
                .catch((error) => {
                    console.error(error);
                });
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

        if (!rendered) {
            fetchMessages();
            rendered = true;
        }
    }, [id, messages]);
    useEffect(() => {
        setCharCount(messageValue.length);
    }, [messageValue]);

    return (
        <div className="chat-container">
            <h3>{currentActiveChat?.username}</h3>
            <ul className="message-zone">
                {messages.map((message) => {
                    if (message.emitterId === id) {
                        return (
                            <li
                                style={{ display: "flex", justifyContent: "start" }}
                                key={message.id}
                            >
                                <span style={{ backgroundColor: "rgb(91,75,138,100)" }}>
                                    {makeLinksClickable(message.content)}
                                </span>
                            </li>
                        );
                    } else {
                        return (
                            <li
                                style={{ display: "flex", justifyContent: "end" }}
                                key={message.id}
                            >
                                <span style={{ backgroundColor: "rgb(91,75,138,100)" }}>
                                    {makeLinksClickable(message.content)}
                                </span>
                            </li>
                        );
                    }
                })}
            </ul>
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
            </div>
        </div>
    );
}

export default Chat;
