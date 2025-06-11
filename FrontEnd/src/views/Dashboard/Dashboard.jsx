import FifaPlayerCard from '../../components/PlayerCard/PlayerCard';
import './Dashboard.css';

const Dashboard = () => {
  const playersDashboard = [
    {
      id: 1,
      name: 'Messi',
      price: 105000,
      image: '/images/m.png',
      position: 'RW',
      rating: 91,
      characteristics: ['PAC 85', 'SHO 92', 'PAS 91'],
      isForSale: true,
    },
    {
      id: 2,
      name: 'Messi',
      price: 105000,
      image: '/images/m.png',
      position: 'RW',
      rating: 91,
      characteristics: ['PAC 85', 'SHO 92', 'PAS 91'],
      isForSale: true,
    },
  ];

  return (
    <div className="containerDashboard">
      <h1 className="dashboard-title">My Team</h1>
      <div className="dashboard-items">
        {playersDashboard.map((player) => (
          <FifaPlayerCard
            key={player.id}
            name={player.name}
            position={player.position}
            rating={player.rating}
            price={player.price}
            image={player.image}
            characteristics={player.characteristics}
            isForSale={player.isForSale}
            compact={true}
          />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;