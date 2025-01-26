interface RouteCardProps {
  title: string;
  image: string;
  holes: number;
}

const RouteCard: React.FC<RouteCardProps> = ({ title, image, holes }) => {
  return (
    <div className="border rounded-lg shadow-lg overflow-hidden">
      <img src={image} alt={title} className="w-full h-48 object-cover" />
      <div className="p-4">
        <h3 className="text-xl font-bold">{title}</h3>
        <p className="text-gray-600">{holes} dołków</p>
      </div>
    </div>
  );
};

export default RouteCard;
