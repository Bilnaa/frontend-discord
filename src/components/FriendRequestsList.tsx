import { useEffect } from "react";
import useStoreFriendRequests from "../utils/store/useStoreFriendRequests";

const styles = {
    container: {
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        width: "100%",
        maxWidth: "400px",
        padding: "2rem",
        backgroundColor: "#4c3575",
        borderRadius: "12px",
        boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
        marginTop: "1em",

    },
    requestItem: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "1rem",
        backgroundColor: "#5b4b8a",
        borderRadius: "8px",
    },
    senderId: {
        color: "white",
        fontWeight: "bold",
    },
    acceptButton: {
        padding: "0.5rem 1rem",
        backgroundColor: "#7858a6",
        color: "white",
        border: "none",
        borderRadius: "8px",
        fontWeight: "600",
        cursor: "pointer",
    },
    acceptButtonHover: {
        backgroundColor: "#8262b0",
    },
    noRequests: {
        color: "white",
        fontSize: "1rem",
        marginTop: "1rem",
    },
};

const FriendRequestsList = () => {
    const { fetchFriendRequests, acceptFriendRequest, friendRequests } = useStoreFriendRequests();

    useEffect(() => {
        fetchFriendRequests();
    }, [fetchFriendRequests]);

    return (
        <div className="friends-list-container">
            <h3>Demandes d'ami</h3>
            {friendRequests.length > 0 ? (
                friendRequests.map((friendRequest) => (
                    <div key={friendRequest.id} style={styles.requestItem}>
                        <p className="sender-name">{friendRequest.senderId}</p>
                        <button
                            className="accept-friend-button"
                            onClick={() => acceptFriendRequest(friendRequest.id)}
                        >
                            Accepter
                        </button>
                    </div>
                ))
            ) : (
                <p className='no-requests'>Aucune demande d'ami pour le moment.</p>
            )}
        </div>
    );
};

export default FriendRequestsList;
