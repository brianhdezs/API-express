import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyCOijQtMcWbbcqBwuE-nIlJ3x5JaqLQdXQ",
  authDomain: "truck-sense-realtime.firebaseapp.com",
  databaseURL: "https://truck-sense-realtime-default-rtdb.firebaseio.com",
  projectId: "truck-sense-realtime",
  storageBucket: "truck-sense-realtime.firebasestorage.app",
  messagingSenderId: "863093427839",
  appId: "1:863093427839:web:2a24409a6e4674f16b394a"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Obtener referencia a la base de datos
const database = getDatabase(app);
export { database };