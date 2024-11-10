import {SubmitHandler, useForm} from "react-hook-form";
import axios from "axios";
import {v4 as uuidv4} from "uuid";
import {toast} from 'react-toastify';
import {useFriendsStore} from "../utils/store/useStoreFriends"
import {useEffect} from "react";
import Toast from "./Toast";


type FriendRequests = {
    uuidFriend: string;
};

const styles: { [key: string]: React.CSSProperties } = {
    form: {
        display: "flex",
        flexDirection: "column",
        gap: "1.5rem",
        width: "100%",
        maxWidth: "400px",
        padding: "2rem",
        backgroundColor: "#4c3575",
        borderRadius: "12px",
        boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
        marginTop: "1em",
    },
    inputGroup: {
        display: "flex",
        flexDirection: "column",
        gap: "0.5rem",
    },
    label: {
        color: "rgb(f,f,f,5)",
        fontWeight: "bold",
    },
    input: {
        padding: "1rem",
        fontSize: "1rem",
        backgroundColor: "#5b4b8a",
        border: "none",
        borderRadius: "8px",
        color: "rgb(f,f,f,5)",
    },
    button: {
        padding: "1rem",
        fontSize: "1rem",
        backgroundColor: "#7858a6",
        color: "white",
        border: "none",
        borderRadius: "8px",
        fontWeight: "600",
    },
    buttonHover: {
        backgroundColor: "#8262b0",
    },
};

const FriendsRequest = () => {
    const {register, handleSubmit, formState: {errors}} = useForm<FriendRequests>();
    const {friends, fetchAllFriends} = useFriendsStore();

    useEffect(() => {
        fetchAllFriends();
    }, [fetchAllFriends]);

    const onSubmit: SubmitHandler<FriendRequests> = async (data) => {
        try {
            const requestId = uuidv4();
            const response = await axios.get("http://localhost:3000/auth/me", {withCredentials: true});
            if (response.data.id === data.uuidFriend) {
                toast("Tu ne peux pas te demander toi-même en ami, petit coquin");
                return;
            }

            if (friends.some(friend => friend.userId === data.uuidFriend)) {
                console.log('friends', friends)
                toast("Déjà ton ami");
                return;
            }

            await axios.post(
                `http://localhost:3000/social/friend-request/${requestId}`,
                {receiverId: data.uuidFriend},
                {withCredentials: true}
            );
            toast("Votre demande d'ami a bien été envoyée");

        } catch (error) {
            Toast.notify("Erreur lors de l'envoi de la demande d'ami" + error, {type: "error"});
        }
    };


    return (
        <div className="friend-requests-container">
            <h3>Ajout d'ami</h3>
            <p className="texte-uuid">
                Tu peux ajouter des amis grâce à leur identifiant unique (UUID)
            </p>
            <form onSubmit={handleSubmit(onSubmit)} className="form-friend-requests">
                <div style={styles.inputGroup}>
                    <label style={styles.label}>UUID de l'ami</label>
                    <input
                        {...register("uuidFriend", {
                            required: "L'UUID est requis",
                            pattern: {
                                value: /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/,
                                message: "Veuillez entrer un UUID valide",
                            },
                        })}
                        placeholder="Entrez l'UUID de votre ami"
                        style={styles.input}
                    />
                    {errors.uuidFriend && <p style={styles.errorMessage}>{errors.uuidFriend.message}</p>}
                </div>
                <button
                    type="submit"
                    style={styles.button}
                >
                    Ajouter
                </button>
            </form>
        </div>
    );
};

export default FriendsRequest;
