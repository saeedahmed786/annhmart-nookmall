import React, { useState } from "react";
import axios from "axios";
import { EditOutlined } from "@ant-design/icons";
import Modal from "antd/lib/modal/Modal";
import { Error, Success } from "../../Messages/messages";
import Loading from "../../Loading/Loading";


export const UpdateDiscountCode = ({ data, updateFunction }) => {
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [discountCode, setDiscountCode] = useState('');
  const [discount, setDiscount] = useState('');

  const showModal = () => {
    setDiscount(data.discount)
    setDiscountCode(data.discountCode)
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  /************************************************ Submit **********************************************/
  const submitHandler = (e) => {
    console.log('object')
    e.preventDefault();
    setLoading(true);
    axios.put(`/api/discounts/update/${data._id}`, { discount, discountCode }, {
      headers: {
        authorization: "Bearer " + localStorage.getItem('token')
      }
    }).then((res) => {
      if (res.status === 200) {
        setLoading(false);
        Success(res.data.successMessage);
        updateFunction();
      } else {
        Error(res.data.errorMessage);
      }
    });
  };

  return (
    <div>
      <button className="btn" onClick={showModal}><EditOutlined /></button>
      <Modal title="Update Category" footer={false} visible={isModalVisible} onCancel={handleCancel}>
        {
          loading ?
            <Loading />
            :
            <form className="text-center create-posts">
              <div className="form-group">
                <input
                  required
                  type="text"
                  className="form-control"
                  placeholder="Enter Discount Code"
                  value={discountCode}
                  onChange={(e) => setDiscountCode(e.target.value)}
                />
              </div>
              <div className="form-group">
                <input
                  required
                  type="text"
                  value={discount}
                  className="form-control"
                  placeholder="Enter Discount (%)"
                  onChange={(e) => setDiscount(e.target.value)}
                />
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