import {SubmitHandler, useForm} from "react-hook-form";
import axios from 'axios';
import {useState} from "react";
import {v4 as uuidv4} from 'uuid';

type FriendRequests = {
    uuidFriend: string;
};

const FriendsRequest = () => {

    const {register, handleSubmit, formState: {errors}} = useForm<FriendRequests>();

    const [successMessage, setSuccessMessage] = useState('');
    const [messageError, setMessageError] = useState('');


    const onSubmit: SubmitHandler<FriendRequests> = async (data) => {
        try {
            const requestId = uuidv4();
            await axios.post(`http://localhost:3000/social/friend-request/${requestId}`, {
                receiverId: data.uuidFriend
            }, {withCredentials : true});
            setMessageError('')
            setSuccessMessage("Votre demande d'ami a bien été envoyée")

        } catch (error) {
            setSuccessMessage('')
            setMessageError("Erreur lors de la demande d'ami")
        }
    };

    return (
        <>
            <p>Tu peux ajouter des amis grâce à leur id</p>
            <form onSubmit={handleSubmit(onSubmit)}>
                <input
                    {...register("uuidFriend", {
                        required: "L'UUID est requis",
                        pattern: {
                            value: /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/,
                            message: "Veuillez entrer un UUID valide"
                        }
                    })}
                    placeholder="Friend UUID"
                />
                <input value="Ajouter" type="submit"/>
                {errors.uuidFriend && <p>{errors.uuidFriend.message}</p>}
            </form>
            {successMessage}
            {messageError}
        </>
    );
}

export default FriendsRequest;
