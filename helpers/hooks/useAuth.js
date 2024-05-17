import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../server/firebase';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

const useAuth = () => {
    const [user, setUser] = useState(null);
    
    const router = useRouter();

    useEffect(() => {
        return onAuthStateChanged(auth, (user) => {
            setUser(user);
            if (!user) {
                router.push('/Login');
            } else {
                router.push('/Home');
            }
        })
    }, [router]);

    return user;
};

export default useAuth;