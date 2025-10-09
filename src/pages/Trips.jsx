import React, { useState } from 'react';
import Footer from '../components/common/Footer';
import Modal from '../components/common/Modal';
import Navbar from '../components/common/Navbar';
import TripForm from '../components/trip/TripForm';
import TripList from '../components/trip/TripList';

const Trips = () => {
  const [showModal, setShowModal] = useState(false);
  const [refreshList, setRefreshList] = useState(0);

  const handleSuccess = () => {
    setShowModal(false);
    setRefreshList(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Viajes</h1>
            <p className="text-gray-600 mt-1">
              Explora y gestiona todos los viajes disponibles
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            + Crear Viaje
          </button>
        </div>

        {/* Trip List */}
        <TripList key={refreshList} />
      </div>

      {/* Modal para crear viaje */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Crear Nuevo Viaje"
        size="lg"
      >
        <TripForm
          onSuccess={handleSuccess}
          onCancel={() => setShowModal(false)}
        />
      </Modal>

      <Footer />
    </div>
  );
};

export default Trips;
