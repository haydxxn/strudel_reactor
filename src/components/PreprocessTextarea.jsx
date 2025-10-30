const PreprocessTextarea = ({ songText, onChange }) => {
  return (
    <>
      <label htmlFor="exampleFormControlTextarea1" className="form-label">
        Text to preprocess:
      </label>
      <textarea
        className="form-control"
        rows="19"
        id="proc"
        defaultValue={songText}
        onChange={onChange}
      />
    </>
  );
};

export default PreprocessTextarea;
