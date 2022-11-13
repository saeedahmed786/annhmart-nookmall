import React from 'react';
import { Link } from 'react-router-dom';
import wave from "../../assets/wave.png"
import './Footer.css'

export const Footer = () => {
    return (
        <footer className=''>
            <div className="footer-padding">
                <div className="footer-links-container">
                    <ul className="footer-links">
                        <li><Link to="/privacy">Privacy Policy</Link></li>
                        <li><Link to="/terms">Terms of Service</Link></li>
                        <li><Link to="/terms">Refund Policy</Link></li>
                        <li><a href="https://acnhcdn.com/" target="_blank" rel="noreferrer"> Data Source</a></li>
                        <li><a href="mailto:support@theNookmall.com">Contact Us</a></li>
                    </ul>
                </div>
                <div>
                    <img src={wave} alt="wave" className='wave' />
                </div>
                <div className="disclaimer row">
                    <div className='col-md-6'>
                        Animal Crossing is a registered trademark of Nintendo. The Nookmall is not affiliated or endorsed by Nintendo or Animal Crossing. We sell our time and effort spent playing a video game and performing trades with customers online and nothing more. All trademarks and intellectual property found here are property of their original owners, The Nookmall makes no claims to ownership of such property.
                    </div>
                    <div className='col-md-6 icons'>
                        <div>
                            <img src="https://download.logo.wine/logo/Visa_Inc./Visa_Inc.-Logo.wine.png" alt='Payment Methods' />
                        </div>
                        <div>
                            <img src="https://download.logo.wine/logo/Mastercard/Mastercard-Logo.wine.png" alt='Payment Methods' />
                        </div>
                        <div>
                            <img src="https://download.logo.wine/logo/American_Express/American_Express-Logo.wine.png" alt='Payment Methods' />
                        </div>
                        <div>
                            <img src="https://download.logo.wine/logo/PayPal/PayPal-Logo.wine.png" alt='Payment Methods' />
                        </div>
                        <div>
                            <img src="https://download.logo.wine/logo/Apple_Pay/Apple_Pay-Logo.wine.png" alt='Payment Methods' />
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}
