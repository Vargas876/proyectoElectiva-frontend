import React, { useState } from 'react';
import { reviewApi } from '../../api/reviewApi';

const ReviewForm = ({ tripId, driverId, onReviewSubmitted }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const availableTags = [
    { value: 'punctual', label: '⏰ Puntual', type: 'positive' },
    { value: 'friendly', label: '😊 Amigable', type: 'positive' },
    { value: 'safe_driver', label: '🛡️ Conductor Seguro', type: 'positive' },
    { value: 'clean_vehicle', label: '✨ Vehículo Limpio', type: 'positive' },
    { value: 'good_conversation', label: '💬 Buena Conversación', type: 'positive' },
    { value: 'professional', label: '👔 Profesional', type: 'positive' },
    { value: 'comfortable', label: '🛋️ Cómodo', type: 'positive' },
    { value: 'late', label: '⏱️ Tarde', type: 'negative' },
    { value: 'rude', label: '😠 Grosero', type: 'negative' },
    { value: 'reckless', label: '⚠️ Imprudente', type: 'negative' }
  ];

  const handleTagToggle = (tag) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await reviewApi.create({
        trip_id: tripId,
        reviewed_driver_id: driverId,
        rating,
        comment: comment.trim(),
        tags: selectedTags
      });

      alert('✅ Review enviado exitosamente');
      if (onReviewSubmitted) {
        onReviewSubmitted();
      }
    } catch (error) {
      setError(error.message || 'Error al enviar el review');
      console.error('Error al enviar review:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-2xl font-bold text-gray-900 mb-6">
        Califica tu experiencia
      </h3>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Rating Stars */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Calificación General
          </label>
          <div className="flex items-center space-x-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className="focus:outline-none transform transition-transform hover:scale-110"
              >
                <svg
                  className={`w-10 h-10 ${
                    star <= rating ? 'text-yellow-400' : 'text-gray-300'
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </button>
            ))}
            <span className="ml-3 text-2xl font-bold text-gray-900">
              {rating}.0
            </span>
          </div>
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Selecciona características (opcional)
          </label>
          <div className="flex flex-wrap gap-2">
            {availableTags.map((tag) => (
              <button
                key={tag.value}
                type="button"
                onClick={() => handleTagToggle(tag.value)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedTags.includes(tag.value)
                    ? tag.type === 'positive'
                      ? 'bg-green-100 text-green-800 border-2 border-green-500'
                      : 'bg-red-100 text-red-800 border-2 border-red-500'
                    : 'bg-gray-100 text-gray-700 border-2 border-transparent hover:bg-gray-200'
                }`}
              >
                {tag.label}
              </button>
            ))}
          </div>
        </div>

        {/* Comment */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Comentario (opcional)
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Cuéntanos sobre tu experiencia..."
            rows={4}
            maxLength={500}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-sm text-gray-500 mt-1">
            {comment.length}/500 caracteres
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Enviando...
            </span>
          ) : (
            'Enviar Calificación'
          )}
        </button>
      </form>
    </div>
  );
};

export default ReviewForm;
