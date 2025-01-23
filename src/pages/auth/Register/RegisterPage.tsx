import './register.css';

import { faSchool, faUser } from '@fortawesome/free-solid-svg-icons';
import { Trans, useTranslation } from 'react-i18next';
import { Form } from 'react-bootstrap';

import TextInput from '../../../components/input/Text-Input';
import EmailInput from '../../../components/input/Email-Input';
import PasswordInput from '../../../components/input/Password-Input';
import PhoneInput from '../../../components/input/Phone-Input';
import CustomButton from '../../../components/button/custom-button/Custom-Button';
import images from '../../../constants/image';
import CustomToggleButton from '../../../components/button/toggle-button/Custom-Toggle-Button';

function RegisterPage() {
    const { t } = useTranslation();
    const policyUrl = '';
    const termsUrl = '';

    return (
        <div className="register-container">
            <div className="register-left">
                <div className="register-left-inner">
                    <h2 className="register-left-header">{t('auth.header.register')}</h2>
                    <TextInput
                        label={t('auth.inputLabel.fullname')}
                        placeholder={t('auth.placeholder.fullname')}
                        icon={faUser}
                        isRequired
                    />
                    <EmailInput isRequired />
                    <PasswordInput isRequired />
                    <PhoneInput isRequired />
                    <CustomToggleButton />
                    <TextInput
                        label={t('auth.inputLabel.school')}
                        placeholder={t('auth.placeholder.school')}
                        icon={faSchool}
                    />

                    <Form.Check
                        className="policy"
                        type="checkbox"
                        id="default-checkbox"
                        label={
                            <Trans
                                i18nKey="auth.checkboxTitle.policyAcceptance"
                                values={{ policyUrl, termsUrl }}
                                components={{
                                    a: (
                                        <a
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            style={{ color: '#0656f2', fontWeight: 'bold' }}
                                        />
                                    ),
                                }}
                            />
                        }
                    />
                    <CustomButton title={t('auth.buttonTitle.register')} />
                </div>
            </div>
            <div className="register-right">
                <div className="register-right-inner">
                    <h2 className="register-right-header">{t('auth.header.login')}</h2>
                    <div className="padding-text">
                        <p className="paragraph">{t('auth.paragraph.lorem-register-page')}</p>
                        <CustomButton title={t('auth.buttonTitle.login')} marginTop="36px" />
                    </div>
                    <div className="login-background">
                        <img src={images.loginBackground}></img>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RegisterPage;
