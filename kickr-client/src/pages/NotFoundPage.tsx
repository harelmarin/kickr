import type { FC } from 'react';
import { Link } from 'react-router-dom';
import './AdminPage.css'; // Reusing styles for now or I can move them to a separate CSS

export const NotFoundPage: FC = () => {
    return (
        <div className="admin-page">
            <div className="not-found">
                <h1 className="not-found-title">404</h1>
                <p className="not-found-subtitle">Page Not Found</p>
                <Link to="/" className="not-found-home">Back home</Link>
            </div>
        </div>
    );
};
