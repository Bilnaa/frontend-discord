import { useEffect, useState } from "react";

type FriendRequest = {
    id: number;
    username: string;
};

const FriendRequestsList = () => {

    const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);

    useEffect(() => {
        const fetchFriendRequests = async () => {
            try {
                const response = await fetch('http://localhost:3000/social/friend-requests/');
                const data: FriendRequest[] = await response.json();
                setFriendRequests(data);
                console.log(friendRequests);
            } catch (error) {
                console.error("Erreur lors de la récupération des demandes d'amis", error);
            }
        };

        fetchFriendRequests();
    }, []);

    return (
        <>
            <div>
                {friendRequests.length > 0 ? (
                    friendRequests.map((friendRequest) => (
                        <div key={friendRequest.id}>
                            <p>Nom d'utilisateur : {friendRequest.username}</p>
                            <button>Accepter</button>
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