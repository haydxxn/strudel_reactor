const Alert = ({ type, message, icon, onClose }) => {
  const handleClose = () => {
    if (onClose) {
      onClose();
    }
  };

  return (
    <div
      className={`alert alert-${type} alert-dismissible fade show`}
      role="alert"
    >
      <i className={`bi bi-${icon}`} />
      <span className="text-black ms-2">{message}</span>
      <button
        type="button"
        className="btn-close"
        data-bs-dismiss="alert"
        aria-label="Close"
        onClick={handleClose}
      />
    </div>
  );
};

export default Alert;
