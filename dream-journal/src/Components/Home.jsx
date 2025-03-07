import { Box, Container, Typography } from "@mui/material";
import Header from "./Header";
import AddDream from "./AddDream";
import DisplayDreams from "./DisplayDreams";
import { useAuth } from "./AuthContext";

export default function Home(props) {
  const { userData } = useAuth();

  return (
    <>
      <AddDream userId={userData?.uid} />
      <DisplayDreams dreams={props.dreams} userId={userData?.uid} />
    </>
  );
}
