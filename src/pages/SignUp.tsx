import axios from "axios";
import { useForm } from "react-hook-form";
import { CSSProperties, useState } from "react";
import { useNavigate } from 'react-router-dom';

type FormData = {
    username: string;
    password: string;
    confirmPassword: string;
};

const containerStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '20px',
    padding: '40px',
    backgroundColor: '#2f3136',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
    maxWidth: '400px',
    margin: '0 auto'
};

const inputStyle: CSSProperties = {
    width: '100%',
    padding: '12px',
    borderRadius: '4px',
    border: '1px solid #202225',
    backgroundColor: '#40444b',
    color: 'white',
    fontSize: '16px'
};

const buttonStyle: CSSProperties = {
    width: '100%',
    padding: '12px',
    backgroundColor: '#5865f2',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '16px',
    cursor: 'pointer'
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
            } else {
                console.error(response.data);
                setPasswordError("Une erreur s'est produite lors de l'inscription : " + response.data);
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div style={containerStyle}>
            <h1>Inscription</h1>
            <form onSubmit={handleSubmit(onSubmit)} style={{ width: '100%' }}>
                <input
                    {...register('username', { required: true })}
                    placeholder="Username"
                    style={inputStyle}
                />
                {errors.username && <span style={{ color: 'red' }}>Veuillez saisir un nom d'utilisateur</span>}
                <div style={{ height: '20px' }} />
                <input
                    {...register('password', { required: true })}
                    type="password"
                    placeholder="Password"
                    style={inputStyle}
                />
                {errors.password && <span style={{ color: 'red' }}>Veuillez saisir un mot de passe</span>}
                <div style={{ height: '20px' }} />
                <input
                    {...register('confirmPassword', { required: true })}
                    type="password"
                    placeholder="Confirm Password"
                    style={inputStyle}
                />
                {errors.confirmPassword && <span style={{ color: 'red' }}> Merci de confirmer votre mot de passe
                    </span>}
                {passwordError && <span style={{ color: 'red' }}>{passwordError}</span>}
                <div style={{ height: '20px' }} />
                <button type="submit" style={buttonStyle}>
                    Inscription
                </button>
            </form>
        </div>
    );
};

export default SignUp;
