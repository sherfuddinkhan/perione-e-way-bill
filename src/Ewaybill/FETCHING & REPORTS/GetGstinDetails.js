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

          {
            isSuccess
            ?
            "SUCCESS"
            :
            "FAILED"
          }

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
const GetGstinDetails = () => {


const {
authData,
connectionType
} = useAuth();




const [email,setEmail] = useState("");

const [gstin,setGstin] = useState("");

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







// Load Auth Data

useEffect(()=>{


if(authData){



setHeaders({

gstin:
authData.gstin || "",


client_id:
authData.client_id || "",


client_secret:
authData.client_secret || "",


ip_address:
authData.ip_address || "",


env:
authData.env || "",


ConnectionType:
connectionType || ""

});




if(authData.gstin){

setGstin(
authData.gstin
);

}



if(authData.email){

setEmail(
authData.email
);

}



}



},[authData,connectionType]);








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

"https://einvoice.fcssoftwares.com/api/perione/ewaybill/gstin-details",


{


params:{


email:email,


GSTIN:gstin


},



headers:{


ip_address:
headers.ip_address,


client_id:
headers.client_id,


client_secret:
headers.client_secret,


gstin:
headers.gstin,


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
message:err.message
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



<div style={styles.header}>


<span style={styles.badge}>
LOOKUP
</span>


<h1 style={styles.title}>
Get GSTIN Details
</h1>


<p style={styles.subtitle}>
Verify and fetch taxpayer profile information
</p>


</div>






<form
onSubmit={handleSearch}
style={styles.form}
>





{/* Headers */}

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
key==="client_secret"
?
"password"
:
"text"
}

name={key}

value={headers[key]}

onChange={handleHeaderChange}

style={styles.input}

/>


</div>


))


}



</div>







{/* Email */}

<div style={styles.fieldGroup}>


<label style={styles.label}>
Email
</label>


<input

type="email"

value={email}

onChange={
(e)=>
setEmail(
e.target.value
)
}

placeholder="registered email with PeriOne"

required

style={styles.input}

/>


</div>







{/* GSTIN */}

<div style={styles.fieldGroup}>


<label style={styles.label}>
GSTIN
</label>



<input

type="text"

value={gstin}

onChange={
(e)=>
setGstin(
e.target.value
)
}

placeholder="36AARFB4347G037"

required

style={styles.input}

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








const styles={


outerContainer:{

display:"flex",

justifyContent:"center",

alignItems:"center",

minHeight:"100vh",

backgroundColor:"#f8fafc",

padding:"20px"

},



card:{

backgroundColor:"#fff",

borderRadius:"16px",

boxShadow:"0 10px 25px rgba(0,0,0,.08)",

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

backgroundColor:"#fee2e2",

color:"#dc2626",

padding:"4px 12px",

borderRadius:"20px",

fontSize:"11px",

fontWeight:"700"

},



title:{

fontSize:"22px",

color:"#0f172a"

},



subtitle:{

fontSize:"13px",

color:"#64748b"

},



authBox:{

backgroundColor:"#f1f5f9",

padding:"15px",

borderRadius:"10px"

},



form:{

display:"flex",

flexDirection:"column",

gap:"16px"

},



fieldGroup:{

display:"flex",

flexDirection:"column"

},



label:{

fontSize:"12px",

fontWeight:"600",

marginBottom:"6px",

color:"#334155"

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

color:"#fff",

border:"none",

borderRadius:"8px",

fontWeight:"600",

cursor:"pointer"

},



responseCard:{

marginTop:"20px",

padding:"16px",

borderRadius:"10px",

borderWidth:"1px",

borderStyle:"solid"

},



responseHeader:{

display:"flex",

gap:"10px",

alignItems:"center"

},



statusBadge:{

color:"#fff",

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



export default GetGstinDetails;