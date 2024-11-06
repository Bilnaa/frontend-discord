import { SubmitHandler, useForm } from "react-hook-form";
import axios from "axios";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

type FriendRequests = {
    uuidFriend: string;
};

const styles: { [key: string]: React.CSSProperties } = {
    container: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
    },
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
    errorMessage: {
        color: "#ff6b6b",
        fontSize: "0.875rem",
    },
    successMessage: {
        color: "#69db7c",
        fontSize: "0.875rem",
    },
};

const FriendsRequest = () => {
    const { register, handleSubmit, formState: { errors } } = useForm<FriendRequests>();
    const [successMessage, setSuccessMessage] = useState("");
    const [messageError, setMessageError] = useState("");

    const onSubmit: SubmitHandler<FriendRequests> = async (data) => {
        try {
            const requestId = uuidv4();
            await axios.post(
                `http://localhost:3000/social/friend-request/${requestId}`,
                { receiverId: data.uuidFriend },
                { withCredentials: true }
            );
            setMessageError("");
            setSuccessMessage("Votre demande d'ami a bien été envoyée");
        } catch (error) {
            setSuccessMessage("");
            setMessageError("Erreur lors de la demande d'ami");
        }
    };

    return (
        <div style={styles.container}>
            <h2>Ajout d'ami</h2>
            <p>
                Tu peux ajouter des amis grâce à leur identifiant unique (UUID)
            </p>
            <form onSubmit={handleSubmit(onSubmit)} style={styles.form}>
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
            {successMessage && <p style={styles.successMessage}>{successMessage}</p>}
            {messageError && <p style={styles.errorMessage}>{messageError}</p>}
        </div>
    );
};

export default FriendsRequest;
