import './PlayerDetail.css';

const PlayerDetail = () => {
  return (
    <div className="player-detail">
      <div className="player-header">
        <img src="/images/sergioramos.png" alt="Sergio Ramos" className="player-image" />
        <h1 className="player-name">SERGIO RAMOS</h1>
      </div>

      <div className="player-bio">
        <p>
          Sergio Ramos es un defensor español reconocido por su liderazgo, agresividad
          y habilidad en el juego aéreo. Ha jugado en clubes como el Real Madrid y PSG,
          y es uno de los defensores más goleadores de la historia.
        </p>
      </div>

      <div className="player-info">
        <p><strong>Position:</strong> Defender</p>
        <p><strong>Age:</strong> 38</p>
        <p><strong>Nationality:</strong> Spain</p>
        <p><strong>Current Club:</strong> Free Agent</p>
      </div>

      <div className="player-actions">
        <button className="buy-button">Buy</button>
        <button className="borrow-button">Borrow</button>
      </div>
    </div>
  );
};

export default PlayerDetail;
