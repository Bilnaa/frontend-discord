import { useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { CSSProperties } from "react";
import useStoreLogin from "../utils/store/useStoreLogin";
import {Link, useNavigate } from 'react-router-dom';
import useStoreUser from "../utils/store/useStoreUser";


type FormData = {
    username: string; 
    password: string;
};

const styles: { [key: string]: CSSProperties } = {
    container: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh', 
        width: '100%',   
        margin: 0,      
        position: 'absolute', 
        top: 0,        
        left: 0,
    },
    form: {
        display: "flex",
        flexDirection: "column",
        gap: "1.5rem",
        width: "100%",
        maxWidth: "400px",
        padding: "2.5rem",
        backgroundColor: 'rgb(76,53,117)',
        borderRadius: "12px",
        boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
    },
    inputGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
    },
    label: {
        color: 'rgba(255,255,255,0.5)',
        fontSize: '0.9rem',
        fontWeight: '500',
    },
    input: {
        padding: "1rem",
        fontSize: "1rem",
        backgroundColor: 'rgb(91,75,138)', // Secondaire
        border: "none",
        borderRadius: "8px",
        color: 'rgb(255,255,255)',
        outline: 'none',
        transition: 'all 0.3s ease',
    },
    button: {
        padding: "1rem",
        fontSize: "1rem",
        backgroundColor: 'rgb(120,88,166)',
        color: "white",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
        transition: "all 0.3s ease",
        fontWeight: '600',
        marginTop: '1rem',
    },
    buttonHover: {
        backgroundColor: 'rgb(130,98,176)',
    },
    errorMessage: {
        color: '#ff6b6b',
        fontSize: "0.875rem",
    },
    successMessage: {
        color: '#69db7c',
        fontSize: "0.875rem",
    },
};

const Login = () => {
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const { login } = useStoreLogin();
    const { setUser, clearUser } = useStoreUser();

    const onSubmit = async (data: FormData) => {
        setLoading(true);
        setErrorMessage("");
        setSuccessMessage("");
        try {
            const response = await axios.post("http://localhost:3000/auth/login", data, { withCredentials: true });
            if (response.status !== 201) {
                throw new Error("Échec de la connexion");
            }
            await axios.get("http://localhost:3000/auth/me", { withCredentials: true }).then((response) => {
                setUser(response.data);
                login();
                setSuccessMessage("Connexion réussie !");
            }).catch((error) => {
                console.error("Impossible de récupérer les informations de l'utilisateur", error);
                setErrorMessage("Échec de la connexion. Veuillez vérifier vos identifiants et réessayer.");
                clearUser();
            });
            setTimeout(() => {
                setSuccessMessage("");
                navigate("/");
            }, 1000);

        } catch (error) {
            setErrorMessage("Échec de la connexion. Veuillez vérifier vos identifiants et réessayer.");
            console.error("Échec de la connexion", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <form onSubmit={handleSubmit(onSubmit)} style={styles.form}>
                <div style={styles.inputGroup}>
                    <label style={styles.label}>Nom d'utilisateur</label>
                    <input
                        type="text"
                        {...register("username", {required: "Le nom d'utilisateur est requis"})}
                        style={styles.input}
                        placeholder="Entrez votre nom d'utilisateur"
                    />
                    {errors.username && <p style={styles.errorMessage}>{errors.username.message}</p>}
                </div>
                <div style={styles.inputGroup}>
                    <label style={styles.label}>Mot de passe</label>
                    <input
                        type="password"
                        {...register("password", {required: "Le mot de passe est requis"})}
                        style={styles.input}
                        placeholder="Entrez votre mot de passe"
                    />
                    {errors.password && <p style={styles.errorMessage}>{errors.password.message}</p>}
                </div>
                <button
                    type="submit"
                    style={styles.button}
                    onMouseOver={(e) => (e.currentTarget.style.backgroundColor = styles.buttonHover.backgroundColor || '')}
                    onMouseOut={(e) => (e.currentTarget.style.backgroundColor = styles.button.backgroundColor || '')}
                    disabled={loading}
                >
                    {loading ? "Connexion en cours..." : "Se connecter"}
                </button>
                {errorMessage && <p style={styles.errorMessage}>{errorMessage}</p>}
                {successMessage && <p style={styles.successMessage}>{successMessage}</p>}

                <Link
                    to="/signup"
                >
                    Pas de compte ? Inscrivez-vous
                </Link>
            </form>
        </div>
    );
};

export default Login;