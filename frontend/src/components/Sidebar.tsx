import React from "react";
import styles from "../../styles/sidebar.module.css";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

const sidebarLinks = [
  { name: "Register", href: "/register" },
  { name: "Login", href: "/login" },
  { name: "User Dashboard", href: "/user-dashboard" },
  { name: "Admin Dashboard", href: "/admin-dashboard" },
  { name: "Supplier Dashboard", href: "/supplier-dashboard" },
];

const Sidebar: React.FC<SidebarProps> = ({ open, onClose }) => {
  if (!open) return null;
  return (
    <aside
      className={open ? styles.sidebarOverlay : styles.sidebarOverlayHidden}
      onClick={onClose}
    >
      <div className={styles.sidebar} onClick={(e) => e.stopPropagation()}>
        <button
          className={styles.closeBtn}
          onClick={onClose}
          aria-label="Close sidebar"
        >
          &times;
        </button>
        <nav>
          <ul className={styles.sidebarList}>
            {sidebarLinks.map((link) => (
              <li key={link.name}>
                <a
                  href={link.href}
                  className={styles.sidebarLink}
                  onClick={onClose}
                >
                  {link.name}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
