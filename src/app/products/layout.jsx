import NavBar from "../components/NavBar";

export default function ProductLayout({ children }) {
    return (
        <div>
            <NavBar/>
            {children}
        </div>
    );
}