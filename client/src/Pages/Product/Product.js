import { Button, InputNumber, Spin } from 'antd';
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { listProducts } from '../../Redux/Redux';
import { ShoppingCartOutlined } from '@ant-design/icons';
import { Helmet } from 'react-helmet';
import { Comments } from '../../Components/Comments/Comments';
import { isAuthenticated } from '../../Components/Auth/auth';
import { Error, Success } from '../../Components/Messages/messages';
import { ProductCard } from '../../Components/Products/ProductCard';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';
import './Product.css'
import Loading, { antIcon } from '../../Components/Loading/Loading';

export const Product = (props) => {
    const productId = props.match.params.id;
    let userId = isAuthenticated()._id;
    const [product, setProduct] = useState({});
    const [qtyToShop, setQtyToShop] = useState('1');
    const [title, setTitle] = useState('');
    const [loading, setLoading] = useState(false);
    const [commentsList, setCommentsList] = useState([]);
    const [products, setProducts] = useState([]);

    const getProduct = async () => {
        setLoading(true);
        await axios.get(`/api/products/get/${productId}`).then(res => {
            setLoading(false);
            if (res.status === 200) {
                setProduct(res.data);
                getRelatedProducts(res.data.subCategory);
                setTitle(res.data.title);
            } else {
                Error(res.data.errorMessage);
            }
        });

    }

    useEffect(() => {
        getProduct();
        getComment();
        return () => {

        }
    }, [productId, userId]);

    const getRelatedProducts = (cat) => {
        axios.get(`/api/products/get/related/${cat}`).then(res => {
            if (res.status === 200) {
                const getAll = res.data.filter(prod => prod._id !== productId);
                setProducts(getAll);
            } else {
                Error(res.data.errorMessage);
            }
        })
    }

    const dispatch = useDispatch();
    const handleCart = async () => {
        if (qtyToShop > product.qty) {
            Error('Product out of stock!')
        } else {
            setLoading(true);
            let data = new FormData();
            data.append('title', product.title);
            data.append('subTitle', product.subTitle);
            data.append('price', product.price);
            data.append('productId', productId);
            data.append('userId', userId);
            data.append('offer', product.offer);
            data.append('category', product.subCategory);
            data.append('image', product.productPictures[0].img)
            data.append('qty', qtyToShop);
            await axios.post('/api/cart/add-to-cart', data, {
                headers: {
                    'authorization': 'Bearer ' + localStorage.getItem('token')
                }
            }).then(res => {
                setLoading(false);
                if (res.status === 200) {
                    Success(res.data.successMessage);
                    dispatch(listProducts(userId));
                }
                else {
                    Error(res.data.errorMessage);
                }
            })
        }
    }

    const saveProductToCart = () => {
        if (qtyToShop > product.qty) {
            Error('Product out of stock!')
        } else {
            setLoading(true);
            var allEntries = localStorage.getItem("product") && JSON.parse(localStorage.getItem("product")) || [];
            product.pic = product.productPictures[0].img;
            product.image = product.productPictures && product.productPictures[0].img;
            product.productId = product._id;
            product.price = product.price;
            product.qty = qtyToShop;
            allEntries.push(product);
            setLoading(false);
            localStorage.setItem('product', JSON.stringify(allEntries));
            Success('Product add to Bag successfully');
            dispatch(listProducts(userId));
        }
    }



    /********************************************** Comments ******************************************************/
    const getComment = async () => {
        setLoading(true);
        await axios.get(`/api/comments/get/${productId}`).then(res => {
            setLoading(false);
            if (res.status === 200) {
                setCommentsList(res.data.result);
            } else {
                console.log('Error')
            }
        })
    }


    const updateComponent = (newComment) => {
        setCommentsList(commentsList.concat(newComment));
    }

    const updateIt = () => {
        getComment();
    }

    return (
        <div>
            {
                loading
                    ?
                    <Loading />

                    :

                    <>
                        <div className='row product-page'>
                            <Helmet>
                                <title>{title}</title>
                            </Helmet>
                            <div className='col-md-7 px-3'>
                                <Carousel>
                                    {
                                        product.productPictures ? product.productPictures.length > 0 ? product.productPictures.map(pic => {
                                            return (
                                                <div>
                                                    <img src={pic.img} alt="..." />
                                                </div>
                                            )
                                        })
                                            :
                                            null
                                            :
                                            null
                                    }
                                </Carousel>
                            </div>
                            <div className="col-md-5 mt-2 pl-4">
                                <div className='ml-3'>
                                    <h4>
                                        {product.title}
                                    </h4>
                                    <h5 className='mt-2'>
                                        <span>Rs. {product.price}</span>
                                    </h5>
                                    <h6 style={{ color: '#03a685' }} className='font-weight-bold'>
                                        Inclusive of all taxes
                                    </h6>

                                    <div className='mt-4'>
                                        <h5>Add <span>Quantity</span>  <span className='fs-6'>(Total Available {<span>Quantity: {product.qty === 1 ? 0 : product.qty}</span>})</span></h5>
                                        <InputNumber min={1} max={100000} defaultValue={1} onChange={(value) => setQtyToShop(value)} />
                                        {
                                            <p className='mt-2'>{product.qty <= 1 && <span className='text-danger fw-bolder'>Out of Stock!</span>}</p>
                                        }
                                    </div>
                                    <div className='product-btn mt-4'>
                                        <Button onClick={() => { isAuthenticated() ? handleCart() : saveProductToCart() }} size='large' icon={<ShoppingCartOutlined style={{ fontSize: '26px' }} />}>
                                            Add to Bag
                                        </Button>
                                    </div>
                                    <div className='mt-4'>
                                        <h4>Description:</h4>
                                        <p className='mr-5' style={{ wordBreak: 'break-word' }}>
                                            <div dangerouslySetInnerHTML={{ __html: product.description }}></div>
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className='col-md-7'>
                                <div className='ml-0 ml-md-5 mt-5'>
                                    <h6 className='text-center'>Reviews ({commentsList.length} Reviews)</h6>
                                    <Comments CommentList={commentsList} vendorId={product.user && product.user._id} productId={productId} updateIt={updateIt} refreshFunction={updateComponent} />
                                </div>
                            </div>
                        </div>
                        <div className='row mt-2 pt-4 px-0 px-md-4'>
                            <h5 className='mb-4 text-center'>Similar Products</h5>
                            {
                                products.map(product => {
                                    return (
                                        <div className='col-md-3 col-lg-3 mt-2'>
                                            <ProductCard product={product} />
                                        </div>
                                    )
                                })
                            }

                        </div>
                    </>
            }
        </div >
    )
}
