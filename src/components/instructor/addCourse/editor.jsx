import React from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import PropTypes from "prop-types";

const TextEditor = ({value, onChange}) => {
  return (
    <CKEditor
      editor={ClassicEditor}
      data={value || ""}
      onChange={(event, editor) => {
        const data = editor.getData(); // Lấy dữ liệu từ CKEditor
        onChange(data); // Truyền dữ liệu về component cha
      }}
    //   onReady={(editor) => {
    //     // You can store the "editor" and use when it is needed.
       
    //   }}
    //   onChange={(event, editor) => {
    //     const data = editor.getData();
    //     console.log({ event, editor, data });
    //   }}
    //   onBlur={(event, editor) => {
    //     console.log("Blur.", editor);
    //   }}
    //   onFocus={(event, editor) => {
    //     console.log("Focus.", editor);
    //   }}
    />
  );
};
TextEditor.propTypes = {
  value: PropTypes.string, // `value` phải là một chuỗi (có thể null hoặc undefined)
  onChange: PropTypes.func.isRequired, // `onChange` là hàm bắt buộc
};
export default TextEditor;
