import axios, { AxiosError } from "axios";
import { useForm } from "react-hook-form";
import { CSSProperties, useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';

type FormData = {
    username: string;
    password: string;
    confirmPassword: string;
};

const styles: { [key: string]: CSSProperties } = {
    container: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        width: '100%',
        margin: 0,
        padding: 0,
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
    input: {
        padding: "1rem",
        fontSize: "1rem",
        backgroundColor: 'rgb(91,75,138)',
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
    title: {
        color: "white",
        marginBottom: "1rem",
        textAlign: "center",
    },
    errorMessage: {
        color: 'red',
        fontSize: "0.875rem",
        marginTop: "0.25rem",
    },
    label: {
        color: 'rgba(255,255,255,0.5)',
        fontSize: '0.9rem',
        fontWeight: '500',
        alignSelf: 'flex-start',
    },
    inputGroup: {
        marginBottom: '1rem',
        display: 'flex',
        flexDirection: 'column',
    },
};

const SignUp = () => {
    const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>();
    const [passwordError, setPasswordError] = useState<string | null>(null);
    const [password, setPassword] = useState<string>(''); // Ajout de l'état pour le mot de passe
    const [showCriteria, setShowCriteria] = useState<boolean>(true); // Ajout de l'état pour afficher les critères
    const navigate = useNavigate();

    const validatePassword = (password: string) => {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return passwordRegex.test(password);
    };

    const handlePasswordChange = (password: string) => {
        setPassword(password);
    };

    const isLengthValid = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[@$!%*?&]/.test(password);

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
        <div style={styles.container}>
            <form onSubmit={handleSubmit(onSubmit)} style={styles.form}>
                <h1 style={styles.title}>Inscription</h1>
                <div style={styles.inputGroup}>
                    <label style={styles.label}>Nom d'utilisateur</label>
                    <input
                        {...register('username', { required: true })}
                        placeholder="Votre nom d'utilisateur"
                        style={styles.input}
                    />
                    {errors.username && <span style={styles.errorMessage}>Veuillez saisir un nom d'utilisateur</span>}
                </div>
                <div style={styles.inputGroup}>
                    <label style={styles.label}>Mot de passe</label>
                    <input
                        {...register('password', { required: true })}
                        type="password"
                        placeholder="Mot de passe"
                        style={styles.input}
                        onChange={(e) => handlePasswordChange(e.target.value)}
                        onFocus={() => setShowCriteria(true)}
                    />
                    {errors.password && <span style={styles.errorMessage}>Veuillez saisir un mot de passe</span>}
                    {password && showCriteria && (
                        <div>
                            <div>
                                <FontAwesomeIcon icon={isLengthValid ? faCheck : faTimes} style={{ color: isLengthValid ? 'green' : 'red' }} />
                                <span style={{ marginLeft: '0.5rem', color: isLengthValid ? 'green' : 'red' }}>
                                    Le mot de passe doit contenir au moins 8 caractères.
                                </span>
                            </div>
                            <div>
                                <FontAwesomeIcon icon={hasUpperCase ? faCheck : faTimes} style={{ color: hasUpperCase ? 'green' : 'red' }} />
                                <span style={{ marginLeft: '0.5rem', color: hasUpperCase ? 'green' : 'red' }}>
                                    Le mot de passe doit contenir au moins une majuscule.
                                </span>
                            </div>
                            <div>
                                <FontAwesomeIcon icon={hasLowerCase ? faCheck : faTimes} style={{ color: hasLowerCase ? 'green' : 'red' }} />
                                <span style={{ marginLeft: '0.5rem', color: hasLowerCase ? 'green' : 'red' }}>
                                    Le mot de passe doit contenir au moins une minuscule.
                                </span>
                            </div>
                            <div>
                                <FontAwesomeIcon icon={hasNumber ? faCheck : faTimes} style={{ color: hasNumber ? 'green' : 'red' }} />
                                <span style={{ marginLeft: '0.5rem', color: hasNumber ? 'green' : 'red' }}>
                                    Le mot de passe doit contenir au moins un chiffre.
                                </span>
                            </div>
                            <div>
                                <FontAwesomeIcon icon={hasSpecialChar ? faCheck : faTimes} style={{ color: hasSpecialChar ? 'green' : 'red' }} />
                                <span style={{ marginLeft: '0.5rem', color: hasSpecialChar ? 'green' : 'red' }}>
                                    Le mot de passe doit contenir au moins un caractère spécial.
                                </span>
                            </div>
                        </div>
                    )}
                </div>
                <div style={styles.inputGroup}>
                    <label style={styles.label}>Confirmer le mot de passe</label>
                    <input
                        {...register('confirmPassword', { required: true })}
                        type="password"
                        placeholder="Confirmer le mot de passe"
                        style={styles.input}
                        onFocus={() => setShowCriteria(false)} // Masquer les critères lors du focus
                    />
                    {errors.confirmPassword && <span style={styles.errorMessage}>Merci de confirmer votre mot de passe</span>}
                </div>
                {passwordError && <span style={styles.errorMessage}>{passwordError}</span>}
                <button type="submit" style={styles.button}>
                    Inscription
                </button>
                <Link
                    to="/login"
                >
                    Déjà un compte ? Connectez-vous
                </Link>
            </form>
        </div>
    );
};

export default SignUp;