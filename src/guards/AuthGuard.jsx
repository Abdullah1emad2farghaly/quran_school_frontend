import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const AuthGuard = ({ children }) => {
    const { user } = useAuth();

    if (!user)
        return <Navigate to="/login" replace />;

    return children;
};

export default AuthGuard;