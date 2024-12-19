const InfoLinks = () => {
  const links = [
    "AROHAN",
    "Gunotsav",
    "ICT in Education",
    "PM SHRI Portal",
    "Life Skills Book",
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
      {links.map((link, index) => (
        <div
          key={index}
          className="p-4 bg-blue-100 rounded shadow hover:bg-blue-200 cursor-pointer"
        >
          {link}
        </div>
      ))}
    </div>
  );
};

export default InfoLinks;
