import { Select, TreeSelect } from 'antd';
import React, { useEffect, useState } from 'react'
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import axios from 'axios';
import { DeleteOutlined } from '@ant-design/icons';
import { Error, Success, Warning } from "../../Messages/messages";
import Loading from "../../Loading/Loading";
import { Link } from 'react-router-dom';


const { TreeNode } = TreeSelect;
const { Option } = Select;

export const UpdateProductForm = (props) => {
    const productId = props.productId;
    const [productPictures, setProductPictures] = useState();
    const [file, setFile] = useState('');
    const [variants, setVariants] = useState([]);
    const [description, setDescription] = useState('');
    const [categories, setCategories] = useState([]);
    const [variantColor, setVariantColor] = useState("");
    const [variantLoading, setVariantLoading] = useState(false);
    const [mainCatId, setMainCatId] = useState('');
    const [subCat, setSubCat] = useState('');
    const [featured, setFeatured] = useState();
    const [loading, setLoading] = useState(false);
    const [productData, setProductData] = useState({
        title: '',
        price: '',
        qty: '',
        subTitle: '',
        offer: '',
        tag: '',
    });

    const { title, price, qty, subTitle, offer, tag } = productData;

    /***********************************************onChange *******************************************/
    const handleProductChange = (e) => {
        setProductData({
            ...productData,
            [e.target.name]: e.target.value
        });
    }

    const removeVariant = async (name) => {
        //     await axios.post(`/api/files/delete`, { file: name }, {
        //         headers: {
        //             authorization: 'Bearer ' + localStorage.getItem('token')
        //         }
        //     }).then(res => {
        //         if (res.status === 200) {
        setVariants(variant => variant.filter(variant => variant.id !== name.id))
        //     } else {
        //         Error(res.data.errorMessage);
        //     }
        // })
    }

    const onMainCatChange = value => {
        setMainCatId(value);
    };
    const onSubCatChange = value => {
        setSubCat(value);
    };


    const getProductById = async () => {
        await axios.get(`/api/products/product/${productId}`).then(res => {
            console.log(res);
            if (res.status === 200) {
                setVariants(res.data.productPictures);
                setProductData(res.data);
                setDescription(res.data.description);
                setMainCatId(res.data.mainCategory);
                setSubCat(res.data.subCategory);
                setFeatured(res.data.featured);
            } else {
                Error(res.data.errorMessage);
            }
        })
    }
    console.log(featured)
    /************************************************ Submit **********************************************/
    const submitVariantHandler = () => {
        // if (!file || !variantColor) {
        //     Error("File and variant color are required")
        // } else {
        setVariantLoading(true);
        let data = new FormData();
        data.append('file', file);
        axios.post('/api/files/post', data, {
            headers: {
                authorization: 'Bearer ' + localStorage.getItem('token')
            }
        }).then(res => {
            setVariantLoading(false);
            if (res.status === 200) {
                res.data.color = variantColor
                setVariants(variants => [...variants, res.data])
            }
            else {
                Error(res.data.errorMessage);
            }
        }).catch(error => {
            setVariantLoading(false);
            Error(error.response.data.errorMessage)
        })
        // }
    }

    const submitHandler = (e) => {
        e.preventDefault();
        if (
            !title ||
            !mainCatId || 
            !price ||
            !variants
        ) {
            Warning('All fields are required');
        }
        else {
            setLoading(true);
            axios.post(`/api/products/update/${productId}`,
                {
                    title, price, qty, subTitle, offer, tag, description, featured,
                    mainCategory: mainCatId, subCategory: subCat, variants
                }
                , {
                    headers: {
                        authorization: 'Bearer ' + localStorage.getItem('token')
                    }
                }).then(res => {
                    if (res.status === 200) {
                        setLoading(false);
                        Success(res.data.successMessage);
                    }
                    else {
                        Error(res.data.errorMessage);
                    }
                })
        }
    }

    /****************************************** Get Categories *******************************************/
    const fetchCategories = () => {
        axios.get('/api/categories/get').then(res => {
            if (res.status === 200) {
                setCategories(res.data);
            }
            else {
                Error(res.data.errorMessage);
            }
        })
    }


    useEffect(() => {
        fetchCategories();
        getProductById();
        return () => {
        }
    }, []);


    return (
        <div className='w-75 p-4 products mb-5' style={{ marginTop: '10px', paddingTop: '47px', background: '#FFFFFF', boxShadow: '10px 10px 30px rgba(197, 200, 213, 0.76)', borderRadius: '20px' }}>
            {
                loading
                    ?
                    <Loading />

                    :
                    <div>
                        <form onSubmit={submitHandler}>
                            <div className='d-flex justify-content-between'>
                                <div>
                                    <h4 className='mb-5'>Update Product</h4>
                                </div>
                                <div>
                                    <Link to='/admin/all-products' type="button" className="btn-close" aria-label="Close"></Link>
                                </div>
                            </div>
                            <div className="form-group mt-4">
                                <label>Title</label>
                                <input type="text" className="form-control mb-2" id='title' value={title} name='title' placeholder="Enter Your Product Title" onChange={handleProductChange} />
                            </div>
                            <div className="form-group mt-4">
                                <label>Sub Title</label>
                                <input type="text" className="form-control mb-2" id='title' value={subTitle} name='subTitle' placeholder="Enter Your Product Sub Title" onChange={handleProductChange} />
                            </div>
                            <div className="form-group mt-4">
                                <label>Price</label>
                                <input type="Number" className="form-control mb-2" value={price} id='price' name='price' placeholder="Enter Product's Price" onChange={handleProductChange} />
                            </div>
                            <div className="form-group mt-4">
                                <label>Offer (Optional)</label>
                                <input type="Number" className="form-control mb-2" value={offer} id='offer' name='offer' placeholder="Enter Offer (10) %" onChange={handleProductChange} />
                            </div>
                            <div className="form-group mt-4">
                                <label>Quantity</label>
                                <input type="number" required className="form-control my-2" value={qty} id='qty' name='qty' placeholder="Enter Amount" onChange={handleProductChange} />
                            </div>
                            <div className="form-group mt-4">
                                <label>Tag (Optional)</label>
                                <input type="text" className="form-control my-2" value={tag} id='tag' name='tag' placeholder="Enter Product Tag (POPULAR)" onChange={handleProductChange} />
                            </div>
                            <div className="form-group mt-4">
                                <label>Featured (Optional)</label>
                                <Select value={featured} className="w-100" onChange={(value) => setFeatured(value)}>
                                    <Option value={true}>Yes</Option>
                                    <Option value={false}>No</Option>
                                </Select>
                            </div>
                            <div className='mt-3'>
                                <label>Description</label>
                                <ReactQuill className="text-dark" placeholder="Product Description" theme="snow" value={description || ""} onChange={(value) => setDescription(value)} />
                            </div>
                            <div className='my-3'>
                                <label>Add variant</label>
                                {
                                    variantLoading ?
                                        <Loading />
                                        :
                                        <div className='d-flex align-items-center justify-content-between border p-4'>
                                            <div className='w-25'>
                                                <input type="file" name='file' onChange={(e) => setFile(e.target.files[0])} />
                                            </div>
                                            <div>
                                                <input type="text" className="form-control my-0" placeholder="Enter color of variant" onChange={(e) => setVariantColor(e.target.value)} />
                                            </div>
                                            <div>
                                                <button onClick={submitVariantHandler} className='btn btn-dark'>Add</button>
                                            </div>
                                        </div>
                                }
                                <div className='my-2'>
                                    <label className='fs-4 my-2'>Variants:</label>
                                    {
                                        variants.length > 0 ?
                                            variants.map(variant => {
                                                return (
                                                    <div key={variant.id} className='mb-2 text-dark d-flex align-items-center justify-content-between'>
                                                        <div>
                                                            <img src={variant.url} alt={variant.id} width="62" height="62" />
                                                        </div>
                                                        <div>
                                                            {variant.color}
                                                        </div>
                                                        <div>
                                                            <a className='text-dark' onClick={() => removeVariant(variant)}>
                                                                <DeleteOutlined style={{ marginLeft: '10px', color: 'black' }} />
                                                            </a>
                                                        </div>
                                                    </div>

                                                )
                                            })
                                            :
                                            null
                                    }
                                </div>
                            </div>
                            <div>
                                <label>Category</label>
                                <TreeSelect
                                    showSearch
                                    style={{ width: '100%' }}
                                    dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                    placeholder="Please select main category"
                                    allowClear
                                    treeDefaultExpandAll
                                    onChange={onMainCatChange}
                                    className='mb-3'
                                    value={mainCatId}
                                >
                                    {
                                        categories.map(mainCat => {
                                            return (
                                                <TreeNode value={mainCat._id} title={mainCat.name} />
                                            )
                                        })
                                    }
                                </TreeSelect>
                            </div>
                            <div>
                                <label>Sub Category (Optional)</label>
                                <TreeSelect
                                    showSearch
                                    style={{ width: '100%' }}
                                    dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                    placeholder="Please select sub category"
                                    allowClear
                                    treeDefaultExpandAll
                                    onChange={onSubCatChange}
                                    value={subCat}
                                >
                                    {
                                        categories &&
                                        categories.filter(c => c._id == mainCatId).map(mainCat => {
                                            return (
                                                <TreeNode disabled value={mainCat._id} title={mainCat.name}>
                                                    {
                                                        mainCat.children.map(subCat => {
                                                            return (
                                                                <TreeNode value={subCat._id} title={subCat.name}>
                                                                    {
                                                                        subCat.children.map(childCat => {
                                                                            return (
                                                                                <TreeNode value={childCat._id} title={childCat.name} />

                                                                            )
                                                                        })
                                                                    }
                                                                </TreeNode>
                                                            )
                                                        })
                                                    }
                                                </TreeNode>
                                            )
                                        })
                                    }
                                </TreeSelect>
                            </div>
                            <button type="submit" size='large' className="btn btn-dark w-100 mt-4">Submit</button>
                        </form>
                    </div>
            }
        </div>
    )
}
