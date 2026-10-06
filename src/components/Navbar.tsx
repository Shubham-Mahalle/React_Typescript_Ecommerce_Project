import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Badge, IconButton, Menu, MenuItem } from "@mui/material";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import MenuIcon from "@mui/icons-material/Menu";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../redux/store";
import { logout } from "../redux/authSlice";
export default function Navbar() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { user, cart } = useSelector((state: RootState) => ({
    user: state.auth.user,
    cart: state.cart.items,
  }));
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const signOut = () => {
    dispatch(logout());
    setAnchor(null);
    navigate("/");
  };
  return (
    <header className="site-header">
      <div className="nav-wrap">
        <Link to={user ? "/products" : "/"} className="brand">
          <span className="brand-mark">s.</span> shopeasy
        </Link>
        {user && (
          <nav className={`nav-links ${mobileOpen ? "open" : ""}`}>
            <NavLink to="/products">Shop</NavLink>
            <NavLink to="/orders">Orders</NavLink>
          </nav>
        )}
        <div className="nav-actions">
          {user && (
            <IconButton aria-label="Shopping bag" onClick={() => navigate("/cart")}>
              <Badge
                badgeContent={cart.reduce((sum, item) => sum + item.quantity, 0)}
                color="primary"
              >
                <ShoppingBagOutlinedIcon />
              </Badge>
            </IconButton>
          )}
          {user ? (
            <IconButton
              aria-label="Account menu"
              onClick={(event) => setAnchor(event.currentTarget)}
            >
              <PersonOutlineIcon />
            </IconButton>
          ) : (
            <>
              <Link to="/login" className="nav-login">
                Log in
              </Link>
              <Link to="/signup" className="button button-dark nav-signup">
                Sign up
              </Link>
            </>
          )}
          {user && (
            <IconButton
              className="mobile-menu"
              aria-label="Toggle navigation"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              <MenuIcon />
            </IconButton>
          )}
        </div>
      </div>
      <Menu
        anchorEl={anchor}
        open={Boolean(anchor)}
        onClose={() => setAnchor(null)}
      >
        <MenuItem disabled>{user?.name}</MenuItem>
        <MenuItem onClick={signOut}>Log out</MenuItem>
      </Menu>
    </header>
  );
}
