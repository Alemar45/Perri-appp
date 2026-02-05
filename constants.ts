
import { PetProfile, HealthStat, Post, VetClinic } from './types';

export const INITIAL_PET: PetProfile = {
  name: 'Max',
  breed: 'Golden Retriever',
  age: '3 años',
  weight: '28.5 kg',
  gender: 'Macho',
  imageUrl: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=800&q=80',
  foodType: 'Balanceado Premium Adultos',
  foodDosage: '250g (2 veces al día)'
};

export const HEALTH_STATS: HealthStat[] = [
  { id: '1', title: 'Vacunas', status: 'Al día · Última: 15 Nov', icon: 'vaccines', type: 'health' },
  { id: '2', title: 'Peso', status: '28.5 kg · Ayer', icon: 'monitor_weight', type: 'health' },
  { id: '3', title: 'Peluquería', status: 'Última sesión: 12 Oct', icon: 'content_cut', type: 'hygiene' },
  { id: '4', title: 'Baño', status: 'Cada 2 semanas · Toca Viernes', icon: 'bathtub', type: 'hygiene' },
  { id: '5', title: 'Interno & Externo', status: 'Última dosis: 1 Sept', icon: 'medication', type: 'deworming' },
  { id: '6', title: 'Próxima Dosis', status: 'En 15 días · 1 Oct', icon: 'event_upcoming', type: 'deworming', color: 'text-red-500' },
];

export const MOCK_POSTS: Post[] = [
  {
    id: 'p1',
    author: 'Sarah & Cooper',
    time: 'Hace 2 horas',
    category: 'Travesuras',
    content: "¡Cooper decidió que la sala necesitaba 'nieve' mientras salí por 10 minutos! ¡Ayuda! 😂🦴",
    imageUrl: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=800&q=80',
    likes: 245,
    comments: 18,
    shares: 4,
    type: 'regular'
  },
  {
    id: 'p2',
    author: 'Juan M.',
    time: 'Recién',
    category: 'Extraviados',
    content: 'Luna se perdió cerca de la plaza. Tiene collar rojo. Es muy asustadiza. ¡Por favor compartan!',
    imageUrl: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=800&q=80',
    likes: 12,
    comments: 5,
    shares: 45,
    type: 'lost'
  }
];

export const VET_CLINICS: VetClinic[] = [
  {
    id: 'v1',
    name: 'Veterinaria Central',
    distance: '0.4 km',
    address: 'Av. Principal 1234, CABA',
    phone: '+54 11 4000-0000',
    rating: 4.9,
    status: 'Abierto ahora',
    closingTime: '20:00',
    services: ['Emergencia 24h', 'Cirugía'],
    imageUrl: '',
    lat: -34.6037,
    lng: -58.3816
  },
  {
    id: 'v2',
    name: 'Clínica San Roque',
    distance: '1.2 km',
    address: 'Calle Falsa 123, CABA',
    phone: '+54 11 4111-1111',
    rating: 4.7,
    status: 'Cierra pronto',
    closingTime: '19:00',
    services: ['Vacunación', 'Rayos X'],
    imageUrl: '',
    lat: -34.6137,
    lng: -58.3916
  }
];
