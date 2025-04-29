import NavBar from "../components/NavBar";

export default function DashboardLayout({ children }) {
    return (
        <div>
            <NavBar/>
            {children}
        </div>
    );
}