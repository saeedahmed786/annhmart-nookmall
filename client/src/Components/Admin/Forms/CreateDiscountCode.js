import React, { useState } from "react";
import axios from "axios";
import Modal from "antd/lib/modal/Modal";
import { Error, Success } from "../../Messages/messages";
import Loading from "../../Loading/Loading";

export const CreateDiscountCode = (props) => {
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [discountCode, setDiscountCode] = useState('');
  const [discount, setDiscount] = useState('');

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  /************************************************ Submit **********************************************/
  const submitHandler = (e) => {
    e.preventDefault();
    setLoading(true);
    axios.post(`/api/discounts/add`, { discountCode, discount }, {
      headers: {
        authorization: "Bearer " + localStorage.getItem('token'),
      }
    }).then((res) => {
      if (res.status === 200) {
        setLoading(false);
        Success(res.data.successMessage);
        props.updateFunction();
        setIsModalVisible(false)
      } else {
        Error(res.data.errorMessage)
      }
    });
  };

  return (
    <div>
      <button className='btn px-4 submit-btn btn-outline-dark rounded-pill' onClick={showModal}>Add Discount Code</button>
      <Modal title="New Discount Code" footer={false} visible={isModalVisible} destroyOnClose onCancel={handleCancel}>
        {
          loading ?
            <Loading />
            :
            <form onSubmit={submitHandler} className="text-center create-posts">
              <div className="form-group">
                <input
                  required
                  type="text"
                  className="form-control"
                  placeholder="Enter Discount Code"
                  onChange={(e) => setDiscountCode(e.target.value)}
                />
              </div>
              <div className="form-group">
                <input
                  required
                  type="number"
                  className="form-control"
                  placeholder="Enter Discount (%)"
                  onChange={(e) => setDiscount(e.target.value)}
                />
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