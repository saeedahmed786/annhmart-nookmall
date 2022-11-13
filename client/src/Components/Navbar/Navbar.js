import React, { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { listProducts } from '../../Redux/Redux';
import { isAuthenticated } from '../Auth/auth';
import Logo from '../../assets/NOOKMALL WHITE LOGO.png';
import axios from 'axios';
import "./Navbar.css"


export const Navbar = () => {
  const history = useHistory();
  const [mainCategories, setMainCategories] = useState([]);
  const [searchedCategories, setSearchedCategories] = useState([]);
  const [show, setShow] = useState(false);
  const [subCategories, setSubCategories] = useState([]);
  const productsList = useSelector(state => state.productsList);
  const { productsInCart } = productsList;
  const cart = productsInCart && productsInCart ? productsInCart.products && productsInCart.products.length : 0;
  const [visible, setVisible] = useState(false);

  const userId = isAuthenticated()._id;
  const dispatch = useDispatch();

  const getAllCategories = async () => {
    await axios.get('/api/categories/all-simple').then(res => {
      if (res.status === 200) {
        setSearchedCategories(res.data);
      } else {
        Error(res.data.errorMessage);
      }
    })
  }

  const getAllMainCategories = async () => {
    await axios.get('/api/categories/get').then(res => {
      if (res.status === 200) {
        setMainCategories(res.data);
      } else {
        Error(res.data.errorMessage);
      }
    })
  }

  const getAllSubCategories = async (id) => {
    await axios.get(`/api/categories/all/sub/${id}`).then(res => {
      if (res.status === 200) {
        setSubCategories(res.data);
      } else {
        Error(res.data.errorMessage);
      }
    })
  }

  const handleScroll = () => {
    if (window.scrollY > 170) {
      setVisible(true);
    } else {
      setVisible(false)
    }
  };

  useEffect(() => {
    if (isAuthenticated()) {
      dispatch(listProducts(userId));
    }
    getAllMainCategories();
    getAllCategories();

    return () => {

    }
  }, [])

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);

    }
  }, [])


  const handleSearchChange = (e) => {
    if (e.target.value) {
      setSearchedCategories(searchedCategories.filter(item =>
        item.name.toLowerCase().includes(e.target.value.toLowerCase()) ||
        item._id.toLowerCase().includes(e.target.value.toLowerCase())
      ))
    } else {
      getAllCategories();
    }
  }

  return (
    <>
      {/* {
        <button className={!visible ? 'cart-area-sticky hidden btn' : "cart-area-sticky visible btn"}>
          <Link to="/cart" className="cart-area">
            <i className="fa-solid fa-cart-arrow-down"></i>
            <span className="carted-count">{cart > 0 ? cart : 0}</span>
          </Link>
        </button>
      } */}
      <nav>
        <div className='logo-container'>
          <Link to="/">
            <img src={Logo} alt="logo" className='w-100' />
          </Link>
        </div>
        <div className='right'>
          <div className='input-container d-none d-md-block' onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
            <div>
              <button className='btn'>
                <i className="fas fa-search main-search-icon"></i>
              </button>
              <input onMouseEnter={() => setShow(true)} placeholder='Search Items' id='search-input' onChange={handleSearchChange} />
            </div>
            {
              show &&
              <div className='searched-items-container'>
                <div className='w-100'>
                  {
                    searchedCategories && searchedCategories.map(cat => {
                      return (
                        <div>
                          <button className='cat btn'
                            onClick={
                              () => {
                                history.push({
                                  pathname: '/all-products',
                                  search: cat._id,  // query string
                                  state: {  // location state
                                    update: true,
                                  }
                                });
                                document.location.reload();
                              }}
                            key={cat._id}>
                            <div>{cat.name}</div>
                          </button>
                        </div>
                      )
                    })
                  }
                </div>
              </div>
            }
          </div>
          <div className='icons-container'>
            <div>
              <Link to={isAuthenticated() ? "/profile" : "/login"}>
                {/* <i className="fa-regular fa-user"></i> */}
                <img width={47} src={"https://www.citypng.com/public/uploads/small/11639594342hjraqgbufi3xlb66lt30fz1pwfcydxkjqbynfqdpvufz41ysjtngiet4dyrywgqqqqu56w5nozgrhyecs4ixrlllkl150ogbiid1.png"} alt="Profile Icon Png" />
              </Link>
            </div>
            <Link to="/cart" className="cart-area">
              <i className="fa-solid fa-cart-arrow-down"></i>
              <span className="carted-count">{cart > 0 ? cart : 0}</span>
            </Link>
            <div className="currency-selector">
              <form action="" method="POST">
                <select name="change-currency" className="select-css" onchange="if (!window.__cfRLUnblockHandlers) return false; this.form.submit()">
                  <option value="USD">$USD</option>
                  <option value="CAD" selected="">CAD 🇨🇦</option>
                  <option value="EUR">EUR 🇪🇺</option>
                  <option value="GBP">GBP 🇬🇧</option>
                  <option value="AUD">AUD 🇦🇺</option>
                  <option value="JPY">JPY 🇯🇵</option>
                  <option value="CHF">CHF 🇨🇭</option>
                  <option value="INR">INR 🇮🇳</option>
                </select>
              </form>
            </div>
          </div>
        </div>
      </nav>
      <div className='nav-categories'>
        {
          mainCategories && mainCategories.map(cat => {
            return (
              <button className='cat btn'
                onClick={cat?.children?.length > 0 ?
                  () => getAllSubCategories(cat._id)
                  :
                  () => {
                    history.push({
                      pathname: '/all-products',
                      search: cat._id,  // query string
                      state: {  // location state
                        update: true,
                      }
                    });
                    document.location.reload();
                  }}
                key={cat._id}>
                <img src={cat.file.url} alt={cat.name} width="21px" height="21px" />
                <div>{cat.name}</div>
              </button>
            )
          })
        }
      </div>
      {
        subCategories && subCategories.length > 0 &&
        <div className='nav-categories pt-4'>
          {
            subCategories.map(cat => {
              return (
                <button className='cat btn'
                  onClick={
                    () => {
                      history.push({
                        pathname: '/all-products',
                        search: cat._id,  // query string
                        state: {  // location state
                          update: true,
                        }
                      });
                      document.location.reload();
                    }}
                  key={cat._id}>
                  <img src={cat.file.url} alt={cat.name} width="21px" height="21px" />
                  <div>{cat.name}</div>
                </button>
              )
            })
          }
        </div>
      }
    </>
  )
}
