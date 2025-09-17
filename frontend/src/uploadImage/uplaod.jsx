import React ,{useState,useRef}from 'react';
import axios from 'axios';

const PYTHON_URL = import.meta.env.VITE_PYTHON_URL;

const Upload = () => {
    const [image,setImage] = useState(null);
    const fileInputRef = useRef(null);
    const captureInputRef = useRef(null);

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(URL.createObjectURL(file));
            const formdata = new FormData()
            formdata.append('image',file);

            const res =  await axios.post(`${PYTHON_URL}/upload`,formdata,{
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log(res.data);
        }
    }

    const openFilePicker = () => {
        fileInputRef.current.click();
    }

    const openFilePickerCapture = () => {
        captureInputRef.current.click();
    }
    return (
        <div>

            <input type='file' 
                style={{visibility:'hidden'}}
                ref = {fileInputRef}
                accept='image/*'
                onChange={handleImageChange}
            />

            <input type='file' 
                style={{visibility:'hidden'}}
                ref = {captureInputRef}
                accept='image/*'
                capture="environment"
                onChange={handleImageChange}
            />

            {/* works on pc and  mobile  */}
            <button onClick={openFilePicker} className='bg-green-500 text-xl text-white rounded-lg p-3 cursor-pointer'>Upload</button>

            {/*works on  mobile  */}
            <button onClick={openFilePickerCapture} className='bg-green-500 text-xl text-white rounded-lg p-3 ml-4 md:hidden'>Capture</button>

            {image && (
        <img src={image} alt="Preview" className="w-40 h-40 rounded-lg mt-4" />
      )}
        </div>
    );
}

export default Upload;
