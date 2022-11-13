import React, { useEffect, useState } from "react";
import axios from "axios";
import Modal from "antd/lib/modal/Modal";
import { Select } from 'antd';
import { Error, Success } from "../../Messages/messages";
import Loading from "../../Loading/Loading";

const { Option } = Select;

export const CreateSubCategories = (props) => {
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [subCategory, setSubCategory] = useState('');
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

  const getAllMainCategories = async () => {
    await axios.get('/api/categories/main/get').then(res => {
      if (res.status === 200) {
        setCategories(res.data);
      } else {
        Error(res.data.errorMessage);
      }
    })
  }

  useEffect(() => {
    getAllMainCategories()
    return () => {
    }
  }, []);


  /************************************************ Submit **********************************************/
  const submitHandler = (e) => {
    e.preventDefault();
    setLoading(true);
    let data = new FormData();
    data.append("name", subCategory);
    data.append("file", file);
    data.append("parentId", parentId);
    axios
      .post(`/api/categories/sub/create`, data
        , {
          headers: {
            authorization: "Bearer " + localStorage.getItem('token'),
            'Content-Type': 'application/json'
          }
        }
      )
      .then((res) => {
        setLoading(false);
        if (res.status === 200) {
          Success(res.data.successMessage);
          props.updateFunction();
        } else {
          Error(res.data.errorMessage);
        }
      });
  };


  return (
    <div>
      <button className='btn px-4 submit-btn btn-outline-dark rounded-pill' onClick={showModal}>Create Sub Category</button>
      <Modal style={{ backgroundColor: "white" }} title="New Sub Category" footer={false} visible={isModalVisible} onCancel={handleCancel}>
        {
          loading ?
            <Loading />
            :
            <form onSubmit={submitHandler} className="text-center create-posts">
              <div>
                <Select
                  showSearch
                  // style={{ width: 200 }}
                  className='w-100 mb-3'
                  placeholder="Select parent category"
                  optionFilterProp="children"
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
              </div>
              <div className="form-group">
                <input
                  required
                  type="text"
                  className="form-control"
                  id="category"
                  name="category"
                  placeholder="Enter Sub Category Title"
                  onChange={(e) => setSubCategory(e.target.value)}
                />
              </div>
              <div className="form-group text-left">
                <input required type="file" name='file' onChange={(e) => setFile(e.target.files[0])} />
                <br />
                {
                  file &&
                  <img className="mt-2" src={file !== '' ? URL.createObjectURL(file) : ''} alt="" width="60px" height="60px"></img>
                }
              </div>
              <div style={{ marginTop: '15px' }}>
                <button
                  type="submit"
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