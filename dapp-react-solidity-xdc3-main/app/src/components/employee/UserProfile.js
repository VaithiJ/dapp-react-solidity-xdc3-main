import React, { useState, useEffect, useContext, useRef } from "react";
import "./task.css"
import Footercr from "../footer/footercr";
import { useCookies } from "react-cookie";
import Header from "../Headerr/Header";
import { IoIosArrowDropdownCircle } from "react-icons/io";
import { Table } from "react-bootstrap";
import SidebarMenu12 from "./side1";
import jwt_decode from "jwt-decode";
import axios from "axios";
import {storage} from "../../firebase.js"
import {v4 as uuidv4} from "uuid";
import {ref, uploadBytes, getDownloadURL, listAll, list} from "firebase/storage";
const { executeTransaction, EthereumContext, log, queryData } = require('react-solidity-xdc3');


const ProfilePage = (props) => {
  const [progressWidth, setProgressWidth] = useState(0);
  const [cookies, setCookie, removeCookie] = useCookies(["employee_token",
  "name",]);
  const [employees, setEmployees] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [boxVisible, setBoxVisible] = useState(false);
  const API_URL = "http://localhost:8800";
  const [submitting, setSubmitting] = useState(false);
  const { provider, erc } = useContext(EthereumContext);
  console.log("sample", erc)
  const handlePursuingClick = () => {
    if (progressWidth < 100) {
      setProgressWidth(progressWidth + 10);
    }
  };
  // const viewCertificate = async (token) => {
  //   let taskId = (token._id).slice(-5);
  //   console.log(taskId);
  //   setSubmitting(true);
  //   let response = await queryData(erc, provider, 'getFileHash', [taskId]);
  //   log("Returned hash", "hash", response);
  //   setSubmitting(false);
  //   const fileName = "b8a47cf35a3a9b8c0e36908becf9f2f6b306d233740356582fe37c80055db180";
  //   const fileListRef = ref(storage,'certificates')
  
  // };
  const viewCertificate = async (token) => {
    let taskId = (token._id).slice(-5);
    console.log(taskId);
    setSubmitting(true);
    let response = await queryData(erc, provider, 'getFileHash', [taskId]);
    log("Returned hash", "hash", response);
    setSubmitting(false);
    const fileListRef = ref(storage, 'certificates');
    listAll(fileListRef)
      .then((res) => {
        res.items.forEach((itemRef) => {
          if (itemRef.name.slice(-64) === response) {
            console.log(itemRef.fullPath);
            getDownloadURL(itemRef)
              .then((url) => {
                console.log(url);
                window.open(url, '_blank');
              })
              .catch((error) => {
                console.log(error);
              });
          }
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };
   const [showButton, setShowButton] = useState(false);
 const [delay, setDelay] = useState(200);
 const [avatarUrl, setAvatarUrl] = useState("");
 const [red, setred] = useState([]);
 const [fileList, setFileList] = useState([]);
  
  const handleLogout = () => {
    removeCookie("employee_token");
    // if (response === fileName) {
    //   const fileRef = fileName.slice(0, fileName.indexOf("_"));
    //   try {
    //     const url = await getDownloadURL(fileRef);
    //     console.log(url);
    //     window.open(url, "_blank");
    //   } catch (error) {
    //     console.error(error);
    //   }
    // }
  };
  const handleBoxClick = () => {
    setBoxVisible(!boxVisible);
  };
 const setemployees=(data)=>{
  setEmployees(data)
  console.log('function',employees)
 }
 const uploadFile = (fileUpload) => {
  if (fileUpload == null) return;
  const fileName = fileUpload.name + uuidv4();
  const fileRef = ref(storage, `UserProfile/${toke.name}/${fileName}`);
  uploadBytes(fileRef, fileUpload).then((snapshot) => {
    getDownloadURL(snapshot.ref).then((url) => {
      setFileList((prev) => [...prev, { name: fileName, url: url }]);
      setAvatarUrl(url);
      const red = fileName;
      console.log(fileName);
      
      axios
        .put(
          `${API_URL}/updateprofile/${toke.name}`,
          { profile: fileName },
          { withCredentials: true }
        )
        .then((response) => {
          const updated = response.data.updatedprofile;
          
        });
    });
  });
};

useEffect(() => {
  const fetchProfile = async () => {
    try {
      const response = await axios.put(`${API_URL}/updateprofile/${toke.name}`);
      const red = response.data.updatedprofile;
      setred(red);

      const storageRef = ref(storage, `UserProfile/${toke.name}`);
      const listResult = await listAll(storageRef);

      const itemRef = listResult.items.find((ref) => ref.name === red.profile);
      if (itemRef) {
        const url = await getDownloadURL(itemRef);
        setAvatarUrl(url);
      }
    } catch (error) {
      console.error(error);
    }
  };

  fetchProfile();
}, []);

 
 const handleMouseEnter = () => {
   setShowButton(true);
 };
 
 const handleMouseLeave = (event) => {
  // Check if the mouse has moved over the button
  const relatedTarget = event.relatedTarget;
  const button = document.querySelector("button");
  if (button && button.contains(relatedTarget)) {
    return;
  }
  
  // If the mouse is not over the button, hide the button
  setDelay(700); // set a delay of 200ms
  setTimeout(() => {
    setShowButton(false);
  }, delay);
};

const buttonRef = useRef(null);

const handleButtonClick = () => {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "image/jpeg";
  input.addEventListener("change", (event) => {
    const file = event.target.files[0];
    uploadFile(file);
  });
  input.click();
};

  

  const toke = jwt_decode(cookies.employee_token);
  console.log(toke)
  useEffect(() => {
  axios
      .get(`${API_URL}/viewtask`, { withCredentials: true })
      .then((response) => {
        setTasks(
          response.data.tasks.filter((tasks) => tasks.empName === (toke.name) && tasks.status === "Rewarded" )
          
        );
        console.log(response.data.tasks);
      })
      // const red= response.data.tasks.filter((tasks) => tasks.empName == toke.name)
      // console.log(rd)
      .catch((error) => {
        console.log(error);
      });
      
  }, []);
  console.log(tasks);
  useEffect(() => {
    axios
      .get(`${API_URL}/comemps`, { withCredentials: true })
      .then((response) => {
        setemployees(response.data.details.filter((details) => details.Name === toke.name));
       
      })
      .catch((error) => {
        console.log(error);
      });
    },[])
  return (
    <div style={{ height: "auto",backgroundColor:'#F9F8F8' }}>
      <header style={{ 
      backgroundColor: 'white',
      padding: '20px',
      borderBottom: '1px solid #ddd',
      display: 'flex',
      alignItems: 'center'
    }}>  <div style={{display:"flex",position:"relative",bottom:"10px"}}> <SidebarMenu12/></div>
      <img src={avatarUrl || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQRCD2IRkg5xxZTdaHZrj4MXtcwuvo2xSPOACVOPvQ&s'} alt="User Avatar" style={{ 
        borderRadius: '50%',
        marginRight: '20px',
        width:"50px",
        height:"50px",
        position:"relative",
        left:"40px"

      }} />
      <p style={{ 
        margin: '0',
        fontSize: '16px',
        color: '#000000',
        position:"relative",
        left:"40px",
        fontFamily: "Secular One"

      }}>{toke.name}</p>
      <h1 style={{ 
        margin: '0',
        fontSize: '35px',
        fontWeight: 'bold',
        color: '#0F6292',
        flex: 4,
        textAlign:"center",
        position:"relative",
        right:"80px",
        color:"#000000",
        fontFamily: "Secular One"
      }}>
        USER PROFILE</h1>
        
                
    </header>
      
      <div
        className="card"
        style={{
          width: "900px",
          height: "140px",
          flexDirection: "row",
          background: "#FFFFFF",
          margintop: "100px",
          position: "relative",
          top: "30px",
          left: "240px",
        }}
      >
          <div style={{ position: "relative", display: "inline-block" }}>
  <img src={avatarUrl || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQRCD2IRkg5xxZTdaHZrj4MXtcwuvo2xSPOACVOPvQ&s'}
  alt="User Avatar" 
    style={{
      border: "3px solid #ccc",
      boxShadow: "0px 0px 10px #ccc",
      borderRadius: "50%",
      width: "120px",
      height: "120px",
      zIndex: 1,
      position:"relative",
      top:"8px",
      left:"10px"
    }}
    onMouseEnter={handleMouseEnter}
    onMouseLeave={handleMouseLeave}
  />
  {showButton && (
    <button
      ref={buttonRef}
      onClick={handleButtonClick}
      style={{
        position: "absolute",
        top: "80%",
        left: "60%",
        transform: "translate(-50%, -50%)",
        backgroundColor: "#007bff",
        borderRadius: "50%",
        width: "30px",
        height: "30px",
        border: "none",
        boxShadow: "0px 0px 10px #ccc",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        cursor: "pointer",
        zIndex: 1,
      }}
    >
      Edit 
    </button>
  )}
</div>
        {/* <img
          src="https://img.freepik.com/free-icon/user_318-159711.jpg"
          alt="Avatar"
          style={{
            border: "3px solid #ccc",
            boxShadow: "0px 0px 10px #ccc",
            borderRadius: "50%",
            marginLeft: "5%",
            width: "120px",
            height: "120px",
            position: "relative",
            top: "10px",
          }}
        /> */}

        <div
          classname="red"
          style={{
            flexDirection: "column",
            position: "relative",
            top: "35px",
            left: "30px",
            flexDirection: "column",
          }}
        >
          <p style={{ display: "inline-block" }}>
            <b style={{ color: "#537FE7", display: "inline",position:"relative",right:"197px",fontFamily: "Secular One" }}>Name :<b style={{color:"#000000",position:"relative",left:"10px",fontFamily: "Secular One" }}>{toke.name} </b> </b> 
          </p>

          <p>
            {" "}
            <b style={{ color: "#537FE7" ,fontFamily: "Secular One" }}> Wallet Address: <b style={{color:"#000000",position:"relative",left:"10px",fontFamily: "Secular One" }}> {toke.wallet} </b></b>
          </p>
        </div>
        <div>
          <div
            onClick={handleBoxClick}
            style={{
              position: "absolute",
              bottom: "10px",
              right: "-10px",
              height: "20%",
              width: "20%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              transition: "all 0.2s ease",
              ":hover": {
                transform: "scale(1.2)",
                background: "#FFFFFF",
                fontFamily: "Secular One" 
              },
            }}
          >
            <b style={{ fontFamily: "Secular One" }}>Token History{" "} </b>
            <IoIosArrowDropdownCircle style={{ fontSize: "30px" }} />
          </div>
        </div>
      </div>
      {boxVisible && (
        <div
          className="Acheivements"
          style={{
            marginLeft: "238px",
            position: "relative",
            top: "55px",
            borderRadius: "20px" 
          }}
        >
          <div style={{ textAlign: "center", height: "40px" }}>
            <h6>
              <p
                style={{
                  fontSize: "1.4rem",
                  textAlign: "center",
                  position: "relative",
                  top: "10px",
                  left: "15px",
                }}
              >
                {" "}
                <b style={{ color: "#537FE7", padding: "40px",fontFamily: "Secular One"}}>
                  Token History
                </b>{" "}
              </p>
            </h6>
          </div>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th style={{ color: "#537FE7", textAlign: "center" ,fontFamily: "Secular One" }}>
                  Company 
                </th>
                <th style={{ color: "#537FE7", textAlign: "center" ,fontFamily: "Secular One" }}>
                  Rewarded Tasks
                </th>
                <th style={{ color: "#537FE7", textAlign: "center" ,fontFamily: "Secular One" }}>Completion Date</th>
                {/* <th style={{ color: "#537FE7", textAlign: "center" }}>
                  Deadline
                </th> */}
                <th style={{ color: "#537FE7", textAlign: "center" ,fontFamily: "Secular One" }}>
                  Tokens Earned
                </th>
                <th style={{ color: "#537FE7", textAlign: "center" ,fontFamily: "Secular One" }}>
                  Certificates
                </th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((token, index) => (
                <tr key={index}>
                  <td style={{ fontFamily: "Secular One" }}>{token.companyName}</td>
                  <td style={{ fontFamily: "Secular One" }}>{token.task}</td>
                  <td align="center" style={{ fontFamily: "Secular One" }}>{token.deadline}</td>
                  {/* <td align="center">{token.rating}</td> */}
                  <td align="center" style={{ fontFamily: "Secular One" }}>{token.rewards}</td>
                  <td align="center" ><button style={{ 
                marginRight: '10px', 
                padding: '8px 16px', 
                background: 'blue', 
                color: 'white', 
                border: 'none', 
                borderRadius: '4px', 
                cursor: 'pointer',
                fontFamily: "Secular One" 
              }}onClick={() => viewCertificate(token)}> View</button></td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}
      <div
        className="card1"
        style={{
          marginLeft: "238px",
          position: "relative",
          top: "50px",
          textAlign: "center",
          borderRadius: "20px",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <h6>
            <b style={{ fontSize: "1.4rem", color: "#537FE7",fontFamily: "Secular One"  }}>INFORMATION</b>
          </h6>{" "}
        </div>
        <hr className="mt-0 mb-4" />
        <div className="row pt-1">
          <div className="col-6 mb-3 d-flex align-items-left" style={{position:"relative",left:"50px"}} >
            <h6 style={{ color: "#537FE7", marginRight: "20px" ,fontFamily: "Secular One" }}>Name:</h6>
            <p className="text-muted  mb-6" style={{fontFamily: "Secular One" }}>{toke.name}</p>
          </div>
          <div className="col-6 mb-3 d-flex align-items-left" style={{position:"relative",left:"50px"}}>
            <h6 style={{ color: "#537FE7", marginRight: "20px" ,fontFamily: "Secular One"  }}>Email:</h6>
            <p className="text-muted mb-6" style={{fontFamily: "Secular One" }}>{toke.email}</p>
          </div>
          <div className="col-6 mb-3 d-flex align-items-left" style={{position:"relative",left:"50px"}}>
            <h6 style={{ color: "#537FE7", marginRight: "20px" ,fontFamily: "Secular One"  }}>Phone:</h6>
            <p className="text-muted  mb-6" style={{fontFamily: "Secular One" }}>{toke.mobile}</p>
          </div>

          <div className="col-6 mb-3 d-flex align-items-left" style={{position:"relative",left:"50px"}}>
            <h6 style={{ color: "#537FE7", marginRight: "20px" ,fontFamily: "Secular One"  }}>Address:</h6>
            <p className="text-muted mb-0" style={{fontFamily: "Secular One" }}>{toke.address}</p>
          </div>
          <div className="col-6 mb-3 d-flex align-items-left" style={{position:"relative",left:"50px"}}>
            <h6 style={{ color: "#537FE7", marginRight: "20px" ,fontFamily: "Secular One"  }}>Wallet Address:</h6>
            <p className="text-muted  mb-6" style={{fontFamily: "Secular One" }}>{toke.wallet}</p>
          </div>
          <div className="col-6 mb-3 d-flex align-items-left" style={{position:"relative",left:"50px"}}>
            <h6 style={{ color: "#537FE7", marginRight: "20px",fontFamily: "Secular One"   }}>ID:</h6>
            <p className="text-muted  mb-6" style={{fontFamily: "Secular One" }}>{toke.id}</p>
          </div>
        </div>
        <div style={{ marginTop: "80px" }}>
          <div style={{ textAlign: "center" }}>
            <h6>
              <b
                style={{
                  fontSize: "1.4rem",
                  color: "#537FE7",
                  textAlign: "center"
                  ,fontFamily: "Secular One" 
                }}
              >
                COMPANY
              </b>
            </h6>
          </div>
          <hr className="mt-0 mb-4" />
          {employees.map((emp)=>( <div className="row pt-1">
            <div className="col-6 mb-3 d-flex align-items-left" style={{position:"relative",left:"50px"}}>
              <h6 style={{ color: "#537FE7",marginRight: "20px",fontFamily: "Secular One"  }}>Company Name:</h6>
              <p className="text-muted mb-0" style={{fontFamily: "Secular One" }}>{emp.comName}</p>
            </div>
            <div className="col-6 mb-3 d-flex align-items-left" style={{position:"relative",left:"50px"}}>
              <h6 style={{ color: "#537FE7",marginRight: "20px",fontFamily: "Secular One"  }}>EmployeeId:</h6>
              <p className="text-muted mb-0" style={{fontFamily: "Secular One" }}>{emp.comId}</p>
            </div>
            </div>))}
         
          </div>
       
      </div>

      <div></div>
      {/* <footer >  © All Rights Reserved | 2023 SecurekloudTechnologies. </footer> */}
      
    </div>
  );
};
export default ProfilePage;