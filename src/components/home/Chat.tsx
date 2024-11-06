import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMessage } from "@fortawesome/free-solid-svg-icons";
import { useForm, SubmitHandler } from "react-hook-form";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
import { Friends, useFriendsStore } from "../../utils/store/useStoreFriends";

type Input = {
    message: string
}

function Chat() {

    const { id } = useParams();
    const {getFriendById} = useFriendsStore();
    
    const {
        handleSubmit,
        register, reset
      } = useForm<Input>()

      const onSubmit: SubmitHandler<Input> = (data) => {
        
        reset()
      }


  return (
    <div className="chat-container">
        <h3>Noé</h3>
        <div className="message-zone">
            MESSAGEZONE
        </div>
        <div className="inputs">
            <form onSubmit={handleSubmit(onSubmit)} style={{display:"flex"}}>
                <input className="message-bar" type="text" placeholder='Tap your message here' style={{fontSize:'20px'}} {...register("message")}/>
                <button className="message-button" type="submit"><FontAwesomeIcon icon={faMessage}/></button>
            </form>
        </div>
    </div>
  )
}

export default Chat;