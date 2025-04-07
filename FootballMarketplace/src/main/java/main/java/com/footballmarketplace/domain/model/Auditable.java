// filepath: c:\Git\API_MARKETPLACE\FootballMarketplace\src\main\java\main\java\com\footballmarketplace\domain\model\Auditable.java
package main.java.com.footballmarketplace.domain.model;

import java.time.LocalDateTime;

public abstract class Auditable {

    private Long id;
    private LocalDateTime creationDate;
    private LocalDateTime modifiedDate;

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDateTime getCreationDate() {
        return creationDate;
    }

    public void setCreationDate(LocalDateTime creationDate) {
        this.creationDate = creationDate;
    }

    public LocalDateTime getModifiedDate() {
        return modifiedDate;
    }

    public void setModifiedDate(LocalDateTime modifiedDate) {
        this.modifiedDate = modifiedDate;
    }
}