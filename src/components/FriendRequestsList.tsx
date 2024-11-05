import axios from "axios";
import { useEffect, useState } from "react";

type FriendRequest = {
    id: string;
    senderId: string;
};

const FriendRequestsList = () => {

    const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);

    useEffect(() => {
        const fetchFriendRequests = async () => {
            try {
                const response = await axios.get("http://localhost:3000/social/friend-requests/", {
                    withCredentials: true
                });
                setFriendRequests(response.data);
                console.log(response.data);
            } catch (error) {
                console.error("Impossible de récupérer les informations de l'utilisateur", error);
            }
        };

        fetchFriendRequests();
    }, []);

    const acceptFriendRequest = async (requestId : string) => {
        try {
            await axios.post(`http://localhost:3000/social/friend-request/${requestId}/accept`, {}, {
                withCredentials: true
            });
            setFriendRequests((prevRequests) =>
                prevRequests.filter((request) => request.id !== requestId)
            );
        } catch (error) {
            console.error("Erreur lors de l'acceptation de la demande d'ami", error);
        }
    };

    return (
        <>
            <div>
                {friendRequests.length > 0 ? (
                    friendRequests.map((friendRequest) => (
                        <div key={friendRequest.id}>
                            <p>{friendRequest.senderId}
                                <button onClick={() => acceptFriendRequest(friendRequest.id)}>Accepter</button>
                            </p>
                        </div>
                    ))
                ) : (
                    <p>Aucune demande d'ami pour le moment.</p>
                )}
            </div>
        </>
    )
}

export default FriendRequestsList