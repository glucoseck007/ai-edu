import { Outlet, Navigate } from "react-router-dom";
import HeaderComponent from "../../components/layout/header/Header";
import FooterComponent from "../../components/layout/footer/Footer";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

const HeaderLayout: React.FC = () => {
    const auth = useSelector((state: RootState) => state.auth);

    return (
        <div className="auth-layout">
            <HeaderComponent />
            <div className="auth-layout__content">
                <Outlet />
            </div>
        </div>
    );
};

export default HeaderLayout;
