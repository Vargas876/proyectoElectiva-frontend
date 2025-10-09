// src/components/review/ReviewList.jsx
import React, { useEffect, useState } from 'react';
import { reviewApi } from '../../api/reviewApi';
import ReviewCard from './ReviewCard';

const ReviewList = ({ driverId }) => {
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, [driverId, page]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await reviewApi.getByDriver(driverId, page, 10);
      
      if (page === 1) {
        setReviews(response.data);
        setStats(response.stats);
      } else {
        setReviews(prev => [...prev, ...response.data]);
      }
      
      setHasMore(page < response.pagination.pages);
    } catch (error) {
      setError(error.message || 'Error al cargar reviews');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading && page === 1) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Summary */}
      {stats && (
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-lg p-6 text-white">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <p className="text-4xl font-bold">{stats.avg_rating?.toFixed(1) || '5.0'}</p>
              <p className="text-sm mt-1 opacity-90">Calificación Promedio</p>
              <div className="flex justify-center mt-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    className={`w-5 h-5 ${
                      star <= Math.round(stats.avg_rating || 5)
                        ? 'text-yellow-300'
                        : 'text-white opacity-30'
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </div>

            <div className="text-center">
              <p className="text-4xl font-bold">{stats.total_reviews || 0}</p>
              <p className="text-sm mt-1 opacity-90">Total de Reseñas</p>
            </div>

            <div className="text-center">
              <p className="text-4xl font-bold">
                {stats.total_reviews > 0
                  ? `${Math.round((stats.total_reviews / stats.total_reviews) * 100)}%`
                  : '100%'}
              </p>
              <p className="text-sm mt-1 opacity-90">Tasa de Satisfacción</p>
            </div>
          </div>
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <div className="text-center py-12">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No hay reseñas aún
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Este conductor aún no ha recibido calificaciones.
            </p>
          </div>
        ) : (
          <>
            {reviews.map((review) => (
              <ReviewCard key={review._id} review={review} />
            ))}

            {/* Load More Button */}
            {hasMore && (
              <div className="text-center pt-4">
                <button
                  onClick={() => setPage(prev => prev + 1)}
                  disabled={loading}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? 'Cargando...' : 'Cargar más reseñas'}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ReviewList;
