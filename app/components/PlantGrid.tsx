import Image from 'next/image';

interface Plant {
  id: number;
  name: string;
  src: string;
}

const plants: Plant[] = [
  { id: 1, name: 'Plant 1', src: '/plant1.svg' },
  { id: 2, name: 'Plant 2', src: '/plant2.svg' },
  { id: 3, name: 'Plant 3', src: '/plant3.svg' },
];

interface PlantGridProps {
  onSelect: (id: number) => void;
}

export default function PlantGrid({ onSelect }: PlantGridProps) {
  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {plants.map((plant) => (
          <div
            key={plant.id}
            className={`card ${plant.id === 1 ? 'bg-primary text-primary-content' : 'bg-gray-200'}`}
            onClick={() => plant.id === 1 && onSelect(plant.id)}
          >
            <div className="card-body flex flex-col items-center">
              <Image
                src={plant.src}
                alt={plant.name}
                width={100}
                height={100}
                className={plant.id !== 1 ? 'grayscale' : ''}
              />
              <h2 className="card-title">{plant.name}</h2>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
