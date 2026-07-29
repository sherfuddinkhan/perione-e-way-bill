import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../AuthContext";


// Response Viewer
const ResponseViewer = ({ response }) => {

  if (!response) return null;

  const isSuccess = response.success;

  return (

    <div
      style={{
        ...styles.responseCard,
        backgroundColor: isSuccess ? "#f0fdf4" : "#fef2f2",
        borderColor: isSuccess ? "#bbf7d0" : "#fecaca",
      }}
    >

      <div style={styles.responseHeader}>

        <span
          style={{
            ...styles.statusBadge,
            backgroundColor: isSuccess
              ? "#16a34a"
              : "#dc2626",
          }}
        >
          {isSuccess ? "SUCCESS" : "FAILED"}
        </span>


        <span style={styles.responseDesc}>
          {
            response.data?.status_desc ||
            "Response Details"
          }
        </span>


      </div>


      <pre style={styles.jsonViewer}>
        {
          JSON.stringify(
            response.data,
            null,
            2
          )
        }
      </pre>


    </div>

  );

};




// Main Component
const GetHsnDetails = () => {


  const {
    authData,
    connectionType
  } = useAuth();



  const [hsncode,setHsncode] = useState("");

  const [loading,setLoading] = useState(false);

  const [response,setResponse] = useState(null);



  const [headers,setHeaders] = useState({

    gstin:"",
    client_id:"",
    client_secret:"",
    ip_address:"",
    env:"",
    ConnectionType:""

  });



  // Load Auth Details
  useEffect(()=>{


    if(authData){


      setHeaders({

        gstin: authData.gstin || "",

        client_id: authData.client_id || "",

        client_secret: authData.client_secret || "",

        ip_address: authData.ip_address || "",

        env: authData.env || "",

        ConnectionType: connectionType || ""

      });


    }


  },[authData,connectionType]);






  // Load Previous HSN
  useEffect(()=>{


    const ewayBill =
      JSON.parse(
        localStorage.getItem(
          "ewaybill_response"
        )
      );


    if(ewayBill?.hsnCode){

      setHsncode(
        ewayBill.hsnCode
      );

    }


  },[]);






  const handleHeaderChange=(e)=>{


    setHeaders({

      ...headers,

      [e.target.name]:
        e.target.value

    });


  };








  const handleSearch = async(e)=>{


    e.preventDefault();


    setLoading(true);

    setResponse(null);



    try{


      const res = await axios.get(

        "https://einvoice.fcssoftwares.com/api/perione/ewaybill/hsn-details",


        {

          params:{

            hsncode:hsncode

          },


          headers:{


            gstin:
              headers.gstin,


            client_id:
              headers.client_id,


            client_secret:
              headers.client_secret,


            ip_address:
              headers.ip_address,


            env:
              headers.env,


            ConnectionType:
              headers.ConnectionType


          }


        }


      );



      setResponse({

        success:true,

        data:res.data

      });



    }

    catch(err){


      setResponse({

        success:false,

        data:
          err.response?.data ||
          {
            message:
              err.message
          }

      });


    }


    finally{


      setLoading(false);


    }


  };








  return (

    <div style={styles.outerContainer}>


      <div style={styles.card}>


        {/* Header */}

        <div style={styles.header}>


          <span style={styles.badge}>
            E-WAY BILL
          </span>


          <h1 style={styles.title}>
            Get HSN Details
          </h1>


          <p style={styles.subtitle}>
            Fetch HSN information using PeriOne API
          </p>


        </div>





        <form
          style={styles.form}
          onSubmit={handleSearch}
        >




          {/* API Headers */}

          <div style={styles.authBox}>


            <h4>
              API Connection Details
            </h4>



            {

              Object.keys(headers).map((key)=>(


                <div
                  key={key}
                  style={styles.fieldGroup}
                >


                  <label style={styles.label}>
                    {key}
                  </label>



                  <input

                    type={
                      key === "client_secret"
                      ?
                      "password"
                      :
                      "text"
                    }


                    name={key}


                    value={
                      headers[key]
                    }


                    onChange={
                      handleHeaderChange
                    }


                    style={styles.input}

                  />


                </div>


              ))

            }



          </div>





          {/* HSN Code */}

          <div style={styles.fieldGroup}>


            <label style={styles.label}>
              HSN Code
            </label>


            <input

              type="text"

              value={hsncode}

              onChange={
                (e)=>
                setHsncode(
                  e.target.value
                )
              }


              placeholder="847130"


              style={styles.input}


              required

            />


          </div>






          <button

            type="submit"

            disabled={loading}

            style={styles.button}

          >

            {
              loading
              ?
              "Fetching..."
              :
              "Get Details"
            }


          </button>




        </form>





        <ResponseViewer response={response}/>



      </div>


    </div>


  );

};









const styles = {


outerContainer:{

display:"flex",

justifyContent:"center",

alignItems:"center",

minHeight:"100vh",

backgroundColor:"#f8fafc",

padding:"20px"

},



card:{

backgroundColor:"#ffffff",

borderRadius:"16px",

boxShadow:
"0 10px 25px rgba(0,0,0,.08)",

border:"1px solid #e2e8f0",

width:"100%",

maxWidth:"520px",

padding:"32px"

},



header:{

textAlign:"center",

marginBottom:"20px"

},



badge:{

display:"inline-block",

padding:"4px 12px",

borderRadius:"20px",

backgroundColor:"#fee2e2",

color:"#dc2626",

fontSize:"11px",

fontWeight:"700"

},



title:{

fontSize:"22px",

margin:"10px 0",

color:"#0f172a"

},



subtitle:{

fontSize:"13px",

color:"#64748b"

},



authBox:{

backgroundColor:"#f1f5f9",

padding:"15px",

borderRadius:"10px",

marginBottom:"15px"

},



form:{

display:"flex",

flexDirection:"column",

gap:"16px"

},



fieldGroup:{

display:"flex",

flexDirection:"column",

marginBottom:"10px"

},



label:{

fontSize:"12px",

fontWeight:"600",

marginBottom:"6px"

},



input:{

padding:"10px 14px",

border:"1px solid #cbd5e1",

borderRadius:"8px",

fontSize:"14px"

},



button:{

padding:"12px",

backgroundColor:"#dc2626",

color:"#ffffff",

border:"none",

borderRadius:"8px",

fontWeight:"600",

cursor:"pointer"

},



responseCard:{

marginTop:"20px",

padding:"16px",

borderRadius:"10px",

borderStyle:"solid",

borderWidth:"1px"

},



responseHeader:{

display:"flex",

gap:"10px",

alignItems:"center",

marginBottom:"10px"

},



statusBadge:{

color:"#ffffff",

padding:"4px 8px",

borderRadius:"5px",

fontSize:"10px"

},



responseDesc:{

fontSize:"12px",

fontWeight:"600"

},



jsonViewer:{

backgroundColor:"#0f172a",

color:"#38bdf8",

padding:"12px",

borderRadius:"6px",

fontSize:"11px",

overflowX:"auto"

}


};




export default GetHsnDetails;