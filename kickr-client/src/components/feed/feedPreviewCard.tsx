import React from 'react';
import { usePreviewFeed } from '@/hooks/usePreviewFeed';
import { UserMatch } from '@/types/UserMatch';

interface FeedPreviewCardProps {
  userId: string;
  page?: number;
  limit?: number;
}

export const FeedPreviewCard: React.FC<FeedPreviewCardProps> = ({ userId, page = 0, limit = 9 }) => {
  const { data: matches, status, error } = usePreviewFeed(userId, page, limit);

  if (status === 'pending') return <div>Chargement...</div>;
  if (status === 'error') return <div>Erreur : {error?.message}</div>;

  return (
    <div className="feed-preview">
      {matches && matches.length > 0 ? (
        matches.map((m: UserMatch) => (
          <div key={m.id} className="match-card">
            <div className="teams">
              <img src={m.match.homeLogo} alt={m.match.homeTeam} width={50} />
              <span>{m.match.homeTeam}</span>
              <span>vs</span>
              <span>{m.match.awayTeam}</span>
              <img src={m.match.awayLogo} alt={m.match.awayTeam} width={50} />
            </div>
            <div className="score">
              {m.match.homeScore} - {m.match.awayScore}
            </div>
            <div className="note-comment">
              <p>Note : {m.note}</p>
              <p>Commentaire : {m.comment}</p>
            </div>
            <div className="date">
              Vu le : {new Date(m.watchedAt).toLocaleString()}
            </div>
          </div>
        ))
      ) : (
        <div>Aucun match à afficher</div>
      )}
    </div>
  );
};
