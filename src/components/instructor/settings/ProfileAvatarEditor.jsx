import React, { useRef, useState } from "react";
import PropTypes from "prop-types";
import AvatarEditor from "react-avatar-editor";
import Popup from "../addCourse/popup";

const ProfileAvatarEditor = ({ isOpen, onClose, onSave, currentAvatar }) => {
  const editorRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [scale, setScale] = useState(1.2);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    setSelectedImage(URL.createObjectURL(file));
  };

  const getCroppedImage = () => {
    if (!editorRef.current) return;
    return new Promise((resolve) => {
      const canvas = editorRef.current.getImageScaledToCanvas();
      canvas.toBlob((blob) => {
        resolve(blob);
      }, "image/jpeg"); // Chuyển thành Blob
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const croppedImage = await getCroppedImage();
    if (croppedImage) {
      onSave(croppedImage); // Trả ảnh về component cha
      onClose(); // Đóng popup
    }
  };

  return (
    <Popup
      isOpen={isOpen}
      title="Edit Avatar"
      onClose={onClose}
      onSubmit={handleSave}
    >
      <input type="file" accept="image/*" onChange={handleFileChange} />
      <div className="row">
        <div className="col-lg-8">
          {selectedImage || currentAvatar ? (
            <AvatarEditor
              ref={editorRef}
              image={selectedImage || currentAvatar}
              width={150}
              height={150}
              border={30}
              scale={scale}
              borderRadius={100}
            />
          ) : (
            <p>No image selected</p>
          )}
        </div>
        <div className="col-lg-4">
          <input
            type="range"
            min="1"
            max="3"
            step="0.1"
            value={scale}
            onChange={(e) => setScale(parseFloat(e.target.value))}
          />
        </div>
      </div>
    </Popup>
  );
};
ProfileAvatarEditor.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  currentAvatar: PropTypes.string.isRequired,
  children: PropTypes.node,
};

export default ProfileAvatarEditor;
