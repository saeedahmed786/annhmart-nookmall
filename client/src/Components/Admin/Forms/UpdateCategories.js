import React, { useEffect, useState } from "react";
import axios from "axios";
import { EditOutlined, UploadOutlined } from "@ant-design/icons";
import Modal from "antd/lib/modal/Modal";
import { Error, Success } from "../../Messages/messages";
import { Button, message, Select, Upload } from 'antd';
import Loading from "../../Loading/Loading";

const { Option } = Select;


export const UpdateCategories = (props) => {
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [name, setName] = useState('');
  const [categories, setCategories] = useState([]);
  const [parentId, setParentId] = useState('');
  const [file, setFile] = useState("");

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleSelectChange = (value) => {
    setParentId(value);
  }

  const getAllJobsMainCategories = async () => {
    setParentId(props.parentId);
    setName(props.name);
    await axios.get('/api/categories/main/get').then(res => {
      if (res.status === 200) {
        setCategories(res.data);
      } else {
        Error(res.data.errorMessage);
      }
    })
  }

  useEffect(() => {
    getAllJobsMainCategories();
    return () => {
    }
  }, []);


  /************************************************ Submit **********************************************/
  const submitHandler = (e) => {
    console.log('object')
    e.preventDefault();
    setLoading(true);
    let data = new FormData();
    data.append("name", name);
    if (parentId) {
      data.append("parentId", parentId);
    }
    if (file) {
      data.append("file", file);
    }
    axios.put(`/api/categories/update/${props.catId}`, data, {
      headers: {
        authorization: "Bearer " + localStorage.getItem('token')
      }
    }
    )
      .then((res) => {
        if (res.status === 200) {
          setLoading(false);
          Success(res.data.successMessage);
          props.updateFunction();
        } else {
          Error(res.data.errorMessage);
        }
      });
  };

  // const uploadProps = {
  //   name: 'file',
  //   action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
  //   headers: {
  //     authorization: 'authorization-text',
  //   },
  //   onChange(info) {
  //     if (info.file.status !== 'uploading') {
  //       console.log(info.file, info.fileList);
  //     }
  //     if (info.file.status === 'done') {
  //       message.success(`${info.file.name} file uploaded successfully`);
  //     } else if (info.file.status === 'error') {
  //       message.error(`${info.file.name} file upload failed.`);
  //     }
  //   },
  // };

  return (
    <div>
      <button className="btn" onClick={showModal}><EditOutlined /></button>
      <Modal title="Update Category" footer={false} visible={isModalVisible} onCancel={handleCancel}>
        {
          loading ?
            <Loading />
            :
            <form className="text-center create-posts">
              <div>
                {
                  props.parentId &&
                  <Select
                    showSearch
                    className='w-100 mb-3'
                    placeholder="Select a person"
                    optionFilterProp="children"
                    value={parentId}
                    onChange={handleSelectChange}
                    filterOption={(input, option) =>
                      option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {
                      categories.length > 0 && categories.map(cat => {
                        return (
                          <Option key={cat._id} value={cat._id}>{cat.name}</Option>
                        )
                      })
                    }
                  </Select>
                }
              </div>
              <div className="form-group">
                <input
                  required
                  type="text"
                  className="form-control"
                  id="category"
                  name="category"
                  value={name}
                  placeholder="Enter Sub Category Title"
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="form-group text-left">
                {/* <input type="file" name='file' onChange={(e) => setFile(e.target.files[0])} /> */}
                <Upload name="file" showUploadList={false} onChange={(info) => setFile(info.file.originFileObj)}>
                  <Button icon={<UploadOutlined />}>Click to Upload</Button>
                </Upload>
                <br />
                {
                  file ?
                    <img className="mt-2" src={file !== '' ? URL.createObjectURL(file) : ''} alt="" width="60px" height="60px"></img>
                    :
                    <img className="mt-2" src={props?.file.url} alt="" width="60px" height="60px"></img>
                }
              </div>
              <div style={{ marginTop: '15px' }}>
                <button
                  onClick={submitHandler}
                  size="large"
                  className="btn btn-outline-dark w-25"
                >
                  Submit
                </button>
              </div>
            </form>
        }
      </Modal>
    </div>
  );
};