import axios, { AxiosError } from "axios";
import { useForm } from "react-hook-form";
import { CSSProperties, useState } from "react";
import { useNavigate } from 'react-router-dom';

type FormData = {
    username: string;
    password: string;
    confirmPassword: string;
};

const formStyle: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "1.5rem",
    width: "100%",
    maxWidth: "400px",
    padding: "2.5rem",
    backgroundColor: 'rgb(76,53,117)',
    borderRadius: "12px",
    boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
};

const containerStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '80vh',
    maxWidth: '90%',
    paddingLeft: '2vh',
};

const inputStyle: CSSProperties = {
    padding: "1rem",
    fontSize: "1rem",
    backgroundColor: 'rgb(91,75,138)', // Secondaire
    border: "none",
    borderRadius: "8px",
    color: 'rgb(255,255,255)',
    outline: 'none',
    transition: 'all 0.3s ease',
};

const buttonStyle: CSSProperties = {
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
};

const SignUp = () => {
    const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>();
    const [passwordError, setPasswordError] = useState<string | null>(null);
    const navigate = useNavigate();

    const validatePassword = (password: string) => {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return passwordRegex.test(password);
    };

    const onSubmit = async (data: FormData) => {
        if (data.password !== watch('confirmPassword')) {
            setPasswordError("Les mots de passes ne sont pas les mêmes.");
            return;
        }

        if (!validatePassword(data.password)) {
            setPasswordError("Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial.");
            return;
        }

        setPasswordError(null);

        try {
            const response = await axios.post('http://localhost:3000/auth/register', data);
            if (response.status === 201) {
                navigate('/login');
            }
        } catch (error) {
            console.error(error);
            const AxiosError = error as AxiosError;
            if (AxiosError.response?.status === 409) {
                setPasswordError("Cet utilisateur existe déjà, veuillez en choisir un autre.");
            } else {
                setPasswordError("Une erreur est survenue.");
            }
        }
    };

    return (
        <div style={containerStyle}>
            <form onSubmit={handleSubmit(onSubmit)} style={formStyle}>
                <h1 style={{color:"white"}}>Inscription</h1>
                <input
                    {...register('username', { required: true })}
                    placeholder="Nom d'utilisateur"
                    style={inputStyle}
                />
                {errors.username && <span style={{ color: 'red' }}>Veuillez saisir un nom d'utilisateur</span>}
                <input
                    {...register('password', { required: true })}
                    type="password"
                    placeholder="Mot de passe"
                    style={inputStyle}
                />
                {errors.password && <span style={{ color: 'red' }}>Veuillez saisir un mot de passe</span>}
                <input
                    {...register('confirmPassword', { required: true })}
                    type="password"
                    placeholder="Confirmer le mot de passe"
                    style={inputStyle}
                />
                {errors.confirmPassword && <span style={{ color: 'red' }}> Merci de confirmer votre mot de passe
                    </span>}
                {passwordError && <span style={{ color: 'red' }}>{passwordError}</span>}
                <button type="submit" style={buttonStyle}>
                    Inscription
                </button>
            </form>
        </div>
    );
};

export default SignUp;
