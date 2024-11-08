import { SubmitHandler, useForm } from "react-hook-form";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { toast } from 'react-toastify';
import { useFriendsStore } from "../utils/store/useStoreFriends";
import { useEffect } from "react";
import styled from 'styled-components';

type FriendRequests = {
    uuidFriend: string;
};

const Form = styled.form`
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    width: 100%;
    max-width: 400px;
    padding: 2rem;
    background-color: ${({ theme }) => theme.colors.bg2};
    border-radius: 12px;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
    margin-top: 1em;
`;

const InputGroup = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    
`;

const Input = styled.input`
    padding: 1rem;
    font-size: 1rem;
    background-color: ${({ theme }) => theme.colors.bgInput};
    border-radius: 8px;
    color: rgba(255, 255, 255, 0.8);
    &:focus {
        outline: 2px solid ${({ theme }) => theme.colors.focus || "#8262b0"};
    }
`;

const DivFriendRequests = styled.div`
    height:100%;
    width:100%;
    background-color:${({ theme }) => theme.colors.bg2};
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const H3Titre = styled.p`
    height: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color:${({ theme }) => theme.colors.bg2};
    color: ${({ theme }) => theme.colors.text};
    font-size: 25px;
    padding: 10px;
    font-weight: bold;
`

const Button = styled.button`
    padding: 1rem;
    font-size: 1rem;
    background-color: ${({ theme }) => theme.colors.bgInput};
    color: ${({ theme }) => theme.colors.text};
    border-radius: 8px;
    font-weight: 600;

    &:hover {
        background-color: ${({ theme }) => theme.colors.buttonHover};
    }
`;

const ErrorMessage = styled.p`
    color: ${({ theme }) => theme.colors.error || "#ff6b6b"};
    font-size: 0.875rem;
`;

/*const SuccessMessage = styled.p`
    color: ${({ theme }) => theme.colors.success || "#69db7c"};
    font-size: 0.875rem;
`;*/

const Label = styled.label`
    font-weight: bold;
`;

const LabelUuid = styled.p`
    padding: 0.5rem;
`;

const FriendsRequest = () => {
    const { register, handleSubmit, formState: { errors } } = useForm<FriendRequests>();
    const { friends, fetchAllFriends } = useFriendsStore();

    useEffect(() => {
        fetchAllFriends();
    }, [fetchAllFriends]);

    const onSubmit: SubmitHandler<FriendRequests> = async (data) => {
        try {
            const requestId = uuidv4();
            const response = await axios.get("http://localhost:3000/auth/me", { withCredentials: true });
            if (response.data.id === data.uuidFriend) {
                toast("Tu ne peux pas te demander toi-même en ami, petit coquin");
                return;
            }

            if (friends.some(friend => friend.userId === data.uuidFriend)) {
                toast("Déjà ton ami");
                return;
            }

            await axios.post(
                `http://localhost:3000/social/friend-request/${requestId}`,
                { receiverId: data.uuidFriend },
                { withCredentials: true }
            );
            toast("Votre demande d'ami a bien été envoyée");

        } catch (error) {
            toast("Erreur lors de la demande d'ami");
        }
    };

    return (
        <DivFriendRequests className="friend-requests-container">
            <H3Titre>Ajout d'ami</H3Titre>
            <LabelUuid>Tu peux ajouter des amis grâce à leur identifiant unique (UUID)</LabelUuid>
            <Form onSubmit={handleSubmit(onSubmit)}>
                <InputGroup>
                    <Label>UUID de l'ami</Label>
                    <Input
                        {...register("uuidFriend", {
                            required: "L'UUID est requis",
                            pattern: {
                                value: /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/,
                                message: "Veuillez entrer un UUID valide",
                            },
                        })}
                        placeholder="Entrez l'UUID de votre ami"
                    />
                    {errors.uuidFriend && <ErrorMessage>{errors.uuidFriend.message}</ErrorMessage>}
                </InputGroup>
                <Button type="submit">Ajouter</Button>
            </Form>
        </DivFriendRequests>
    );
};

export default FriendsRequest;
