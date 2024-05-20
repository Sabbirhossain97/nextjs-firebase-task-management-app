import { auth } from '../../server/firebase';
import { useAuthState } from "react-firebase-hooks/auth";
import Cookies from 'js-cookie';

const useAuth = () => {
    const [user, laoding, error] = useAuthState(auth);
    if(user){
        Cookies.set('token', user.accessToken)
    } else [
        Cookies.remove('token')
    ]
    return user;
};

export default useAuth;