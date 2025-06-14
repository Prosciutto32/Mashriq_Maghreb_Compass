import { auth } from "$lib/firebase/frebase.client";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, 
    sendPasswordResetEmail, signOut, updateProfile, 
    updateEmail, updatePassword} from "firebase/auth";


export const authHandler ={
    signup: async (email:string, password:string) => {
        return createUserWithEmailAndPassword(auth, email, password);
    },
    login: async (email:string, password:string) => {
        return signInWithEmailAndPassword(auth, email, password);
    },
    logout: async () => {
        return signOut(auth);
    },
    forgotPassword: async (email:string) => {
        return sendPasswordResetEmail(auth, email);
    },
    updateProfile: async (user:any, displayName:string, photoURL:string) => {
        return updateProfile(user, { displayName, photoURL });
    },

    updateEmail: async (user: any, newEmail: string) => {
        return updateEmail(user, newEmail);
    },

    updatePassword: async (user: any, newPassword: string) => {
        return updatePassword(user, newPassword);
    }

}

