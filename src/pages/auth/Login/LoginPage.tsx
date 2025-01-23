import { Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

import CustomButton from '../../../components/button/custom-button/Custom-Button';
import icon from '../../../constants/icon';
import EmailInput from '../../../components/input/Email-Input';
import PasswordInput from '../../../components/input/Password-Input';

import './login-page.css';
import images from '../../../constants/image';

function LoginPage() {
    const { t } = useTranslation();

    return (
        <div className="login-container">
            <div className="login-left">
                <div className="login-left-inner">
                    <div className="arrow-left">
                        <FontAwesomeIcon icon={faArrowLeft} color="white" />
                    </div>
                    <h2 className="login-left-header">{t('auth.header.createAccount')}</h2>
                    <div className="padding-text">
                        <p className="paragraph">{t('auth.paragraph.lorem-login-page')}</p>
                        <CustomButton title={t('auth.buttonTitle.register')} marginTop="36px" />
                    </div>
                    <div className="login-background">
                        <img src={images.loginBackground}></img>
                    </div>
                </div>
            </div>
            <div className="login-right">
                <div className="login-right-inner">
                    <h2 className="login-right-header">{t('auth.header.login')}</h2>
                    <div className="login-option-container">
                        <CustomButton
                            icon={icon.ggIcon}
                            backgroundColor="transparent"
                            border="1px solid black"
                            color="#001468"
                            width="310px"
                            title={t('auth.buttonTitle.ggLogin')}
                        />
                        <CustomButton
                            icon={icon.fbIcon}
                            backgroundColor="#4168b2"
                            color="white"
                            width="310px"
                            title={t('auth.buttonTitle.fbLogin')}
                        />
                    </div>
                    <div className="divider">
                        <span className="or">{t('auth.header.or')}</span>
                    </div>
                    <div className="input-field-container">
                        <EmailInput />
                        {/* <div style={{ height: 25 }}></div> */}
                        <PasswordInput />
                        <Form.Check
                            className="remember-me"
                            type="checkbox"
                            id="default-checkbox"
                            label={t('auth.checkboxTitle.rememberMe')}
                        />
                        <CustomButton title={t('auth.buttonTitle.login')} />
                        <p
                            style={{
                                marginTop: 12,
                                textAlign: 'center',
                                fontSize: 14,
                                cursor: 'pointer',
                            }}
                        >
                            {t('auth.buttonTitle.forgotPass')}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;
