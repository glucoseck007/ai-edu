import { Form, InputGroup } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import icon from '../../constants/icon';

import './input-global.css';

interface EmailInputProps {
    isRequired?: boolean;
}

function EmailInput({ isRequired }: EmailInputProps) {
    const { t } = useTranslation();
    const [email, setEmail] = useState('');
    const [isValid, setIsValid] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isFocused, setIsFocused] = useState(false);

    const handleFocus = () => setIsFocused(true);
    const handleBlur = () => setIsFocused(false);

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setEmail(value);

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const isValidEmail = emailPattern.test(value);
        setIsValid(isValidEmail);

        if (!isValidEmail) {
            setError(t('auth.error.invalidEmail'));
        } else {
            setError(null);
        }
    };

    return (
        <>
            <Form.Label htmlFor="email-input" className="text-input-label">
                {t('auth.inputLabel.email')}
                {isRequired && <span className="required-asterisk"> *</span>}
            </Form.Label>
            <InputGroup
                className={`text-input ${isFocused ? 'focused' : ''}  ${error ? 'error' : ''
                    }`}
            >
                <InputGroup.Text
                    id="inputGroup-sizing-default"
                    className={`input-group-text ${isFocused ? 'focused' : ''}`}
                >
                    <img
                        src={icon.email}
                        alt="Email icon"
                        style={{
                            filter: isFocused
                                ? 'invert(58%) sepia(94%) saturate(738%) hue-rotate(1deg) brightness(101%) contrast(101%)'
                                : 'invert(0%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(0%) contrast(0%)',
                        }}
                    />
                </InputGroup.Text>
                <Form.Control
                    className={`text-input-control ${error ? 'is-invalid' : ''}`}
                    type="email"
                    value={email}
                    onChange={handleEmailChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    placeholder={t('auth.placeholder.email')}
                    aria-label={t('auth.inputLabel.email')}
                    aria-describedby="basic-addon1"
                    isInvalid={!isValid}
                    required={isRequired}
                />
            </InputGroup>
            {error && (
                <div className="real-time-error-alert">
                    <span className="alert-message">{error}</span>
                </div>
            )}
        </>
    );
}

export default EmailInput;
