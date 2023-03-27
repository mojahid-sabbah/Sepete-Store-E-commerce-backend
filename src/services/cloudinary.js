import  cloudinary from 'cloudinary';


// Configuration 
cloudinary.v2.config({
  cloud_name: "dfufxsyra",
  api_key: "556641611229361",
  api_secret: "IfcNIAyFQpYzJflHkz76V6YiTbs"
});

export default cloudinary.v2;