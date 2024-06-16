import Todos from "@/components/Todos";
import Navbar from "../components/Navbar";

export default async function Index() {
  return (
    <>
      <Navbar />
      <Todos />
    </>
  );
}
