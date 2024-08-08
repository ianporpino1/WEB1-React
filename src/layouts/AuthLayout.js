import AuthHeader from "../components/Header/AuthHeader";
import Footer from "../components/Footer/Footer";
import { Outlet } from "react-router-dom";

export default function AuthLayout() {
    return (
      <>
        <AuthHeader></AuthHeader>
        <Outlet />
        <Footer></Footer>
      </>
    );
}