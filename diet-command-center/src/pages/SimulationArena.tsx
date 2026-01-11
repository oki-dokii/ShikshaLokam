import { Link } from "react-router-dom";

const SimulationArena = () => {
    return (
        <div style={{ padding: "40px", backgroundColor: "#0f172a", minHeight: "100vh", color: "white" }}>
            <h1 style={{ fontSize: "2rem", fontWeight: "bold", marginBottom: "20px" }}>Safe Mode Active</h1>
            <p>If you see this, the routing is working correctly.</p>
            <br />
            <Link to="/" style={{ color: "#38bdf8", textDecoration: "underline" }}>Back to Dashboard</Link>
        </div>
    );
};

export default SimulationArena;
