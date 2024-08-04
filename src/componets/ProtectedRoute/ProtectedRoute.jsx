import {Navigate} from 'react-router-dom';
import {useAuth} from "../../providers/AuthProvider.jsx";
import routes from "../../routes/routes.js";


const ProtectedRoute = ({children}) => {
    const {user} = useAuth();

    if (!user) {

        return <Navigate to={routes.profile.url}/>;
    }

    return children;
};

export default ProtectedRoute;