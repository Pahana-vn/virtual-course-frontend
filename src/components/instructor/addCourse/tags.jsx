import React, { useState } from "react";
import PropTypes from "prop-types";
import { TagsInput } from "react-tag-input-component";

const ReactTagsInput = ({ tags = [], onAddTag = () => {}, onRemoveTag = () => {}, maxLength = 30 }) => {
  const [localTags, setLocalTags] = useState(tags || []);

  const handleChange = (newTags) => {
    const addedTag = newTags.find((tag) => !localTags.includes(tag));

    // Kiểm tra nếu tag mới vượt quá giới hạn ký tự
    if (addedTag && addedTag.length > maxLength) {
      alert(`Tags cannot exceed ${maxLength} characters.`);
      return; // Ngăn không thêm tag mới
    }

    if (newTags.length > localTags.length) {
      onAddTag && onAddTag(addedTag); // Gọi callback thêm tag
    } else if (newTags.length < localTags.length) {
      const removedTag = localTags.find((tag) => !newTags.includes(tag));
      onRemoveTag && onRemoveTag(removedTag); // Gọi callback xóa tag
    }

    setLocalTags(newTags); // Cập nhật danh sách tag
  };

  // Đồng bộ hóa khi `tags` từ Redux thay đổi
  React.useEffect(() => {
    setLocalTags(tags);
  }, [tags]);

  return (
    <div>
      <TagsInput
        value={localTags}
        onChange={handleChange}
        name="tags"
        placeHolder="Enter tags"
      />
    </div>
  );
};

// Khai báo propTypes
ReactTagsInput.propTypes = {
    tags: PropTypes.arrayOf(PropTypes.string), // Mảng các chuỗi
    onAddTag: PropTypes.func, // Hàm callback khi thêm tag
    onRemoveTag: PropTypes.func, // Hàm callback khi xóa tag
    maxLength: PropTypes.number,
  };
  

export default ReactTagsInput;
