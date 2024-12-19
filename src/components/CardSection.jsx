import image4 from "../assets/image4.jpg";
import image5 from "../assets/image5.jpg";
import image6 from "../assets/image6.jpg";

const CardSection = () => {
  const cards = [
    { title: "Samagra Shiksha Components", img: image4 },
    { title: "Teacher Training", img: image5 },
    { title: "Planning and Monitoring", img: image6 },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6">
      {cards.map((card, index) => (
        <div
          key={index}
          className="bg-white p-4 shadow rounded hover:shadow-lg cursor-pointer"
        >
          <img src={card.img} alt={card.title} className="rounded" />
          <h2 className="text-center mt-2 font-bold">{card.title}</h2>
        </div>
      ))}
    </div>
  );
};

export default CardSection;
