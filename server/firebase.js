import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
    GoogleAuthProvider,
    FacebookAuthProvider,
    getAuth,
    signInWithPopup,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    updateProfile
} from "firebase/auth";
import {
    getFirestore,
    query,
    getDocs,
    collection,
    where,
    addDoc,
} from "firebase/firestore";
import toast from "react-hot-toast";

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

const signInWithGoogle = async () => {
    try {
        const res = await signInWithPopup(auth, googleProvider);
        const user = res.user;
        const q = query(collection(db, "users"), where("uid", "==", user.uid));
        const docs = await getDocs(q);
        if (docs.docs.length === 0) {
            await addDoc(collection(db, "users"), {
                uid: user.uid,
                name: user.displayName,
                authProvider: "google",
                email: user.email,
            });
        }
        toast.success("Successfully signed in!", {
            id: 'signInWithGoogleSuccess'
        })
    } catch (err) {
        toast.error(err.message, {
            id: 'signInWithGoogleFail'
        })
    }
};

const signInWithFacebook = async () => {
    try {
        const res = await signInWithPopup(auth, facebookProvider);
        const user = res.user;
        const q = query(collection(db, "users"), where("uid", "==", user.uid));
        const docs = await getDocs(q);
        if (docs.docs.length === 0) {
            await addDoc(collection(db, "users"), {
                uid: user.uid,
                name: user.displayName,
                authProvider: "google",
                email: user.email,
            });
        }
        toast.success("Successfully signed in!", {
            id: 'signInWithFacebookSuccess'
        })
    } catch (err) {
        toast.error(err.message,{
            id: 'signInWithFacebookFail'
        });
    }
};

const logInWithEmailAndPassword = async (email, password) => {
    try {
        await signInWithEmailAndPassword(auth, email, password);
        toast.success("Successfully signed in!", {
            id: 'signInWithEmailPassSuccess'
        })
    } catch (err) {
        toast.error(err.message, {
            id: 'signInWithEmailPassFail'
        });
    }
};

const registerWithEmailAndPassword = async (username, email, password) => {
    try {
        const res = await createUserWithEmailAndPassword(auth, email, password);
        const user = res.user;

        await updateProfile(user, {
            displayName: username
        });

        await addDoc(collection(db, "users"), {
            uid: user.uid,
            username,
            authProvider: "local",
            email,
        });
        toast.success("User registered successfully!", {
            id: 'registerWthEmailPassSuccess'
        })
    } catch (err) {
        toast.error(err.message, {
            id: 'registerWithEmailPassFail'
        });
    }
};


const logout = () => {
    try {
        signOut(auth);
        toast.success("Signed out successfully!", {
            id: 'signOutSuccess'
        })
    } catch (err) {
        toast.error(err.message, {
            id: 'signOutFail'
        });
    }
};

export {
    auth,
    db,
    signInWithGoogle,
    signInWithFacebook,
    logInWithEmailAndPassword,
    registerWithEmailAndPassword,
    logout,
};