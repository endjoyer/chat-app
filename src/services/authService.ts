import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import { auth } from './firebase.ts';
import { User } from '../types/index.ts';

export const mapFirebaseUser = (user: FirebaseUser): User => ({
  id: user.uid,
  email: user.email!,
  displayName: user.displayName,
  photoURL: user.photoURL,
});

export const signUp = async (
  email: string,
  password: string
): Promise<User> => {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );
  return mapFirebaseUser(userCredential.user);
};

export const signIn = async (
  email: string,
  password: string
): Promise<User> => {
  const userCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password
  );
  return mapFirebaseUser(userCredential.user);
};

export const signOut = () => firebaseSignOut(auth);

export const subscribeToAuthChanges = (
  callback: (user: User | null) => void
) => {
  return onAuthStateChanged(auth, (user) => {
    callback(user ? mapFirebaseUser(user) : null);
  });
};
