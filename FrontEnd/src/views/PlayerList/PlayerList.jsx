import './PlayerList.css';
import FifaPlayerCard from '../../components/PlayerCard/PlayerCard.jsx';
import PositionFilter from '../../components/PositionFilter/PositionFilter.jsx';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllPlayers, setSearchTerm, setPositionFilter, setSaleStatusFilter } from '../../store/slices/playerSlice';
import { selectFilteredPlayers, selectPlayersLoading, selectPlayersError, selectAvailablePositions } from '../../store/slices/playerSlice';

const PlayerList = () => {
    const dispatch = useDispatch();
    
    // Redux state
    const players = useSelector(selectFilteredPlayers);
    const loading = useSelector(selectPlayersLoading);
    const error = useSelector(selectPlayersError);
    const availablePositions = useSelector(selectAvailablePositions);
    
    // Local state para filtros
    const [selectedPosition, setSelectedPosition] = useState('');
    const [selectedSaleStatus, setSelectedSaleStatus] = useState('');
    const [searchTermLocal, setSearchTermLocal] = useState('');

    useEffect(() => {
        dispatch(fetchAllPlayers());
    }, [dispatch]);

    // Manejar cambios en filtros
    const handleSearchChange = (e) => {
        const term = e.target.value;
        setSearchTermLocal(term);
        dispatch(setSearchTerm(term));
    };

    const handlePositionChange = (position) => {
        setSelectedPosition(position);
        dispatch(setPositionFilter(position));
    };

    const handleSaleStatusChange = (status) => {
        setSelectedSaleStatus(status);
        dispatch(setSaleStatusFilter(status === 'for-sale'));
    };

    if (loading) return <p>Loading players...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="player-list-container">
            <h2>Available Players</h2>

            <div className="search-bar-container" style={{ marginBottom: 16 }}>
                <input
                    type="text"
                    placeholder="Search by name..."
                    value={searchTermLocal}
                    onChange={handleSearchChange}
                    className="player-search-input"
                    style={{ padding: '0.5rem 1rem', borderRadius: 8, border: '1px solid #ccc', width: 240, fontSize: 16 }}
                />
            </div>

            <div className="filters-container">
                <PositionFilter
                    positions={availablePositions}
                    selectedPosition={selectedPosition}
                    onChange={handlePositionChange}
                />

                <div className="sale-filter-container">
                    <label htmlFor="sale-filter" className="sale-filter-label">
                        Filter by State:
                    </label>
                    <select
                        id="sale-filter"
                        value={selectedSaleStatus}
                        onChange={(e) => handleSaleStatusChange(e.target.value)}
                        className="sale-filter-select"
                    >
                        <option value="">All players</option>
                        <option value="for-sale">For sale</option>
                        <option value="not-for-sale">Not for sale</option>
                    </select>
                </div>
            </div>

            <div className="player-list">
                {players.map(player => (
                    <FifaPlayerCard key={player.id} player={player} />
                ))}
            </div>
        </div>
    );
};

export default PlayerList;