const PreprocessTextarea = ({ songText, onChange }) => {
  return (
    <>
      <label htmlFor="exampleFormControlTextarea1" className="form-label">
        Text to preprocess:
      </label>
      <textarea
        className="form-control bg-dark text-white"
        rows="18"
        id="proc"
        value={songText}
        onChange={onChange}
      />
    </>
  );
};

export default PreprocessTextarea;
