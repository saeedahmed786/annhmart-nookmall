import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { listProducts } from '../../Redux/Redux';
import { isAuthenticated } from '../../Components/Auth/auth';
import { Error, Success } from '../../Components/Messages/messages';
import "./Cart.css"
import Loading from '../../Components/Loading/Loading';
import { DeleteFilled } from '@ant-design/icons';
import { Link, useHistory } from 'react-router-dom';
import caution from "../../assets/caution.png";
import { Modal } from 'antd';



const Cart = () => {
    const history = useHistory();
    const userId = isAuthenticated()._id;
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [totalPrice, setTotalPrice] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleOk = () => {
        setIsModalOpen(false);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };

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

    const handleCheckout = () => {
        if (totalPrice > 5) {
            history.push("/checkout");
        } else {
            showModal();
        }
    }

    return (
        <div className='cart'>
            <Modal className='notice-modal' footer={false} title={false} closeIcon={false} width={330} visible={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                <div className="cart-disclaimer">
                    <div>
                        <img src={caution} alt="Notice" width="28px" height="auto" />
                    </div>
                    <div className='text-center'>
                        <h4>Notice</h4>
                    </div>
                    <div className='notice'>
                        You must have a minimum order amount of $5.00 to place your order. Your current order total is ${totalPrice || 0}
                    </div>
                    <div className='text-center mt-4'>
                        <button onClick={() => setIsModalOpen(false)} className='btn back-btn'>
                            <span>Back →</span>
                        </button>
                    </div>
                </div>
            </Modal>
            <div>
                <div className='inner'>
                    <h1 className='title mb-0 mt-4 mt-sm-0'>SHOPPING CART</h1>
                    <div className='table-responsive'>
                        <table className="user-cart">
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
                                                                        <DeleteFilled className='text-dark' />
                                                                    </button>
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
                    <div className="cart-disclaimer mt-3">
                        <img src={caution} alt="Notice" width="28px" height="auto" />
                        You must have a minimum order amount of $5.00 to place your order. Your current order total is ${totalPrice || 0}
                    </div>
                    <div className='d-flex justify-content-between my-2 my-sm-3'>
                        <Link to="/">Continue Shopping</Link>
                        <Link to="/">Clear Shopping Cart</Link>
                    </div>
                    <div className='price-container'>
                        <div>
                            <h5>Sub Total</h5>
                            <h4>Grand Total</h4>
                        </div>
                        <div>
                            <h5>${totalPrice || 0} </h5>
                            <h4>${totalPrice || 0}</h4>
                        </div>
                        <div>
                            <button onClick={handleCheckout} className='btn proceed-btn mt-3 my-sm-0'>
                                <span>Proceed to Checkout</span>
                            </button>
                        </div>
                    </div>
                    <div className="payment-information">
                        <h3 className='sub-title my-3'>ORDER PROCESS</h3>
                        <div className="order-process p-4">
                            <h5 className='mt-0'>
                                Message us your order number and Dodo Code™ by clicking the chat icon on the lower right corner of the webpage.
                                <br /> The deliverv staff will arrive in 5-10 minutes!
                            </h5>
                            <h5>
                                The Dodo Code will be provided for villager and island orders within 5-10 minutes after you type your order number!
                            </h5>
                            <h5>
                                Your order number can be found in the order confirmation email after you place the order! Make sure to check your junk/spam folder as well.
                            </h5>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Cart
