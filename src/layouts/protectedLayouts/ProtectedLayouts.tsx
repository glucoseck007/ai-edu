import { Outlet } from 'react-router-dom';
import HeaderComponent from '../../components/header/Header';
import FooterComponent from '../../components/footer/Footer';

const ProtectedLayouts: React.FC = () => {
    return (
        <div className="auth-layout">
            <HeaderComponent />
            <div className="auth-layout__content">
                <Outlet />
            </div>
            <FooterComponent />
        </div>
    );
};

export default ProtectedLayouts;