import React, { useState } from "react";
import './ProductCard.css'
import New from '../../assets/new.png';
import cart from '../../assets/cart.png';
import axios from "axios";
import { useDispatch } from 'react-redux';
import { isAuthenticated } from "../Auth/auth";
import { Error, Success } from "../Messages/messages";
import { listProducts } from "../../Redux/Redux";
import { Modal } from "antd";
import { useHistory } from "react-router-dom";
var Carousel = require('react-responsive-carousel').Carousel;

export const ProductCard = ({ product }) => {
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const dispatch = useDispatch();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };


  const handleCart = async (id) => {
    if (isAuthenticated()) {
      if (product.qty < 2) {
        Error('Product out of stock!')
      } else {
        setLoading(true);
        await axios.post('/api/cart/add-to-cart', {
          title: product.title,
          subTitle: product.subTitle,
          price: product.price,
          productId: id,
          userId: isAuthenticated()._id,
          offer: product.offer,
          category: product.mainCategory,
          allImages: product.productPictures,
          image: product.productPictures[selectedImage],
          qty: 1,
        }, {
          headers: {
            'authorization': 'Bearer ' + localStorage.getItem('token')
          }
        }).then(res => {
          setLoading(false);
          if (res.status === 200) {
            Success(res.data.successMessage);
            dispatch(listProducts(isAuthenticated()._id));
          }
          else {
            Error(res.data.errorMessage);
          }
        })
      }
    } else {
      history.push("/login");
    }
  }

  return (
    <>
      <div className="productCard">
        <div>
          <div className="top">
            <div className="m-2 mb-0">
            </div>
            <div>
              <img src={New} alt="New" width="80" height="80" />
            </div>
          </div>
          <div className="title-container">
            <div className="title">{product.title}</div>
          </div>
          <Carousel onClickThumb={(index) => setSelectedImage(index)} showThumbs
            onClickItem={() =>
              product.description ? showModal() : () => { }
            }
            showStatus={false} showIndicators={false} showArrows={false}>
            {
              product.productPictures && product.productPictures.map(pic => {
                return (
                  <div>
                    <img aria-label={pic.color} src={pic.url} alt={product.title} />
                    <span className="tooltip">{pic.color}</span>
                  </div>
                )
              })
            }
          </Carousel>
          <Modal className={"desc-modal-2"} mask destroyOnClose footer={false} visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
            <div className="desc-modal">
              <div className="text-center">
                <img src={product.productPictures[0].url} alt={product.title} />
              </div>
              <div>
                <p>NOTE: Please review the item list below for the exact items included in the collection.</p>
                <h3>This package includes the following:</h3>
                <div className="mt-4">
                  <div dangerouslySetInnerHTML={{ __html: product.description }}></div>
                </div>
              </div>
            </div>
          </Modal>
          <div className="desc mt-0 mb-2">
            <div className="fs-4">
              ${product.offer && product.offer !== "0" ? (parseInt(product.price) - parseInt(product.price) * parseInt(product.offer) / 100).toFixed(2) : product.price}
            </div>
            <div>
              <button className="btn" onClick={() => handleCart(product._id)}>
                <img src={cart} alt='cart' className="cart-icon" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
