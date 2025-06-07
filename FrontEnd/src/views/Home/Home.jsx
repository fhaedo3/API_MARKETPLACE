import { useState } from 'react';

const Home = () => {
    return (
        <div className="home">
            <div className="container">
                {/* HERO SECTION */}
                <section className="hero">
                    <div className="hero-content">
                        <h1>ScoutMarket</h1>
                        <h2>Best Place To Buy Or Sell Players!!!</h2>
                        <p>See All The Data Of The Players</p>

                        <div className="hero-search">
                            <input
                                type="text"
                                placeholder="Search To Find"
                                className="hero-search-input"
                            />
                            <button className="hero-search-btn">🔍</button>
                        </div>
                    </div>

                    <div className="hero-images">
                        <div className="hero-image-placeholder">⚽ Player Images</div>
                    </div>
                </section>

                {/* SERVICES SECTION */}
                <section className="services">
                    <h3>Most Popular Services 🚀</h3>
                    <div className="services-grid">
                        <div className="service-card">BUY</div>
                        <div className="service-card">SELL</div>
                        <div className="service-card">BORROWING</div>
                        <div className="service-card">TRADE</div>
                    </div>
                </section>

                {/* HOW TO USE */}
                <section className="how-to-use">
                    <h3>How To Use:</h3>
                    <div className="steps">
                        <div className="step">🔍 Search For A Player</div>
                        <div className="step">💰 Make An Offer</div>
                        <div className="step">📝 Sing A Contract</div>
                    </div>
                </section>

                {/* BEST PLAYERS */}
                <section className="best-players">
                    <h3>Best Players</h3>
                    <div className="players-grid">
                        <div className="player-placeholder">Lionel Messi</div>
                        <div className="player-placeholder">Vinicius Jr</div>
                        <div className="player-placeholder">Sergio Ramos</div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Home;
