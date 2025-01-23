import { Form, InputGroup } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import icon from '../../constants/icon';

import './input-global.css';

interface PasswordInputProps {
    isRequired?: boolean;
}

function PasswordInput({ isRequired }: PasswordInputProps) {
    const { t } = useTranslation();
    const [password, setPassword] = useState('');
    const [isValid, setIsValid] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isFocused, setIsFocused] = useState(false);

    const handleFocus = () => setIsFocused(true);
    const handleBlur = () => setIsFocused(false);

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setPassword(value);

        const minLength = /.{8,}/;
        const uppercase = /[A-Z]/;
        const specialChar = /[!@#$%^&*(),.?":{}|<>]/;

        const isValidPassword =
            minLength.test(value) && uppercase.test(value) && specialChar.test(value);
        setIsValid(isValidPassword);

        if (!isValidPassword) {
            setError(t('auth.error.invalidPassword'));
        } else {
            setError(null);
        }
    };

    return (
        <>
            <Form.Label htmlFor="password-input" className="text-input-label">
                {t('auth.inputLabel.password')}
                {isRequired && <span className="required-asterisk"> *</span>}
            </Form.Label>
            <InputGroup
                className={`text-input ${isFocused ? 'focused' : ''} ${error ? 'error' : ''
                    }`}
            >
                <InputGroup.Text
                    id="inputGroup-sizing-default"
                    className={`input-group-text ${isFocused ? 'focused' : ''}`}
                >
                    <img
                        src={icon.lock}
                        alt="Password icon"
                        style={{
                            filter: isFocused
                                ? 'invert(58%) sepia(94%) saturate(738%) hue-rotate(1deg) brightness(101%) contrast(101%)'
                                : 'invert(0%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(0%) contrast(0%)',
                        }}
                    />
                </InputGroup.Text>
                <Form.Control
                    className="text-input-control"
                    type="password"
                    value={password}
                    onChange={handlePasswordChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    placeholder={t('auth.placeholder.password')}
                    aria-label={t('auth.inputLabel.password')}
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

export default PasswordInput;
