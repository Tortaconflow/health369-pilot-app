import { Expert } from "@/types/domain";

export const mockExperts: Expert[] = [
  {
    id: "expert1",
    name: "Dra. Emilia Campos",
    specialty: "Nutrición Clínica & Recomposición Corporal",
    avatarUrl: "https://images.unsplash.com/photo-1594824813515-0d057a412b10?w=400&auto=format&fit=crop&q=80",
    bio: "Dietista-Nutricionista Registrada (RDN) con más de 10 años optimizando el rendimiento metabólico, ganancia de masa magra y pérdida de grasa sostenible para atletas y entusiastas del fitness.",
    rating: 4.9,
    experienceYears: 10,
    certifications: ["Dietista-Nutricionista Registrada (RDN)", "Especialista Certificada en Nutrición (CNS)", "Nutrición Deportiva Avanzada"],
  },
  {
    id: "expert2",
    name: "Lic. Marcos Chen",
    specialty: "Nutricionista Deportivo & Alto Rendimiento",
    avatarUrl: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&auto=format&fit=crop&q=80",
    bio: "Especialista en modulación de macros, nutrición perientreno y suplementación basada en evidencia para maximizar la fuerza y recuperación muscular.",
    rating: 4.9,
    experienceYears: 12,
    certifications: ["Nutricionista Deportivo Certificado (CISSN)", "CSCS - Fuerza & Acondicionamiento"],
  },
  {
    id: "expert3",
    name: "Dra. Valeria Santana",
    specialty: "Salud Hormonal & Digestiva (Microbiota)",
    avatarUrl: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&auto=format&fit=crop&q=80",
    bio: "Médica integrativa enfocada en salud digestiva, balance hormonal y protocolos antiinflamatorios que potencian la vitalidad y energía diaria.",
    rating: 4.8,
    experienceYears: 9,
    certifications: ["Medicina Integrativa", "Master en Microbiota Humana", "Salud Tiroidea y Metabólica"],
  },
  {
    id: "expert4",
    name: "Coach Juan Dávila",
    specialty: "Entrenador de Fuerza & Biomecánica",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
    bio: "Especialista en hipertrofia, corrección postural y prevención de lesiones. Crea sinergia directa con tu nutricionista para acelerar resultados.",
    rating: 4.7,
    experienceYears: 8,
    certifications: ["Entrenador Personal Certificado ACE", "Especialista en Fuerza y Acondicionamiento (CSCS)"],
  },
];
