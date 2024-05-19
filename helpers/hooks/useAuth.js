import { auth } from '../../server/firebase';
import { useAuthState } from "react-firebase-hooks/auth";

const useAuth = () => {
    const [user, laoding, error] = useAuthState(auth);
    return user;
};

export default useAuth;