import { useEffect } from "react";
import useStoreFriendRequests from "../utils/store/useStoreFriendRequests";

const FriendRequestsList = () => {
    const { fetchFriendRequests, acceptFriendRequest, friendRequests } = useStoreFriendRequests();

    useEffect(() => {
        fetchFriendRequests();
    }, [fetchFriendRequests]);

    return (
        <div>
            {friendRequests.length > 0 ? (
                friendRequests.map((friendRequest) => (
                    <div key={friendRequest.id}>
                        <p>
                            {friendRequest.senderId}
                            <button onClick={() => acceptFriendRequest(friendRequest.id)}>
                                Accepter
                            </button>
                        </p>
                    </div>
                ))
            ) : (
                <p>Aucune demande d'ami pour le moment.</p>
            )}
        </div>
    );
};

export default FriendRequestsList;
