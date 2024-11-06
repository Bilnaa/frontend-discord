import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMessage } from "@fortawesome/free-solid-svg-icons";
import { useForm, SubmitHandler } from "react-hook-form";
import { useParams } from "react-router-dom";
import { Friends, useFriendsStore } from "../../utils/store/useStoreFriends";
import { useEffect, useState } from "react";
import axios from "axios";
import { Message, useMessageStore } from "../../utils/store/useStoreMessages";
import useStoreUser from "../../utils/store/useStoreUser";
import { v4 as uuidv4 } from "uuid";


type Input = {
    message: string
}

function Chat() {
    const { id } = useParams();
    let rendered = false;
    const {getFriendById} = useFriendsStore();
    const {user} = useStoreUser();
    const { messages, setMessage, clearMessage, addMessage } = useMessageStore();
    const currentActiveChat : Friends | undefined= getFriendById(id);
    
    const {
        handleSubmit,
        register, reset
      } = useForm<Input>()

      const onSubmit: SubmitHandler<Input> = (data) => {
        addMessage(
            {
                id: uuidv4(),
                emitterId: user?.id,
                receiverId: id,
                content: data.message,
            }
        )

        const sendMessage = async () => {
            await axios.post("http://localhost:3000/chat/" + uuidv4() + "/send", {
                receiverId: id,
                content: data.message,
            } , {withCredentials: true })
            .then((response) => {
                console.log(response) 
            })
            .catch((error) => {
                console.error(error);
            });
        }
        sendMessage();
        reset()
    }

    useEffect(() => {
        const fetchMessages = async () => {
            let temp : [] = []
          await axios.get("http://localhost:3000/messages/" + id, { withCredentials: true })
          .then((response) => {
            clearMessage()
            setMessage(response.data)  
            temp = response.data.reverse() 
          })
          .catch((error) => {
            console.error(error);
          });
        };

        if (rendered == false) {
            fetchMessages();
            rendered = true;
          }
      }, [id]);


  return (
    <div className="chat-container">
        <h3>{currentActiveChat?.username}</h3>
        <div className="message-zone">
            <ul>
                {messages.map((message) => {
                    if (message.emitterId == id) {
                        return <li style={{backgroundColor:"rgb(91,75,138,100)"}} key={message.id}>{message.content}</li>
                    }else{
                        return <li style={{backgroundColor:"rgb(120,88,166,100)"}} key={message.id}>{message.content}</li>
                    }
                })}
            </ul>
        </div>
        <div className="inputs">
            <form onSubmit={handleSubmit(onSubmit)} style={{display:"flex"}}>
                <input className="message-bar" autoComplete="off" type="text" placeholder='Tap your message here' style={{fontSize:'20px'}} {...register("message")}/>
                <button className="message-button" type="submit"><FontAwesomeIcon icon={faMessage}/></button>
            </form>
        </div>
    </div>
  )
}

export default Chat;
