-- Migration pour ajouter les détails des matchs (compositions, stats, événements)
CREATE TABLE match_details (
    id UUID PRIMARY KEY,
    match_id UUID NOT NULL,
    lineups JSONB,
    stats JSONB,
    events JSONB,
    last_updated TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_match FOREIGN KEY (match_id) REFERENCES matches (id) ON DELETE CASCADE
);

CREATE INDEX idx_match_details_match_id ON match_details(match_id);
