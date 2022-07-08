import React, { useState, useEffect } from 'react';
import Navbar from "./Nav";
import jwt_decode from "jwt-decode";
import fetchData from "../FetchData";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {Modal, Form, Button} from 'react-bootstrap'


//import "../App.css"
const Profile = () => {
    const [user, setUser] = useState({name:"", email: ""});
    const [adminId, setAdminId] = useState('');
    const [isLoaded, setIsLoaded] = useState(false); //set true if tocken is valid
    const [token, setToken] = useState('');
    const [show, setShow] = useState(false); //new post modal
    const [editPostModal, setEditPostModal] = useState(false);
    //posts
    const [post, setPost] = useState('');
    const [posts, setPosts] = useState([]);
    const [editpost, setEditPost] = useState('');
    const [postid, setPostId] = useState('');
    //alerts
    const [errorAlert, setErrorAlert] = useState(false);
    const [successAlert, setSuccessAlert] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [editAccount, setEditAccount] = useState(false);
    const [password, setPassword] = useState('');
    const [cPassword, setCPassword] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        refreshToken();
    }, []);

    const logout = async () => {
        await axios.get('http://localhost:3001/user/logout').
            then(function (response) {
                // handle success
                navigate("/");
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            })
    }
    const refreshToken = async () => {
        await axios.get('http://localhost:3001/user/token').
            then(function (response) {
                // handle success
                const decoded = jwt_decode(response.data.accessToken);
                setToken(response.data.accessToken);
                setIsLoaded(true);
                setAdminId(decoded.admin_id);
                setUser(decoded);
              })
              .catch(function (error) {
                // handle error
                console.log(error);
                if (error.response) {
                    navigate("/");
                }
             })
    }
    //show or hide modal
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    //show edit post modal
    const handleCloseEditModal = () => setEditPostModal(false);

    const deletePost = async (post) => {
        
        //alert('Delete post:'+ post.post_content);
        fetchData("DELETE", 'http://localhost:3001/post/DeletePost',{ postid: post._id }, token)
            .then((data) => {
                console.log("resolved", data);
                getUserPosts();
                alert(data.success);
            })
            .catch((err) => {
                console.log("rejected", err.message);
            });

    }

    const deleteAccount = async (e) => {
        e.preventDefault();
        setSuccessAlert(false);
        setErrorAlert(false);
        fetchData("DELETE", 'http://localhost:3001/user/delete',{ admin_id: adminId}, token)
            .then((data) => {
                console.log("resolved", data);
                setSuccessAlert(data.success);
                setTimeout(()=>{
                    setSuccessAlert(false);
                    setErrorAlert(false);
                    refreshToken();
                }, 4000);
            })
            .catch((err) => {
                console.log("rejected", err.message);
            });

    }

    const changePassword = async (e) => {
        e.preventDefault();
        setSuccessAlert(false);
        setErrorAlert(false);
        let isValid = true;
        if(password == ""){
            isValid = false;
            setErrorAlert("Password is empty");
        } 
        if(cPassword != password){
            isValid = false;
            setErrorAlert("Retype password");
        } 

        if(isValid){
            fetchData("PUT", 'http://localhost:3001/user/updatepassword',{ admin_id: adminId, password}, token)
            .then((data) => {
                console.log("resolved", data);
                setSuccessAlert(data.success);
                setTimeout(()=>{
                    setEditAccount(!editAccount)
                    setPassword('');
                    setCPassword('');
                    setSuccessAlert(false);
                    setErrorAlert(false);
                }, 4000);
            })
            .catch((err) => {
                console.log("rejected", err.message);
            });
        }   
    }

    const editPostForm = async (post) => {
        setEditPost(post.post_content);
        setPostId(post._id)
        setEditPostModal(true);
    }

    const saveEditedPostChanges = async (e) =>{
        e.preventDefault();
        setSuccessAlert(false);
        setErrorAlert(false);
        let validPost = true;
        if(editpost == ""){
            validPost = false;
            setErrorAlert("Post can not be empty");
        }
        if(validPost){
            fetchData("PUT", 'http://localhost:3001/post/UpdatePost',{
                postcontent: editpost,
                postId: postid
            }, token)
            .then((data) => {
                console.log("resolved", data);
                setEditPost('');
                setSuccessAlert(data.message);
                getUserPosts();
                setTimeout(()=>{
                    setSuccessAlert(false);
                    setErrorAlert(false);
                    handleClose();
                }, 4000);
            })
            .catch((err) => {
                console.log("rejected", err.message);
            });

        }
    }

    const saveNewPost = async (e) => {
        e.preventDefault();
        setErrorAlert(false);
        setSuccessAlert(false);
        let validPost = true;
        if(post == ""){
            validPost = false;
            setErrorAlert("Post can not be empty");
        }

        if(validPost){

            fetchData("POST", 'http://localhost:3001/post/CreatePost',{
                postcontent: post,
                admin_id: adminId
            }, token)
            .then((data) => {
                console.log("resolved", data);
                setPost('');
                setSuccessAlert(data.message);
                getUserPosts();
                setTimeout(()=>{
                    setSuccessAlert(false);
                    setErrorAlert(false);
                    handleCloseEditModal();
                }, 3000);
            })
            .catch((err) => {
                console.log("rejected", err.message);
            });
            
        }
    }

    const getUserPosts = async () =>{

        fetchData("POST", 'http://localhost:3001/post/UserPosts',{
            admin_id: adminId
        }, token)
            .then((data) => {
                console.log("resolved", data);
                setPosts(data);
            })
            .catch((err) => {
                console.log("rejected", err.message);
            });

    }

    if(isLoaded){
        getUserPosts();
        setIsLoaded(false);
    }

    return (
        <>
            <Navbar/>
            <div className="container">
               <div className="row justify-content-center">
                  <div className="col-md-8 col-sm-12 col-xl-6">
                     <div className="card mt-5">
                        <h2 className="card-title text-center">{user.username} </h2>
                        <h4 className="card-title text-center">Email: {user.email} </h4>
                        <h5 className="card-title text-center">Flollowers: {0} </h5>
                        <h5 className="card-title text-center">Flollowing: {0} </h5>
                        <h5 className="card-title text-center">Posts: {posts.length} </h5>
                        <hr/>
                        <div className="card-body">
                            {editAccount &&
                                <>
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
                                    <div class="form-group mb-3">
                                    <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" class="form-control" placeholder="Password"/>
                                    </div>
                                    <div class="form-group mb-3">
                                        <input value={cPassword} onChange={(e) => setCPassword(e.target.value)}  type="password" class="form-control" placeholder="confirm-password"/>
                                    </div>
                                    <div class="d-flex flex-row align-items-center justify-content-center">
                                        <button onClick={changePassword} class="btn btn-primary">Change</button>
                                    </div>
                                </>
                            }
                            <div class="text-center">    
                                <button onClick={logout}  className="btn btn-secondary btn-sm m-3">Logout</button>
                                <button onClick={handleShow} className="btn btn-primary btn-sm m-3">New post</button>
                                <button onClick={e=>{setEditAccount(!editAccount)}} className="btn btn-success btn-sm m-3">Edit account</button>
                                <button onClick={e=>{setConfirmDelete(true)}} className="btn btn-danger btn-sm m-3">Delete account</button>
                            </div>
                        </div>
                     </div>
                  </div>
               </div>
               {posts.map((post,) => (
                    <div key={post.post_id} className="row justify-content-center">
                        <div className="col-md-8 col-sm-12 col-xl-6">
                            <div className="card mt-2">
                                <div className="card-body">
                                    <p className="text-center">{post.post_content}</p>
                                    <div className="d-grid gap-2 d-md-flex justify-content-between">
                                        <div className="float-left"><button onClick={e=> editPostForm(post) } className="btn btn-sm btn-primary">Edit</button></div>
                                        <div className="float-right"><button onClick={e=> deletePost(post)} className="btn btn-sm btn-danger me-md-2">Delete</button></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
               ))}
               <div className="row">
               <Modal show={confirmDelete} onHide={e=>{setConfirmDelete(false)}}>
                    <Modal.Header closeButton>
                    <Modal.Title>Delete Account</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {successAlert && 
                            <div className="alert alert-success" role="alert">
                                {successAlert}
                            </div>
                        }
                        <p className="text-center">Are you sure you want to delete your account?</p>
                    </Modal.Body>
                    <Modal.Footer>
                    <Button variant="secondary" onClick={e=>{setConfirmDelete(false)}}>
                        Close
                    </Button>
                    <Button variant="danger" onClick={deleteAccount}>
                        Delete
                    </Button>
                    </Modal.Footer>
                </Modal>
               <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                    <Modal.Title>New post</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
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
                        <Form>
                            <Form.Group
                                className="mb-3"
                                controlId="exampleForm.ControlTextarea1">
                                <Form.Label>Post content</Form.Label>
                                <Form.Control
                                    as="textarea" 
                                    rows={3}
                                    value={post} 
                                    onChange={(e) => setPost(e.target.value)} />
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                    <Button variant="secondary" className="btn-sm" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" className="btn-sm" onClick={saveNewPost}>
                        Save
                    </Button>
                    </Modal.Footer>
                </Modal>
                <Modal show={editPostModal} onHide={handleCloseEditModal}>
                    <Modal.Header closeButton>
                    <Modal.Title>Edit post</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
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
                        <Form>
                            <Form.Group
                                className="mb-3"
                                controlId="exampleForm.ControlTextarea1">
                                <Form.Label>Post content</Form.Label>
                                <Form.Control
                                    as="textarea" 
                                    rows={3}
                                    value={editpost} 
                                    onChange={(e) => setEditPost(e.target.value)} />
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                    <Button variant="secondary" className="btn-sm" onClick={handleCloseEditModal}>
                        Close
                    </Button>
                    <Button variant="primary" className="btn-sm" onClick={saveEditedPostChanges}>
                        Save
                    </Button>
                    </Modal.Footer>
                </Modal>
               </div>
            </div>
        </>
    );
}
export default Profile;