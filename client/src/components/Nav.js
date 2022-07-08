import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
const Navbar = () => {
    const [isLogged, setIsLogged] = useState(false);
      const navigate = useNavigate();
      useEffect(() => {
          refreshToken();
      }, []);

      const refreshToken = async () => {
          await axios.get('http://localhost:3001/user/token').
              then(function (response) {
                  // handle success
                  setIsLogged(true);
              })
              .catch(function (error) {
                  // handle error
                  console.log(error);
                  if (error.response) {
                      setIsLogged(false);
                  }
              })
      }

    return (
      <div>
        <nav className="navbar navbar-expand-lg bg-light">
          <div className="container-fluid">
            <a className="navbar-brand" href="#">My app</a>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav">
                {!isLogged &&
                  <>
                    <li className="nav-item">
                      <Link className="nav-link" to="/login">Login</Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/register">Registration</Link>
                    </li>
                  </>
                }
                {isLogged &&
                  <>
                    <li className="nav-item">
                      <Link className="nav-link" to="/profile">Profile</Link>
                    </li>
                  </>
                } 
              </ul>
            </div>
          </div>
        </nav>
      </div>
    );
  }
  
export default Navbar;