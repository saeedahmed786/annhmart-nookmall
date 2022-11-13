import { Button, Modal } from 'antd';
import axios from 'axios';
import React, { useState } from 'react';
import { Error, Success } from '../../Messages/messages';

export const UploadFiles = ({ update }) => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [uploadedObject, setUploadedObject] = useState({});
    const [fileData, setFileData] = useState({
        variant: '',
        variantId: ''
    });

    const { variant, variantId } = fileData;

    /***********************************************onChange *******************************************/
    const handleProductChange = (e) => {
        setFileData({
            ...fileData,
            [e.target.name]: e.target.value
        });
    }

    const showModal = () => {
        setIsModalVisible(true);
    };


    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const submitHandler = (e) => {
        e.preventDefault();
        setLoading(true);
        let data = new FormData();
        data.append('file', pic);
        axios.post('/api/products/create', data, {
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


    return (
        <>
            <button className='btn'>Upload Files <i className="fa-solid fa-paperclip"></i></button>
            <Modal title="Upload files" footer={false} visible={isModalVisible} onCancel={handleCancel}>
                <form onSubmit={submitHandler}>
                    <div className="form-group mt-4">
                        <label>Variant</label>
                        <input required type="text" className="form-control mb-2" id='variant' name='variant' placeholder="Enter Variant" onChange={handleProductChange} />
                    </div>
                    <div className="form-group mt-4">
                        <label>Sub Title</label>
                        <input required type="text" className="form-control mb-2" id='sub-title' name='subTitle' placeholder="Enter Your Product Sub Title" onChange={handleProductChange} />
                    </div>
                    <div className="form-group mt-4">
                        <label>Price</label>
                        <input required type="Number" className="form-control mb-2" id='price' name='price' placeholder="Enter Product's Price" onChange={handleProductChange} />
                    </div>
                    <div className='my-3'>
                        <label>Pictues</label> <br />
                        <input required type="file" name='file' multiple onChange={handleImageChange} />
                        <ul className='list-unstyled my-2'>
                            {
                                file.length > 0 ?
                                    file.map(pic => {
                                        return (
                                            <li key={pic.name} className='text-dark'>
                                                {pic.name}
                                                <a className='text-dark' onClick={() => handleRemoveUploadedImage(pic)}><DeleteOutlined style={{ marginLeft: '10px', color: 'black' }} /> </a>
                                            </li>

                                        )
                                    })
                                    :
                                    null
                            }
                        </ul>
                    </div>
                    <button type="submit" size='large' className="btn btn-dark w-100 mt-4">Submit</button>
                </form>
            </Modal>
        </>
    );
};