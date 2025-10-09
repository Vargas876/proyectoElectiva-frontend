// src/components/review/ReviewCard.jsx
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import React from 'react';

const ReviewCard = ({ review }) => {
  const getTagStyle = (tag) => {
    const positiveStyles = 'bg-green-100 text-green-800';
    const negativeStyles = 'bg-red-100 text-red-800';

    const negativeTags = ['late', 'rude', 'reckless'];
    return negativeTags.includes(tag) ? negativeStyles : positiveStyles;
  };

  const getTagLabel = (tag) => {
    const labels = {
      punctual: '⏰ Puntual',
      friendly: '😊 Amigable',
      safe_driver: '🛡️ Conductor Seguro',
      clean_vehicle: '✨ Vehículo Limpio',
      good_conversation: '💬 Buena Conversación',
      professional: '👔 Profesional',
      comfortable: '🛋️ Cómodo',
      late: '⏱️ Tarde',
      rude: '😠 Grosero',
      reckless: '⚠️ Imprudente'
    };
    return labels[tag] || tag;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          {/* Avatar */}
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
            {review.reviewer_id?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          
          {/* User Info */}
          <div>
            <h4 className="font-semibold text-gray-900">
              {review.reviewer_id?.name || 'Usuario'}
            </h4>
            <p className="text-sm text-gray-500">
              {formatDistanceToNow(new Date(review.createdAt), {
                addSuffix: true,
                locale: es
              })}
            </p>
          </div>
        </div>

        {/* Rating Stars */}
        <div className="flex items-center space-x-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <svg
              key={star}
              className={`w-5 h-5 ${
                star <= review.rating ? 'text-yellow-400' : 'text-gray-300'
              }`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
          <span className="ml-2 text-lg font-bold text-gray-900">
            {review.rating.toFixed(1)}
          </span>
        </div>
      </div>

      {/* Comment */}
      {review.comment && (
        <p className="text-gray-700 mb-4 leading-relaxed">
          {review.comment}
        </p>
      )}

      {/* Tags */}
      {review.tags && review.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {review.tags.map((tag, index) => (
            <span
              key={index}
              className={`px-3 py-1 rounded-full text-xs font-medium ${getTagStyle(tag)}`}
            >
              {getTagLabel(tag)}
            </span>
          ))}
        </div>
      )}

      {/* Trip Info */}
      {review.trip_id && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            <span className="font-medium">Viaje:</span>{' '}
            {review.trip_id.origin} → {review.trip_id.destination}
          </p>
        </div>
      )}

      {/* Response from Driver */}
      {review.response && (
        <div className="mt-4 p-3 bg-blue-50 border-l-4 border-blue-500 rounded">
          <p className="text-sm font-medium text-blue-900 mb-1">
            Respuesta del conductor
          </p>
          <p className="text-sm text-blue-800">{review.response.text}</p>
          <p className="text-xs text-blue-600 mt-1">
            {formatDistanceToNow(new Date(review.response.date), {
              addSuffix: true,
              locale: es
            })}
          </p>
        </div>
      )}
    </div>
  );
};

export default ReviewCard;
