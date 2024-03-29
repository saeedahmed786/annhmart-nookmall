import axios from "axios";
import React, { useState } from "react";
import Loading from "../../../Components/Loading/Loading";
import { Success, Error } from "../../../Components/Messages/messages";
import './Auth.css';

export const UpdatePassword = (props) => {
  const token = props.match.params.token;
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);

  const submitHandler = async () => {
    setLoading(true);
    await axios.post(`/api/users/update/password`, { password: password, confirm: confirm, token }).then((res) => {
      setLoading(false);
      if (res.status === 200) {
        Success(res.data.successMessage)
        props.history.push('/login');
      }
      else if (res.status === 201) {
        Error(res.data.errorMessage)
      }
      else {
        Error(res.data.errorMessage)
      }
    });
  };


  return (
    <>
      <div className='forgot'>
        <div>
          <div className="inner">
            <h2 className="text-center fs-3">Update Password</h2>
            {
              loading ?
                <Loading />
                :
                <>
                  <form onSubmit={submitHandler}>
                    <div className='item'>
                      <label>Password</label>
                      <div className="input-group">
                        <span className="input-group-text" id="basic-addon1"><i className="fa-solid fa-lock"></i></span>
                        <input type="passsord" required className="form-control" placeholder="Password" onChange={(e) => setPassword(e.target.value)} aria-label="Username" aria-describedby="basic-addon1" />
                      </div>
                      <div className='item'>
                        <label>Retype Password</label>
                        <div className="input-group">
                          <span className="input-group-text" id="basic-addon1"><i className="fa-solid fa-lock"></i></span>
                          <input type="passsord" required className="form-control" placeholder="Retype Password" onChange={(e) => setConfirm(e.target.value)} aria-label="Username" aria-describedby="basic-addon1" />
                        </div>
                      </div>
                    </div>
                    <button className='btn' type="submit">Submit</button>
                  </form>
                </>
            }
          </div>
        </div>
      </div>
    </>
  );
};
