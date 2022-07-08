import React, { useState } from 'react';
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import Navbar from "./Nav";
import "../App.css"
const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorAlert, setErrorAlert] = useState(false);
    const navigate = useNavigate();

    const loginUser =  async (e) =>{
        e.preventDefault();
        setErrorAlert(false);
        //check if password and email is not empty
        var isValid = true;
        if(email == ""){
            isValid = false;
            setErrorAlert("Email is required");
        }
        if(password == ""){
            isValid = false;
            setErrorAlert("Password is required");
        } 

        if(isValid){
            await axios.post('http://localhost:3001/user/login', {
                email: email,
                password: password,
            }).then(function (response) {
                setEmail('');
                setPassword('');
                // handle success
                console.log(response);
                navigate("/profile");
              })
              .catch(function (error) {
                // handle error
                console.log(error);
                if (error.response) {
                    setErrorAlert(error.response.data.message);
                }
              })
        }
    }
    return (
        <div>
            <Navbar />
            <div class="limiter" id="login">
                <div class="container">
                    <div class="row justify-content-center">
                        <div class="col-md-5 col-md-offset-1 mt-5">
                            <div class="login_topimg">
                            </div>
                            <div class="wrap-login100">
                                {errorAlert && 
                                    <div className="alert alert-danger" role="alert">
                                        {errorAlert}
                                    </div>
                                }
                                <form class="login100-form validate-form"> <span class="login100-form-title "> Login </span> <span class="login100-form-subtitle m-b-16"> to your account </span>
                                    <div class="wrap-input100 validate-input m-b-16" data-validate="Valid email is required: ex@abc.xyz"> <input value={email} onChange={(e) => setEmail(e.target.value)} class="input100" type="email" placeholder="Email"/> <span class="focus-input100"></span> <span class="symbol-input100"> <span class="glyphicon glyphicon-user"></span> </span> </div>
                                    <div class="wrap-input100 validate-input m-b-16" data-validate="Password is required"> <input value={password} onChange={(e) => setPassword(e.target.value)} class="input100" type="password" placeholder="Password"/> <span class="focus-input100"> </span> <span class="symbol-input100"> <span class="glyphicon glyphicon-lock"></span> </span> </div>
                                    <div class="flex-sb-m w-full p-b-30">
                                        <div class="contact100-form-checkbox">
                                            <input class="input-checkbox100" id="ckb1" type="checkbox" name="remember-me"/>
                                            <label class="label-checkbox100" for="ckb1">
                                                Remember me
                                            </label>
                                        </div>
                                        <div>
                                            <a href="#" class="txt1">
                                                Forgot Password?
                                            </a>
                                        </div>
                                    </div>
                                    <div class="container-login100-form-btn p-t-25"> <button onClick={loginUser} class="login100-form-btn"> Login </button> </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default Login;