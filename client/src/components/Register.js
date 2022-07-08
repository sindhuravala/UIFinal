import React, { useState } from 'react';
import Navbar from "./Nav";
import { Link } from "react-router-dom";
import axios from "axios";
//import "../App.css"
const Register = () => {
   const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [cPassword, setCPassword] = useState('');
    const [errorAlert, setErrorAlert] = useState(false);
    const [successAlert, setSuccessAlert] = useState(false);
    const register = async (e) =>{
        e.preventDefault();
        resetAlert();
        var isValid = true;
        if(email == ""){
            isValid = false;
            setErrorAlert("Email is empty");
        }
        if(name == ""){
            isValid = false;
            setErrorAlert("Name is empty");
        }
        if(password == ""){
            isValid = false;
            setErrorAlert("Password is empty");
        } 
        if(cPassword != password){
            isValid = false;
            setErrorAlert("Retype password");
         } 
        if(isValid){
            await axios.post('http://localhost:3001/user/register', {
                name: name,
                email: email,
                password: password,
            }).then(function (response) {
                setName('');
                setEmail('');
                setPassword('');
                setCPassword('');
                setSuccessAlert(response.data.message);
              })
              .catch(function (error) {
                console.log(error);
                if (error.response) {
                    setErrorAlert(error.response.data.message);
                }
              })
        }
    }
    const resetAlert = () =>{
        setErrorAlert(false);
        setSuccessAlert(false);
    }
    return (
        <>
            <Navbar/>
            <div class="container">
               <div class="row justify-content-center">
                  <div class="col-md-5">
                     <div class="card mt-5">
                        <h2 class="card-title text-center">Register </h2>
                        <div class="card-body">
                           {successAlert && 
                                 <div className="alert alert-success" role="alert">
                                    {successAlert}
                                 </div>
                           }

                           {errorAlert && 
                                 <div className="alert alert-danger" role="alert">
                                    {errorAlert}
                                 </div>
                           }
                           <form >
                              <div class="form-group mb-3">
                                 <input value={name} onChange={(e) => setName(e.target.value)}  type="text" class="form-control" placeholder="Name"/>
                              </div>
                              <div class="form-group mb-3">
                                 <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" class="form-control" placeholder="Email"/>
                              </div>                           
                              <div class="form-group mb-3">
                              <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" class="form-control" placeholder="Password"/>
                              </div>
                              <div class="form-group mb-3">
                                 <input value={cPassword} onChange={(e) => setCPassword(e.target.value)}  type="password" class="form-control" placeholder="confirm-password"/>
                              </div>
                              <div class="d-flex flex-row align-items-center justify-content-between">
                                 <Link to="/login">Login</Link>
                                 <button onClick={register} class="btn btn-primary">Create Account</button>
                              </div>
                           </form>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
        </>
    );
}
export default Register;