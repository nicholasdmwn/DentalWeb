const Qrcode = () => {
  return (
    <div className="qrcode">
      <h1>Qrcode</h1>
      <img src="<%=src%>" alt="QR Code image" />
      <p>Save your QR Code!</p>
    </div>
  );
};

export default Qrcode;
