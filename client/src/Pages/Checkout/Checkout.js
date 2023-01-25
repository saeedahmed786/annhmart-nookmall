import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { listProducts } from '../../Redux/Redux';
import { isAuthenticated } from '../../Components/Auth/auth';
import { Error, Success } from '../../Components/Messages/messages';
import "./Checkout.css"
import Loading from '../../Components/Loading/Loading';
import moment from 'moment';
import { ButtonWrapper } from '../../Components/Payments/Paypal';
import { StripeForm } from '../../Components/Payments/StripeForm';
import { DeleteFilled } from '@ant-design/icons';
import { Link, useHistory } from 'react-router-dom';
import visa from '../../assets/visa.svg'
import master from '../../assets/mastercard.svg'
import american from '../../assets/americanexp.svg'
import stripe from '../../assets/stripe.svg'
import diner from '../../assets/diner.svg'
import paypal from '../../assets/paypal.svg'
import { Radio } from 'antd';
import {
    PayPalScriptProvider,
} from "@paypal/react-paypal-js";
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

const Checkout = () => {
    const history = useHistory();
    const userId = isAuthenticated()._id;
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [stripeLoading, setStripeLoading] = useState(false);
    const [totalPrice, setTotalPrice] = useState('');
    const [inititalTotalPrice, setInitialTotalPrice] = useState('');
    const [discountCode, setDiscountCode] = useState("");
    const [isDebit, setIsDebit] = useState(false);
    const [discount, setDiscount] = useState("0");
    const [tipAmount, setTipAmount] = useState("0");
    const [customTip, setCustomTip] = useState("0");
    const [clientSecret, setClientSecret] = useState("");

    const getCartProducts = async () => {
        setLoading(true);
        await axios.get(`/api/cart/get`, {
            headers: {
                'authorization': 'Bearer ' + localStorage.getItem('token')
            }
        }).then(res => {
            setLoading(false);
            if (res.status === 200) {
                setProducts(res.data.products);
                setInitialTotalPrice(res.data.products.reduce((a, b) => a + b.qty * b.price, 0));
                setTotalPrice(res.data.products.reduce((a, b) => a + b.qty * b.price, 0));
            }
            else if (res.status === 201) {
                setProducts([]);
            } else {
                Error(res.data.errorMessage);
            }
        }).catch(error => setLoading(false))
    }

    useEffect(() => {
        if (isAuthenticated()) {
            getCartProducts();
        }

        return () => {

        }
    }, []);

    const dispatch = useDispatch();

    const removeHandler = async (cartId) => {
        await axios.delete(`/api/cart/delete/${cartId}`, {
            headers: {
                'authorization': 'Bearer ' + localStorage.getItem('token')
            }
        }).then(res => {
            if (res.status === 200) {
                Success(res.data.successMessage)
                dispatch(listProducts(userId));
                getCartProducts();
            } else {
                Error(res.data.errorMessage)
            }
        })

    }


    const saveQtyToDb = async (productId, qty) => {
        await axios.put(`/api/cart/update/qty/${productId}`, { qty }, {
            headers: {
                'authorization': 'Bearer ' + localStorage.getItem('token')
            }
        }).then(res => {
            if (res.status === 200) {
                Success(res.data.successMessage);
                getCartProducts();
            } else {
                Error(res.data.errorMessage);
            }
        })
    }

    const emptyCart = async () => {
        await axios.delete(`/api/cart/empty`, {
            headers: {
                'authorization': 'Bearer ' + localStorage.getItem('token')
            }
        }).then(res => {
            if (res.status === 200) {
                Success(res.data.successMessage);
                history.push("/cart");
            } else {
                Error(res.data.errorMessage);
            }
        })
    }

    const transactionSuccess = async (data) => {
        setLoading(true);
        await axios.post('/api/orders/place-order',
            {
                placed: moment().format("dddd, MMMM Do YYYY, h:mm:ss a"),
                cartProducts: products,
                paymentData: data,
                subTotal: inititalTotalPrice,
                tipAmount,
                discount,
                totalPrice,
                email: isAuthenticated().email,
                name: isAuthenticated().email,
            }
            , {
                headers: {
                    'authorization': 'Bearer ' + localStorage.getItem('token')
                }
            }
        )
            .then(res => {
                setLoading(false)
                if (res.status === 200) {
                    Success(res.data.successMessage);
                    emptyCart();
                } else {
                    Error(res.data.errorMessage)
                }
            })

    }

    const appearance = {
        theme: 'stripe',
    };

    const options = {
        clientSecret,
        appearance,
    }


    const createPaymentIntent = () => {
        setStripeLoading(true);
        fetch("/create-payment-intent", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ totalPrice: parseInt(totalPrice) + parseInt(tipAmount) }),
        })
            .then((res) => res.json())
            .then((data) => {
                setClientSecret(data.clientSecret);
                setIsDebit(true);
                setStripeLoading(false)
            });
    }

    const checkDiscountCode = async () => {
        await axios.post(`/api/discounts/check`, { discountCode }, {
            headers: {
                'authorization': 'Bearer ' + localStorage.getItem('token')
            }
        }).then(res => {
            if (res.status === 200) {
                if (res.data.type === "percentage") {
                    setTotalPrice(parseInt(totalPrice) - (parseInt(totalPrice) * res.data.discount / 100).toFixed(2))
                    setDiscount(parseInt(totalPrice) * (res.data.discount / 100).toFixed(2));
                } else {
                    setTotalPrice(parseInt(totalPrice) - (parseInt(res.data.discount)).toFixed(2))
                    setDiscount(res.data.discount);
                }
                Success("Discount Applied");
            } else {
                setDiscount("0")
                Error(res.data.errorMessage);
            }
        }).catch(err => {
            setDiscount("0");
            Error("Invalid Code")
        })
    }

    const handleTipAmount = (d) => {
        setTipAmount(parseInt(d).toFixed(2));
    }


    return (
        <div className='checkout'>
            <div>
                <div className='inner'>
                    <h1 className='title mb-0'>Check out</h1>
                    <div className="user-cart">
                        <div className='table-responsive'>
                            <table>
                                <tbody>
                                    {
                                        loading ?
                                            <Loading />
                                            :
                                            products?.length > 0 ?
                                                <>
                                                    {
                                                        products.map(product => {
                                                            return (
                                                                <tr>
                                                                    <td>
                                                                        <div className="item-container">
                                                                            <img className="cart-preview" src={product?.image?.url} alt={product.title} />
                                                                            <div className="item-text-section">
                                                                                <div className="item-name">{product.title}</div>
                                                                            </div>
                                                                        </div>
                                                                    </td>
                                                                    <td className="number-display fw-bold">${product.price}</td>
                                                                    <td className="number-display">
                                                                        <div className="qty-box">
                                                                            <div>
                                                                                <button type="submit" className='bg-white' onClick={() => product.qty > 1 && saveQtyToDb(product.productId, parseInt(product.qty) - 1)}>
                                                                                    <i className="fas fa-minus"></i>
                                                                                </button>
                                                                                <input name="quantity" className="cart-quantity-box" value={product.qty} />
                                                                                <input type="hidden" />
                                                                                <button type="submit" className='bg-white' onClick={() => saveQtyToDb(product.productId, parseInt(product.qty) + 1)}>
                                                                                    <i className="fas fa-plus"></i>
                                                                                </button>
                                                                            </div>
                                                                        </div>
                                                                    </td>
                                                                    <td>
                                                                        <button className='bg-white' onClick={() => removeHandler(product.productId)}>
                                                                            <DeleteFilled className='text-dark' />                                                               </button>
                                                                    </td>
                                                                </tr>
                                                            )
                                                        })
                                                    }
                                                </>
                                                :
                                                <tr>
                                                    <td className="empty-cart text-center" colspan="5">Your cart is empty.</td>
                                                </tr>
                                    }
                                </tbody>
                            </table>
                        </div>
                        <div className='row bottom-container mt-4'>
                            <div className='col-md-6 px-0'>
                                <div className='px-3'>
                                    <h3>Add Tip</h3>
                                    <p>Show your support for the team at the Nookmall</p>
                                </div>
                                <div className='tip-container px-3'>
                                    <div>
                                        <Radio.Group defaultValue="0" buttonStyle='solid' onChange={(e) => handleTipAmount(e.target.value)}>
                                            <Radio.Button value={Math.round(5 / 100 * totalPrice).toFixed(2)}><div>5%<br />${Math.round(5 / 100 * totalPrice).toFixed(2)}</div></Radio.Button>
                                            <Radio.Button value={Math.round(10 / 100 * totalPrice).toFixed(2)}><div>10%<br />${Math.round(10 / 100 * totalPrice).toFixed(2)}</div></Radio.Button>
                                            <Radio.Button value={Math.round(15 / 100 * totalPrice).toFixed(2)}><div>15%<br />${Math.round(15 / 100 * totalPrice).toFixed(2)}</div></Radio.Button>
                                            <Radio.Button value="0"><div className='mt-2 pt-1'>None</div></Radio.Button>
                                        </Radio.Group>
                                    </div>
                                    <div className='custom-tip-container'>
                                        <div className='w-100'>
                                            <input type='number' placeholder='Custom Tip' onChange={(e) => e.target.value ? parseInt(e.target.value) === 0 ? setCustomTip("0") : setCustomTip(e.target.value) : setCustomTip(0)} />
                                        </div>
                                        <button className='btn update-btn' onClick={() => handleTipAmount(customTip)}>
                                            <span>Update</span>
                                        </button>
                                    </div>
                                    <p className='text-muted'>Thank you, we appreciate it</p>
                                </div>
                            </div>
                            <div className='col-md-6 d-flex justify-content-center'>
                                <div className='price-discount-container'>
                                    <div className='custom-tip-container'>
                                        <div className='w-100'>
                                            <input type='text' placeholder='Discount Code' onChange={(e) => setDiscountCode(e.target.value)} />
                                        </div>
                                        <button className='btn update-btn' onClick={checkDiscountCode}>
                                            <span>Apply</span>
                                        </button>
                                    </div>
                                    <div className='item'>
                                        <p>Subtotal</p>
                                        <h6>${inititalTotalPrice}</h6>
                                    </div>
                                    <div className='item'>
                                        <p>Discount</p>
                                        <h6>-${
                                            discount
                                        }</h6>
                                    </div>
                                    <div className='item'>
                                        <p>Tip</p>
                                        <h6>${tipAmount}</h6>
                                    </div>
                                    <div className='item'>
                                        <p style={{ opacity: "1", fontWeight: "bold" }}><b>Total</b></p>
                                        <h6>USD <b>${parseInt(totalPrice) + parseInt(tipAmount)}</b></h6>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="form-payment-container my-3">
                        <h3 className='sub-title mt-3'>Payment</h3>
                        <p>All transactions are secure and encrypted</p>
                        {
                            <div className="payment-information p-4">
                                <div className="payment-container">
                                    <div className='image-pay-left'>
                                        <div className="form-check radio d-flex justify-content-between align-items-center">
                                            <div>
                                                <input className="form-check-input"
                                                    onClick={() => { createPaymentIntent() }}
                                                    defaultChecked={false}
                                                    checked={isDebit} type="radio" />
                                                <label className="form-check-label">
                                                    Credit Card
                                                </label>
                                            </div>
                                            <div className='pay-images'>
                                                <img src={master} alt="master" className='each-image' />
                                                <img src={visa} alt="visa" className='each-image' />
                                                <img src={american} alt="american" className='each-image' />
                                                <img src={diner} alt="diner" className='each-image' />
                                                <img src={stripe} alt="stripe" className='each-image' />
                                            </div>
                                        </div>
                                        {
                                            stripeLoading ?
                                                <Loading />
                                                :
                                                (
                                                    isDebit &&
                                                    <div className='border p-4 py-2 pt-0 my-4'>
                                                        <Elements options={options} stripe={stripePromise}>
                                                            <StripeForm totalPrice={parseInt(totalPrice) + parseInt(tipAmount)} placeOrder={transactionSuccess} />
                                                        </Elements>
                                                    </div>
                                                )
                                        }
                                    </div>
                                    <div className='image-pay-left'>
                                        <div className="form-check radio d-flex gap-2 align-items-center">
                                            <input className="form-check-input"
                                                onClick={() => setIsDebit(false)}
                                                defaultChecked={false}
                                                checked={!isDebit} type="radio" />
                                            <div>
                                                <img src={paypal} alt="paypal" className='each-image' />
                                            </div>
                                        </div>
                                    </div>
                                    {
                                        !isDebit &&
                                        <PayPalScriptProvider
                                            options={{
                                                "client-id": "ATOTgaSTk8Z0Nz09dZ608j3zs28lzIbYE0zWSN8FpARBD6uh4OQOI90H3lPVUtN88uFZAUkiDNjH0pA3",
                                                components: "buttons",
                                                currency: "USD"
                                            }}
                                        >
                                            <ButtonWrapper
                                                amount={parseInt(totalPrice) + parseInt(tipAmount)}
                                                placeOrder={transactionSuccess}
                                                currency={"USD"}
                                                showSpinner={false}
                                            />
                                        </PayPalScriptProvider>
                                    }
                                </div>
                            </div>
                        }
                        <div className='bottom'>
                            <Link to="/cart">&lt; Return to information</Link>
                            <button className='btn'>Pay Now</button>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    )
}

export default Checkout;
