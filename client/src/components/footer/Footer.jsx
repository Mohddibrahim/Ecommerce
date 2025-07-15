import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer bg-dark text-light pt-4 pb-3 mt-auto">
            <div className="container">
                <div className="row">

                    {/* Left: About Links */}
                    <div className="col-md-4 mb-3">
                        <h6 className="text-uppercase fw-bold mb-3">MyShop</h6>
                        <ul className="list-unstyled footer-links">
                            <ul className="list-unstyled footer-links">
                                <li><Link to="/about">About Us</Link></li>
                                <li><Link to="/contact">Contact Us</Link></li>
                                
                                <li><Link to="/terms">Terms & Conditions</Link></li>
                                <li><Link to="/privacy">Privacy Policy</Link></li>
                            </ul>

                        </ul>
                    </div>

                    {/* Center: Social Media */}
                    <div className="col-md-4 mb-3 text-center">
                        <h6 className="text-uppercase fw-bold mb-3">Follow Us</h6>
                        <div className="d-flex justify-content-center gap-3">
                            <a href="#" className="text-light"><i className="fab fa-facebook fa-lg"></i></a>
                            <a href="#" className="text-light"><i className="fab fa-twitter fa-lg"></i></a>
                            <a href="#" className="text-light"><i className="fab fa-instagram fa-lg"></i></a>
                            <a href="#" className="text-light"><i className="fab fa-linkedin fa-lg"></i></a>
                        </div>
                    </div>

                    {/* Right: Contact Info */}
                    <div className="col-md-4 mb-3 text-md-end">
                        <h6 className="text-uppercase fw-bold mb-3">Need Help?</h6>
                        <p className="mb-1">Email: support@myshop.com</p>
                        <p className="mb-0">Phone: +91 98765 43210</p>
                    </div>
                </div>

                <hr className="bg-light" />

                <div className="text-center">
                    <small>© {new Date().getFullYear()} MyShop. All rights reserved.</small>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
