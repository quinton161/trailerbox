import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";

import "./header.scss";

import logo from "../../assets/logo.jpeg";
import * as Config from "./../../constants/Config";

const headerNav = [
  {
    display: "Home",
    path: `/${Config.HOME_PAGE}`
  },
  {
    display: "Movies",
    path: `/${Config.HOME_PAGE}/movie`
  },
  {
    display: "TV Series",
    path: `/${Config.HOME_PAGE}/tv`
  }
];

const Header = () => {
  const { pathname } = useLocation();
  const headerRef = useRef(null);
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [visible, setVisible] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const active = headerNav.findIndex((e) => e.path === pathname);

  useEffect(() => {
    // Close mobile menu when changing routes
    setMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    // Prevent body scrolling when mobile menu is open
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.pageYOffset;
      const isScrollingDown = prevScrollPos < currentScrollPos;
      const isScrollingUp = prevScrollPos > currentScrollPos;
      const isScrolledPastThreshold = currentScrollPos > 100;
      const scrollDifference = Math.abs(currentScrollPos - prevScrollPos);
      const scrollDifferenceThreshold = 10; // Minimum scroll difference to trigger header hide/show

      // Apply shrink class if scrolled down a bit
      if (isScrolledPastThreshold) {
        headerRef.current.classList.add("shrink");
      } else {
        headerRef.current.classList.remove("shrink");
      }

      // Only trigger hide/show if the scroll difference is significant
      if (scrollDifference > scrollDifferenceThreshold) {
        // Hide header when scrolling down, show when scrolling up
        if (isScrollingDown && isScrolledPastThreshold) {
          setVisible(false);
        } else if (isScrollingUp) {
          setVisible(true);
        }
      }

      setPrevScrollPos(currentScrollPos);
    };

    window.addEventListener("scroll", handleScroll);
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [prevScrollPos]);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <div 
      ref={headerRef} 
      className={`header ${visible ? 'visible' : 'hidden'}`}
    >
      <div className="header__wrap">
        <div className="logo">
          <img 
            src={logo} 
            alt="Trailer Box Logo" 
            style={{ 
              objectFit: 'contain',
              backgroundColor: 'transparent',
              mixBlendMode: 'lighten',
              filter: 'brightness(3) contrast(1.5) saturate(1.3)',
              opacity: 0.9,
              padding: '2px'
            }} 
          />
          <Link to={`/${Config.HOME_PAGE}`}>Trailer Box</Link>
        </div>

        <ul className={`header__nav ${mobileMenuOpen ? 'active' : ''}`}>
          {headerNav.map((e, i) => (
            <li key={i} className={`${i === active ? "active" : ""}`}>
              <Link to={e.path}>{e.display}</Link>
            </li>
          ))}
        </ul>

        <div 
          className={`header__mobile-toggle ${mobileMenuOpen ? 'active' : ''}`} 
          onClick={toggleMobileMenu}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>

        <div 
          className={`header__overlay ${mobileMenuOpen ? 'active' : ''}`}
          onClick={toggleMobileMenu}
        ></div>
      </div>
    </div>
  );
};

export default Header; 