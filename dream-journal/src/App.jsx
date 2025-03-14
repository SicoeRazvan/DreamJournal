import { Route, Routes, BrowserRouter, Navigate } from "react-router-dom";
import Login from "./Components/Login";
import Signup from "./Components/SignUp";
import Home from "./Components/Home";
import { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { db } from "./firebase";
import Header from "./Components/Header";
import About from "./Components/About";
import { getAuth, onAuthStateChanged } from "firebase/auth";

export default function App() {
  const [dreams, setDreams] = useState([]);
  const [user, setUser] = useState(null);
  const auth = getAuth();

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (authUser) => {
      setUser(authUser); 
    });

    return () => unsubscribeAuth(); 
  }, [auth]);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "dreams"),
      where("userId", "==", user.uid),
      orderBy("date", "desc")
    );
    const unsubscribe = onSnapshot(q, (QuerySnapshot) => {
      let dreamsArr = [];
      QuerySnapshot.forEach((doc) => {
        dreamsArr.push({ ...doc.data(), id: doc.id });
      });
      setDreams(dreamsArr);
    });
    return () => unsubscribe();
  }, [user]);

  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<Home dreams={dreams} />} />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
