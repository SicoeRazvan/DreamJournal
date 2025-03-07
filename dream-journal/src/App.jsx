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
import { getAuth } from "firebase/auth";

export default function App() {
  const [dreams, setDreams] = useState([]);
  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    
      const q = query(
        collection(db, "dreams"),
        where("userId", "==", user?.uid),
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
    
  }, []);

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
