import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from 'next/router';
import Header from './Header.jsx';
import { FaUpload, FaSpinner, FaCheckCircle, FaTimesCircle, FaInfoCircle } from 'react-icons/fa';

const IntegrationEtudiantEcole = () => {
  const router = useRouter();
  const [state, setState] = useState({
    ecoleId: '',
    formations: [],
    selectedFormation: '',
    anneeScolaire: `${new Date().getFullYear()}/${new Date().getFullYear() + 1}`,
    file: null,
    isLoading: false,
    progress: 0,
    result: null
  });

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const token = typeof window !== 'undefined' ? localStorage.getItem('ecole_token') : null;

  // Charger les formations au montage
  useEffect(() => {
    const loadData = async () => {
      const id = localStorage.getItem('ecole_id');
      if (!id) return;

      try {
        const [formationsRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/ecoles/${id}/formations`, {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);

        setState(prev => ({
          ...prev,
          ecoleId: id,
          formations: formationsRes.data
        }));
      } catch (error) {
        console.error("Erreur de chargement:", error);
      }
    };

    loadData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setState(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setState(prev => ({
      ...prev,
      file: e.target.files[0],
      result: null
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!state.file || !state.selectedFormation) {
      setState(prev => ({
        ...prev,
        result: {
          status: 'error',
          message: 'Veuillez sélectionner une formation et un fichier CSV'
        }
      }));
      return;
    }

    // Validation du format de l'année scolaire
    if (!/^\d{4}\/\d{4}$/.test(state.anneeScolaire)) {
      setState(prev => ({
        ...prev,
        result: {
          status: 'error',
          message: 'Format d\'année scolaire invalide. Utilisez AAAA/AAAA (ex: 2023/2024)'
        }
      }));
      return;
    }

    setState(prev => ({ ...prev, isLoading: true, progress: 0 }));

    const formData = new FormData();
    formData.append('file', state.file);
    formData.append('formationId', state.selectedFormation);
    formData.append('annee', state.anneeScolaire);
    formData.append('ecoleId', state.ecoleId);

    try {
      const response = await axios.post(`${API_BASE_URL}/etudiants-ecole/upload`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / (progressEvent.total || 1)
          );
          setState(prev => ({ ...prev, progress: percentCompleted }));
        }
      });

      setState(prev => ({
        ...prev,
        result: {
          status: 'success',
          message: `Import réussi : ${response.data.count} étudiants`,
          details: response.data
        },
        file: null
      }));

    } catch (error) {
      console.error('Erreur upload:', error);
      setState(prev => ({
        ...prev,
        result: {
          status: 'error',
          message: error.response?.data?.message || 'Erreur lors de l\'import',
          details: error.response?.data
        }
      }));
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-4xl mx-auto py-8 px-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-green-800 mb-6 flex items-center">
            <FaUpload className="mr-2" />
            Intégration des Étudiants
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Sélection de formation */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Formation *
              </label>
              <select
                name="selectedFormation"
                value={state.selectedFormation}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                required
              >
                <option value="">-- Sélectionnez une formation --</option>
                {state.formations.map(formation => (
                  <option key={formation.idFormation} value={formation.idFormation}>
                    {formation.nomFormation} ({formation.typeFormation})
                  </option>
                ))}
              </select>
            </div>

            {/* Année scolaire */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Année Scolaire *
              </label>
              <input
                type="text"
                name="anneeScolaire"
                value={state.anneeScolaire}
                onChange={handleInputChange}
                placeholder="2023/2024"
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                required
              />
              <p className="text-xs text-gray-500 mt-1">Format: AAAA/AAAA (ex: 2023/2024)</p>
            </div>

            {/* Upload de fichier */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fichier CSV des étudiants *
              </label>
              <div className="mt-1 flex items-center">
                <label className="cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                  <span>{state.file ? state.file.name : 'Choisir un fichier'}</span>
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleFileChange}
                    className="hidden"
                    required
                  />
                </label>
                {state.file && (
                  <button
                    type="button"
                    onClick={() => setState(prev => ({ ...prev, file: null }))}
                    className="ml-2 text-red-600 hover:text-red-800"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>

            {/* Bouton de soumission */}
            <button
              type="submit"
              disabled={state.isLoading}
              className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${state.isLoading ? 'bg-green-400' : 'bg-green-600 hover:bg-green-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500`}
            >
              {state.isLoading ? (
                <>
                  <FaSpinner className="animate-spin mr-2" />
                  Import en cours ({state.progress}%)
                </>
              ) : (
                <>
                  <FaUpload className="mr-2" />
                  Importer les étudiants
                </>
              )}
            </button>
          </form>

          {/* Résultat de l'import */}
          {state.result && (
            <div className={`mt-6 p-4 rounded-md ${state.result.status === 'success' ? 'bg-green-50' : 'bg-red-50'}`}>
              <div className="flex items-start">
                {state.result.status === 'success' ? (
                  <FaCheckCircle className="h-5 w-5 text-green-400 mr-2 mt-0.5" />
                ) : (
                  <FaTimesCircle className="h-5 w-5 text-red-400 mr-2 mt-0.5" />
                )}
                <div>
                  <p className={`font-medium ${state.result.status === 'success' ? 'text-green-800' : 'text-red-800'}`}>
                    {state.result.message}
                  </p>
                  {state.result.details?.errors && (
                    <div className="mt-2 text-sm text-red-700">
                      <p>Erreurs détectées :</p>
                      <ul className="list-disc pl-5 space-y-1">
                        {state.result.details.errors.map((error, index) => (
                          <li key={index}>{error}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Instructions CSV */}
          <div className="mt-8 bg-blue-50 p-4 rounded-md">
            <h3 className="text-sm font-medium text-blue-800 flex items-center">
              <FaInfoCircle className="mr-2" />
              Format du fichier CSV requis
            </h3>
            <div className="mt-2 text-sm text-blue-700">
              <p className="font-medium">Colonnes obligatoires :</p>
              <ul className="list-disc pl-5 space-y-1">
                <li><code>nom</code> (texte)</li>
                <li><code>prenom</code> (texte)</li>
                <li><code>email</code> (email valide)</li>
                <li><code>matricule</code> (texte unique)</li>
              </ul>
              <p className="font-medium mt-2">Colonnes optionnelles :</p>
              <ul className="list-disc pl-5 space-y-1">
                <li><code>telephone</code> (texte)</li>
                <li><code>moyenne</code> (nombre entre 0 et 20)</li>
              </ul>
              <p className="mt-2 text-xs">
                Exemple : <code>nom,prenom,email,matricule,telephone,moyenne</code>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default IntegrationEtudiantEcole;