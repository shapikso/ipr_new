import React, { ReactNode } from 'react';
import Button from "../common/Button/Button";
import {useGoogleLogin, googleLogout } from "@react-oauth/google";
import {SessionService} from "../../services/sessionStorageServices";
import {toast} from "react-toastify";
import {useDispatch, useSelector} from "react-redux";
import {deleteUser, setUser} from "../../redux/redusers/login-reducer";
import {RootState} from "../../redux";

interface LayoutInterface {
    children?: ReactNode;
}

const sessionService = new SessionService();

const Layout = ({children}:LayoutInterface) => {
    const dispatch = useDispatch();
    const isUserLogin = useSelector((state: RootState) => state.loginUser.isUserLogin);

    const login = useGoogleLogin({
        onSuccess: tokenResponse => {
            sessionService.setSession(tokenResponse.access_token);
            dispatch(setUser(!!tokenResponse.access_token));
            toast.success("Login successful");
        },
        onError: () => {
            toast.error("Login failed");
        }
    });

    const logout = () => {
        sessionService.deleteSession();
        toast.success("Logout successful");
        dispatch(deleteUser());
        googleLogout();
    };

    return (
        <div className="px-2">
            <header className="h-12 flex justify-end mb-4">
                { isUserLogin
                    ? <Button onClick={logout}>Logout</Button>
                    : <Button onClick={login}>Login with Google</Button>
                }
            </header>
            {children}
        </div>
    );
};

export default Layout;