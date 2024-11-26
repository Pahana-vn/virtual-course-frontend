import PropTypes from 'prop-types'; // Thêm import PropTypes
import React, { useState } from 'react';
import { uploadFile } from "../services/fileService";

const FileUpload = ({ onUploadComplete }) => {
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        if (!file) {
            alert("Please select a file first!");
            return;
        }

        setUploading(true);
        try {
            const filePath = await uploadFile(file); // Gọi API để upload file
            alert("File uploaded successfully!");
            onUploadComplete(filePath); // Gọi callback khi upload xong
        } catch (error) {
            console.error("Error uploading file:", error);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div>
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleUpload} disabled={uploading}>
                {uploading ? "Uploading..." : "Upload"}
            </button>
        </div>
    );
};

// Định nghĩa kiểu dữ liệu cho props
FileUpload.propTypes = {
    onUploadComplete: PropTypes.func.isRequired, // Định nghĩa onUploadComplete là hàm bắt buộc có thể bỏ isRequired không bắt buộc
};

export default FileUpload;
