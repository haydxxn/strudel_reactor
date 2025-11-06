import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();

  return (
    <nav
      className="navbar navbar-dark"
      style={{ backgroundColor: "#181818", borderBottom: "1px solid #282828" }}
    >
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          Strudel Demo
        </Link>
        <div className="d-flex">
          {location.pathname === "/" ? (
            <Link to="/how-to-use" className="btn btn-dark btn-sm">
              How to Use
            </Link>
          ) : (
            <Link to="/" className="btn btn-dark btn-sm">
              Back to Demo
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
