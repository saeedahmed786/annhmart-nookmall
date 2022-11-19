import React, { useEffect, useState } from 'react';
import Trust from '../../assets/TrustPilot.svg';
import cart from '../../assets/cart.png';
import delivery from '../../assets/delivery.png';
import message from '../../assets/message.png';
import Header from '../../Components/Header/Header';
import "./Home.css"
import Loading from '../../Components/Loading/Loading';
import axios from 'axios';
import { ProductCard } from '../../Components/Products/ProductCard';

export const Home = () => {
    const [loading, setLoading] = useState(false);
    const [products, setProducts] = useState([]);

    const getAllProducts = async () => {
        setLoading(true);
        await axios.get(`/api/products/get/0`).then(res => {
            setLoading(false);
            if (res.status === 200) {
                setProducts(res.data.products);
            } else {
                Error(res.data.errorMessage);
            }
        })
    }

    useEffect(() => {
        getAllProducts();

        return () => {

        }
    }, [])



    return (
        loading ?
            <Loading />
            :
            <>
                <Header />
                <div className='homepage'>
                    <div className='trust-panel'>
                        <div style={{ marginTop: "3.1px" }}>See our <a href='https://www.trustpilot.com/review/www.acnhmart.com?utm_medium=trustbox&utm_source=MicroReviewCount' target='_blank' rel="noreferrer"><strong>802</strong></a> reviews on </div>
                        <div>
                            <img src={Trust} alt="Trust Pilot" />
                        </div>
                    </div>
                    <main>
                        <div className="steps section4 mt-0">
                            <div className="how-section">
                                <div>
                                    <h2 className="tt-title">HOW DOES NOOKMALL WORK?</h2>
                                </div>
                                <div className="row g-3">
                                    <div className="col-md-6 col-lg-4">
                                        <div className='number1'>
                                            <div>
                                                <span class="news-article__dots news-article__dots--top"></span>
                                                <span class="news-article__dots news-article__dots--bottom"></span>
                                            </div>
                                            <div className="upper">
                                                <img src={cart} alt='cart' />
                                                <div className='title'>1. ADD TO CART</div>
                                            </div>
                                            <p className="desc">Add item(s) to your cart and make payment through online.</p>
                                        </div>
                                    </div>
                                    <div className="col-md-6 col-lg-4">
                                        <div className='number2'>
                                            <div>
                                                <span class="news-article__dots news-article__dots--top"></span>
                                                <span class="news-article__dots news-article__dots--bottom"></span>
                                            </div>
                                            <div className="upper">
                                                <img src={message} alt='message' />
                                                <div className='title'>2. MESSAGE US!</div>
                                            </div>
                                            <p className="desc">Click the Messenger icon on the lower right corner of the page and provide us with your order number and Dodo Code!</p>
                                        </div>
                                    </div>
                                    <div className="col-md-6 col-lg-4">
                                        <div className='number3'>
                                            <div>
                                                <span class="news-article__dots news-article__dots--top"></span>
                                                <span class="news-article__dots news-article__dots--bottom"></span>
                                            </div>
                                            <div className="upper">
                                                <img src={delivery} alt='delivery' />
                                                <div className='title'>3. DELIVERY</div>
                                            </div>
                                            <p className="desc">Wait for the delivery staff to arrive within 5-15 minutes!</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='steps product-section'>
                            <div className='row gx-3 gy-2 g-sm-3 mt-0'>
                                <h2 className="tt-title text-center">Popular Items</h2>
                                {
                                    products && products.length > 0 ? products.slice(0, 4).map((product, index) => {
                                        return (
                                            <div className='col-6 col-sm-6 col-md-4 col-lg-3'>
                                                <ProductCard product={product} />
                                            </div>
                                        )
                                    })
                                        :
                                        <div
                                            style={{ minHeight: "52.4vh", color: "red", textAlign: "center", fontSize: "21px", display: "flex", justifyContent: "center", alignItems: "center" }}
                                        >No products found!</div>
                                }
                            </div>
                        </div>
                        <div className="steps section3 my-5">
                            <div class="wave-rule"></div>
                            <div className='title-container'>
                                <div>
                                    <h4>What We Offer</h4>
                                </div>
                            </div>
                            <div className='information-con'>
                                <h1 className="main-information">Buy Bells Animal Crossing New Horizons</h1>
                                <p className='mt-0'>Collecting Bells is a big priority in Animal Crossing to pay off your debt to Tom Nook. You can quickly get Bells from the Nookmall in less than 10 minutes!</p>
                                <h1 className="main-information">Buy Items Animal Crossing</h1>
                                <p className='mt-0'>The Nookmall offers all Animal Crossing New Horizons items. Rare insects and fish, all Villagers, and seasonal items.</p>
                                <h1 className="main-information">Buy ACNH DIY Recipes</h1>
                                <p className='mt-0'>Animal Crossing DIY Recipes is a popular item that can be used to craft a bunch of items. We offer the rarest DIY recipes, DIY Sets, and DIY Islands!</p>
                            </div>
                        </div>
                        <div className="steps section5 w-100 d-none d-sm-block">
                            <div className="container services-listing">
                                <div className="row g-4">
                                    <div className="col-md-6 col-lg-4">
                                        <div className="services-block">
                                            <div className="col-icon">
                                                <i class="fa-solid fa-headphones"></i>
                                            </div>
                                            <div className="col-description">
                                                <h4 className="title">SUPPORT 24/7</h4>
                                                <p>Contact us 24 hours a day, 7 days a week</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6 col-lg-4">
                                        <div className="services-block">
                                            <div className="col-icon">
                                                <i class="fa-solid fa-lock"></i>
                                            </div>
                                            <div className="col-description">
                                                <h4 className="title">SECURE PAYMENT</h4>
                                                <p>Covers all six PCI standard categories</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6 col-lg-4">
                                        <div className="services-block">
                                            <div className="col-icon">
                                                <i class="fa-solid fa-truck-fast"></i>
                                            </div>
                                            <div className="col-description">
                                                <h4 className="title">FAST DELIVERY</h4>
                                                <p>Delivered within 10 minutes</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            </>
    )
}