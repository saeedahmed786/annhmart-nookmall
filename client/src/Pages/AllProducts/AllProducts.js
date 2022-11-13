import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import './AllProducts.css'
import { ProductCard } from '../../Components/Products/ProductCard';
import { Error } from '../../Components/Messages/messages';
import Loading from '../../Components/Loading/Loading';

export const AllProducts = (props) => {
    const location = useLocation();
    const [products, setProducts] = useState([]);
    const [defaultStatus, setDefaultStatus] = useState(false);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [filteredStatus, setFilteredStatus] = useState(false);
    const [loading, setLoading] = useState(false);
    const [catName, setCatName] = useState();
    const [pageNo, setPageNo] = useState(0);
    const [count, setCount] = useState("");

    const getAllProducts = async () => {
        setLoading(true);
        await axios.get(`/api/products/get/${pageNo}`).then(res => {
            setLoading(false);
            if (res.status === 200) {
                setProducts(res.data.products);
                setCount(res.data.count);
            } else {
                Error(res.data.errorMessage);
            }
        })
    }

    const getProductsByCategory = async (id) => {
        setLoading(true);
        getCategoryById(id);
        await axios.post(`/api/products/cat/${id}`, { pageNo }).then(res => {
            setLoading(false);
            if (res.status === 200) {
                setProducts(res.data.products);
                setCount(res.data.count);
            } else {
                Error(res.data.errorMessage);
            }
        })
    }

    const getCategoryById = async (id) => {
        await axios.post(`/api/categories/edit/${id}`).then(res => {
            if (res.status === 200) {
                setCatName(res.data.editCategory.name);
            } else {
                Error(res.data.errorMessage);
            }
        })
    }

    useEffect(() => {

        location.search ? getProductsByCategory(location.search.substring(1)) : getAllProducts();
        return () => {

        }
    }, [pageNo, defaultStatus]);

    useEffect(() => {
        setProducts(filteredProducts)

        return () => {

        }
    }, [filteredProducts, filteredStatus])


    const handleSort = async (e) => {
        setFilteredStatus(false);
        setDefaultStatus(false);
        let filter;
        e.target.value === "az" || e.target.value === "za" ?
            filter = await products.sort((a, b) => a.title.toString().localeCompare(b.title.toString()))
            :
            e.target.value === "lth" || e.target.value === "htl" ?
                filter = await products.sort((a, b) => a.price - b.price)
                :
                setDefaultStatus(true)
        setFilteredProducts(
            e.target.value === "za" ? filter.reverse() : e.target.value === "az" ? filter
                :
                e.target.value === "htl" ? filter.reverse() : e.target.value === "lth" && filter
        )
        setFilteredStatus(true)
    }


    return (
        <div>
            <div className='all-products'>
                <div className="results-sorter">
                    <select id="sorter" className="select-css" onChange={handleSort}>
                        <option value="default">Default</option>
                        <option value="az">A - Z</option>
                        <option value="za">Z - A</option>
                        <option value="lth">Price: Lowest</option>
                        <option value="htl">Price: Highest</option>
                    </select>
                </div>
                {
                    loading ?
                        <Loading />
                        :
                        <div className='row'>
                            <div className='col-md-12'>
                                <div className='row mr-1'>
                                    {
                                        products && products.length > 0 ? products.map((product, index) => {
                                            return (
                                                <div className='col-12 col-md-4 col-lg-3'>
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

                                <div className='buttons-container'>
                                    {
                                        products.length > 20 &&
                                        <>
                                            <button disabled={pageNo > 0 ? false : true} className='btn back' onClick={() => pageNo > 1 && setPageNo(pageNo - 1)}><i className="fas fa-arrow-left"></i> Back</button>
                                            <button disabled={products.length === 0 && true} className='btn' onClick={() => setPageNo(pageNo + 1)}>Next <i className="fas fa-arrow-right"></i></button>
                                        </>
                                    }
                                </div>
                            </div>
                        </div>
                }
                <div className="results-info mt-4" id="results-info">{products && products.length} of {count} results for all&nbsp;{location.search && <span> in <b className="search-result-main">{catName}</b></span>}</div>
            </div>
        </div>
    )
}
