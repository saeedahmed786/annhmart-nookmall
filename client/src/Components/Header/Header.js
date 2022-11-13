import React from 'react'
import { Link } from 'react-router-dom'
import Bells from "../../assets/bells.png"
import NMT from "../../assets/nmt.png"
import "./Header.css"

const Header = () => {
    return (
        <header>
            <div className="banner-container">
                <div className="banner-overlay">
                    <div className="text-area">
                        <div className="text-area-container">
                            <h5 className='first'>Fastest ACNH Delivery Service</h5>
                            <h5 className='fs-1 my-2'>
                                All Orders Delivered <br /> Within 10 Minutes
                            </h5>
                            <div className='free-gift'>🎁 FREE GIFT WITH EVERY PURCHASE 🎁</div>
                        </div>
                        <div className="shop-button-container">
                            <Link to="/all-products">
                                <button className="shop-button" id="start-shopping">Browse Store</button>
                            </Link>
                            <Link to="/all-products">
                                <button className="two-button" id="start-shopping">2.0.0. Items</button>
                            </Link>
                            {/* <div className="sub-button-container">
                                    <Link to="/all-products?62fd4ba86a5cd9f36590744c">
                                        <button className="shop-sub-button">
                                            <span>Buy</span>
                                            <div className="menu-icon-container">
                                                <img alt="Animal Crossing Bells" src={Bells} />
                                            </div>
                                        </button>
                                    </Link>
                                    <Link to="/all-products?62fd4bb46a5cd9f365907450">
                                        <button className="shop-sub-button">
                                            <span>Buy</span>
                                            <div className="menu-icon-container">
                                                <img alt="Nook Mile Tickets" src={NMT} />
                                            </div>
                                        </button>
                                    </Link>
                                </div> */}
                        </div>
                    </div>
                </div>
                {/* <div className="social-container" style={{ visibility: "none" }}>
                    <Link to="https://www.instagram.com/the_nookmall"><i className="fab fa-instagram"></i></Link>
                    <Link to="https://twitter.com/the_nookmall"><i className="fab fa-twitter"></i></Link>
                    <Link to="https://www.facebook.com/thenookmall"><i className="fab fa-facebook-square"></i></Link>
                    <Link to="https://www.tiktok.com/@nookmall"><i className="fab fa-tiktok"></i></Link>
                </div> */}
                <div className='trust-panel'>

                </div>
            </div>
        </header>
    )
}

export default Header
