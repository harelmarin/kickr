import React from 'react';
import { usePreviewFeed } from '../../hooks/usepreviewfeed';

interface FeedPreviewCardProps {
  userId: string;
  page?: number;
  limit?: number;
}

export const FeedPreviewCard: React.FC<FeedPreviewCardProps> = ({ userId, page = 0, limit = 9 }) => {
  const { data: matches, status, error } = usePreviewFeed(userId, page, limit);

  if (status === 'pending') return <div>Loading...</div>;
  if (status === 'error') return <div>Error: {error?.message}</div>;

  return (
    <div className="feed-preview">
      {matches && matches.length > 0 ? (
        matches.map((m: any) => (
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
              <p>Rating: {m.note}</p>
              <p>Comment: {m.comment}</p>
            </div>
            <div className="date">
              Watched on: {new Date(m.watchedAt).toLocaleString('en-US')}
            </div>
          </div>
        ))
      ) : (
        <div>No matches to display</div>
      )}
    </div>
  );
};
