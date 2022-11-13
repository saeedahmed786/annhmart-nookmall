import { Select, TreeSelect } from 'antd';
import React, { useEffect, useState } from 'react'
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import axios from 'axios';
import { DeleteOutlined } from '@ant-design/icons';
import { Error, Success, Warning } from "../../Messages/messages";
import Loading from "../../Loading/Loading";
import { Link } from 'react-router-dom';
import CSVReaderComp from '../CSVReader';

const { TreeNode } = TreeSelect;
const { Option } = Select;

export const CreateProductForm = () => {
    const [file, setFile] = useState("");
    const [variants, setVariants] = useState([]);
    const [description, setDescription] = useState('');
    const [categories, setCategories] = useState([]);
    const [mainCatId, setMainCatId] = useState('');
    const [subCat, setSubCat] = useState('');
    const [featured, setFeatured] = useState(false);
    const [variantColor, setVariantColor] = useState("");
    const [loading, setLoading] = useState(false);
    const [variantLoading, setVariantLoading] = useState(false);
    const [productData, setProductData] = useState({
        title: '',
        price: '',
        qty: '',
        subTitle: '',
        offer: "",
        tag: "",
    });

    const { title, price, qty, subTitle, offer, tag } = productData;

    /***********************************************onChange *******************************************/
    const handleProductChange = (e) => {
        setProductData({
            ...productData,
            [e.target.name]: e.target.value
        });
    }

    const removeVariant = name => {
        setVariants(variant => variant.filter(variant => variant.id !== name.id))
    }

    const onMainCatChange = value => {
        setMainCatId(value);
    };
    const onSubCatChange = value => {
        setSubCat(value);
    };


    /************************************************ Submit **********************************************/
    const submitVariantHandler = () => {
        if (!file || !variantColor) {
            Error("File and variant color are required")
        } else {
            setVariantLoading(true);
            let data = new FormData();
            data.append('file', file);
            axios.post('/api/files/post', data, {
                headers: {
                    authorization: 'Bearer ' + localStorage.getItem('token')
                }
            }).then(res => {
                if (res.status === 200) {
                    setVariantLoading(false);
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
        }
    }

    console.log(variants);

    const submitHandler = (e) => {
        e.preventDefault();
        if (
            !title ||
            !mainCatId ||
            !price ||
            !file
        ) {
            Warning('All fields are required');
        }
        else {
            axios.post('/api/products/create',
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
                }).catch(error => {
                    setLoading(false);
                    Error(error.response.data.errorMessage)
                })
        }
    }

    console.log(file);

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
        return () => {
        }
    }, []);

    return (
        <div className='w-75 p-4 products mb-4' style={{ marginTop: '10px', paddingTop: '47px', background: '#FFFFFF', boxShadow: '10px 10px 30px rgba(197, 200, 213, 0.76)', borderRadius: '20px' }}>
            {
                loading
                    ?
                    <Loading />

                    :
                    <div>
                        <form onSubmit={submitHandler}>
                            <div className='d-flex justify-content-between'>
                                <div>
                                    <h4 className='mb-5'>Create a Product</h4>
                                </div>
                                <div>
                                    <Link to='/admin/all-products' type="button" className="btn-close" aria-label="Close"></Link>
                                </div>
                            </div>
                            <div className="form-group mt-4">
                                <label>Title</label>
                                <input required type="text" className="form-control mb-2" id='title' name='title' placeholder="Enter Your Product Title" onChange={handleProductChange} />
                            </div>
                            <div className="form-group mt-4">
                                <label>Sub Title</label>
                                <input required type="text" className="form-control mb-2" id='sub-title' name='subTitle' placeholder="Enter Your Product Sub Title" onChange={handleProductChange} />
                            </div>
                            <div className="form-group mt-4">
                                <label>Price</label>
                                <input required type="Number" className="form-control mb-2" id='price' name='price' placeholder="Enter Product's Price" onChange={handleProductChange} />
                            </div>
                            <div className="form-group mt-4">
                                <label>Offer</label>
                                <input type="Number" className="form-control mb-y" id='offer' name='offer' placeholder="Enter Offer (10) %" onChange={handleProductChange} />
                            </div>
                            <div className="form-group mt-4">
                                <label>Quantity</label>
                                <input required type="Number" className="form-control mb-y" id='qty' name='qty' placeholder="Enter Amount" onChange={handleProductChange} />
                            </div>
                            <div className="form-group mt-4">
                                <label>Tag (Optional)</label>
                                <input type="text" className="form-control mb-y" id='tag' name='tag' placeholder="Enter Product Tag (POPULAR)" onChange={handleProductChange} />
                            </div>
                            <div className="form-group mt-4">
                                <label>Featured (Optional)</label>
                                <Select defaultValue={"Featured"} className="w-100" onChange={(value) => setFeatured(value)}>
                                    <Option value={true}>Yes</Option>
                                    <Option value={false}>No</Option>
                                </Select>
                            </div>
                            <div className='mt-3'>
                                <label>Description</label>
                                <ReactQuill className='text-dark' required placeholder="Product Description" theme="snow" value={description} onChange={setDescription} />
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
        </div >
    )
}
