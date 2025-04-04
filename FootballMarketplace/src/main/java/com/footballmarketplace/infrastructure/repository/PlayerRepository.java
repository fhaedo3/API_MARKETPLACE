package main.java.com.footballmarketplace.infrastructure.repository;

import main.java.com.footballmarketplace.domain.interfaces.IPlayerRepository;
import main.java.com.footballmarketplace.domain.model.Player;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicLong;

@Repository
public class PlayerRepository implements IPlayerRepository {

    private final List<Player> players = new ArrayList<>();
    private final AtomicLong idGenerator = new AtomicLong(1);

    @Override
    public List<Player> findAll() {
        return new ArrayList<>(players);
    }

    @Override
    public Optional<Player> findById(Long id) {
        return players.stream().filter(player -> player.getId().equals(id)).findFirst();
    }

    @Override
    public Player save(Player player) {
        if (player.getId() == null) {
            player.setId(idGenerator.getAndIncrement());
            players.add(player);
        } else {
            players.removeIf(p -> p.getId().equals(player.getId()));
            players.add(player);
        }
        return player;
    }

    @Override
    public void deleteById(Long id) {
        players.removeIf(player -> player.getId().equals(id));
    }
}