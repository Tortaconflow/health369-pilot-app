import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import OnboardingPage from './page';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast'; // Corrected import path

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock useToast
jest.mock('@/hooks/use-toast', () => ({ // Corrected mock path
  useToast: jest.fn(),
}));

describe('OnboardingPage', () => {
  const mockPush = jest.fn();
  const mockToast = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
    (useToast as jest.Mock).mockReturnValue({
      toast: mockToast,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders without crashing', () => {
    render(<OnboardingPage />);
    expect(screen.getByText('¡Bienvenido/a a Health369!')).toBeInTheDocument();
  });

  test('navigates to the next step when "Siguiente" is clicked with valid data', async () => {
    render(<OnboardingPage />);

    // Step 1: Edad
    const ageInput = screen.getByLabelText('¿Cuál es tu edad? (años)');

    fireEvent.change(ageInput, { target: { value: '30' } });

    fireEvent.click(screen.getByText('Siguiente'));

    await waitFor(() => {
      expect(screen.getByText('Información de Salud')).toBeInTheDocument();
    });
  });

  test('shows validation errors when "Siguiente" is clicked with invalid data', async () => {
    render(<OnboardingPage />);

    // Step 1: Edad - Leave field empty
    fireEvent.click(screen.getByText('Siguiente'));

    await waitFor(() => {
      expect(screen.getByText('La edad es requerida.')).toBeInTheDocument();
    });
  });

  test('navigates to the previous step when "Atrás" is clicked', async () => {
    render(<OnboardingPage />);

    // Advance to step 2
    const ageInput = screen.getByLabelText('¿Cuál es tu edad? (años)');

    fireEvent.change(ageInput, { target: { value: '30' } });

    fireEvent.click(screen.getByText('Siguiente'));

    await waitFor(() => expect(screen.getByText('¿Cuál es tu peso actual?')).toBeInTheDocument());
    
    // Go back to step 1
    fireEvent.click(screen.getByText('Atrás'));

    await waitFor(() => {
      expect(screen.getByText('Información Personal')).toBeInTheDocument();
    });
  });

  test('submits the form on the last step with valid data and redirects', async () => {
    render(<OnboardingPage />);

    // Step 0: Edad
    fireEvent.change(screen.getByLabelText('¿Cuál es tu edad? (años)'), { target: { value: '30' } });
    fireEvent.click(screen.getByText('Siguiente'));

    // Step 1: Peso
    await waitFor(() => {
      fireEvent.change(screen.getByLabelText('¿Cuál es tu peso actual?'), { target: { value: '75' } });
      fireEvent.click(screen.getByLabelText('kg')); // Select kg unit
      fireEvent.click(screen.getByText('Siguiente'));
    });

    // Step 2: Estatura
    await waitFor(() => {
      fireEvent.change(screen.getByLabelText('¿Cuál es tu estatura?'), { target: { value: '180' } });
      fireEvent.click(screen.getByLabelText('cm')); // Select cm unit
      fireEvent.click(screen.getByText('Siguiente'));
    });

    // Step 3: Género
    await waitFor(() => {
      fireEvent.click(screen.getByLabelText('Hombre')); // Select Hombre
      fireEvent.click(screen.getByText('Siguiente'));
    });

    // Step 4: Nivel de Actividad
    await waitFor(() => {
      fireEvent.mouseDown(screen.getByPlaceholderText('Selecciona tu nivel de actividad')); // Open select
      fireEvent.click(screen.getByText('Moderadamente activo (ejercicio ligero 1-3 días/semana)')); // Select activity level
      fireEvent.click(screen.getByText('Siguiente'));
    });

    // Step 5: Meta de Fitness
    await waitFor(() => {
      fireEvent.mouseDown(screen.getByPlaceholderText('Selecciona tu objetivo principal')); // Open select
      fireEvent.click(screen.getByText('Perder peso')); // Select fitness goal
      fireEvent.click(screen.getByText('Aceptar y Finalizar'));
    });

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith(expect.objectContaining({
        title: '¡Perfil Completado!',
        description: 'Tu información ha sido guardada. ¡Bienvenido/a a Health369!',
      }));
      expect(mockPush).toHaveBeenCalledWith('/dashboard');
    });
  });

  test('updates the progress bar correctly with each step', async () => {
    render(<OnboardingPage />);

    const getProgressValue = () => screen.getByRole('progressbar').getAttribute('aria-valuenow');

    // Initial state (Step 1 of 6)
    expect(screen.getByText('Paso 1 de 6')).toBeInTheDocument();
    expect(getProgressValue()).toBe('16.67'); // (1/6) * 100 approx

    // Advance to step 2
    fireEvent.change(screen.getByLabelText('¿Cuál es tu edad? (años)'), { target: { value: '30' } });
    fireEvent.click(screen.getByText('Siguiente'));

    await waitFor(() => {
      expect(screen.getByText('Paso 2 de 6')).toBeInTheDocument();
      expect(getProgressValue()).toBe('33.33'); // (2/6) * 100 approx
    });

    // Advance to step 3
    fireEvent.change(screen.getByLabelText('¿Cuál es tu peso actual?'), { target: { value: '75' } });
    fireEvent.click(screen.getByLabelText('kg'));
    fireEvent.click(screen.getByText('Siguiente'));

    await waitFor(() => {
      expect(screen.getByText('Paso 3 de 6')).toBeInTheDocument();
      expect(getProgressValue()).toBe('50'); // (3/6) * 100
    });

    // Advance to step 4
    fireEvent.change(screen.getByLabelText('¿Cuál es tu estatura?'), { target: { value: '180' } });
    fireEvent.click(screen.getByLabelText('cm'));
    fireEvent.click(screen.getByText('Siguiente'));

    await waitFor(() => {
      expect(screen.getByText('Paso 4 de 6')).toBeInTheDocument();
      expect(getProgressValue()).toBe('66.67'); // (4/6) * 100 approx
    });

    // Advance to step 5
    fireEvent.click(screen.getByLabelText('Hombre'));
    fireEvent.click(screen.getByText('Siguiente'));

    await waitFor(() => {
      expect(screen.getByText('Paso 5 de 6')).toBeInTheDocument();
      expect(getProgressValue()).toBe('83.33'); // (5/6) * 100 approx
    });

    // Advance to step 6
    fireEvent.mouseDown(screen.getByPlaceholderText('Selecciona tu nivel de actividad'));
    fireEvent.click(screen.getByText('Moderadamente activo (ejercicio ligero 1-3 días/semana)'));
    fireEvent.click(screen.getByText('Siguiente'));

    await waitFor(() => {
      expect(screen.getByText('Paso 6 de 6')).toBeInTheDocument();
      expect(getProgressValue()).toBe('100'); // (6/6) * 100
    });
  });

  test('displays correct fields for each step', async () => {
    render(<OnboardingPage />);

    // Step 0: Edad
    expect(screen.getByLabelText('¿Cuál es tu edad? (años)')).toBeInTheDocument();
    expect(screen.queryByLabelText('¿Cuál es tu peso actual?')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('¿Cuál es tu estatura?')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('¿Cuál es tu género?')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('¿Cuál es tu nivel de actividad física habitual?')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('¿Cuál es tu meta principal de fitness?')).not.toBeInTheDocument();

    // Advance to Step 1
    fireEvent.change(screen.getByLabelText('¿Cuál es tu edad? (años)'), { target: { value: '30' } });
    fireEvent.click(screen.getByText('Siguiente'));

    // Step 1: Peso
    await waitFor(() => {
      expect(screen.queryByLabelText('¿Cuál es tu edad? (años)')).not.toBeInTheDocument();
      expect(screen.getByLabelText('¿Cuál es tu peso actual?')).toBeInTheDocument();
      expect(screen.getByLabelText('kg')).toBeInTheDocument();
      expect(screen.getByLabelText('lb')).toBeInTheDocument();
      expect(screen.queryByLabelText('¿Cuál es tu estatura?')).not.toBeInTheDocument();
    });

    // Advance to Step 2
    fireEvent.change(screen.getByLabelText('¿Cuál es tu peso actual?'), { target: { value: '75' } });
    fireEvent.click(screen.getByLabelText('kg'));
    fireEvent.click(screen.getByText('Siguiente'));

    // Step 2: Estatura
    await waitFor(() => {
      expect(screen.queryByLabelText('¿Cuál es tu peso actual?')).not.toBeInTheDocument();
      expect(screen.getByLabelText('¿Cuál es tu estatura?')).toBeInTheDocument();
      expect(screen.getByLabelText('cm')).toBeInTheDocument();
      expect(screen.getByLabelText('ft')).toBeInTheDocument();
      expect(screen.queryByLabelText('¿Cuál es tu género?')).not.toBeInTheDocument();
    });

    // Advance to Step 3
    fireEvent.change(screen.getByLabelText('¿Cuál es tu estatura?'), { target: { value: '180' } });
    fireEvent.click(screen.getByLabelText('cm'));
    fireEvent.click(screen.getByText('Siguiente'));

    // Step 3: Género
    await waitFor(() => {
      expect(screen.queryByLabelText('¿Cuál es tu estatura?')).not.toBeInTheDocument();
      expect(screen.getByLabelText('¿Cuál es tu género?')).toBeInTheDocument();
      expect(screen.getByLabelText('Hombre')).toBeInTheDocument();
      expect(screen.getByLabelText('Mujer')).toBeInTheDocument();
      expect(screen.getByLabelText('Prefiero no decirlo')).toBeInTheDocument();
      expect(screen.queryByLabelText('¿Cuál es tu nivel de actividad física habitual?')).not.toBeInTheDocument();
    });

    // Advance to Step 4
    fireEvent.click(screen.getByLabelText('Hombre'));
    fireEvent.click(screen.getByText('Siguiente'));

    // Step 4: Nivel de Actividad
    await waitFor(() => {
      expect(screen.queryByLabelText('¿Cuál es tu género?')).not.toBeInTheDocument();
      expect(screen.getByLabelText('¿Cuál es tu nivel de actividad física habitual?')).toBeInTheDocument();
      expect(screen.queryByLabelText('¿Cuál es tu meta principal de fitness?')).not.toBeInTheDocument();
    });

    // Advance to Step 5
    fireEvent.mouseDown(screen.getByPlaceholderText('Selecciona tu nivel de actividad'));
    fireEvent.click(screen.getByText('Moderadamente activo (ejercicio ligero 1-3 días/semana)'));
    fireEvent.click(screen.getByText('Siguiente'));

    // Step 5: Meta de Fitness
    await waitFor(() => {
      expect(screen.queryByLabelText('¿Cuál es tu nivel de actividad física habitual?')).not.toBeInTheDocument();
      expect(screen.getByLabelText('¿Cuál es tu meta principal de fitness?')).toBeInTheDocument();
    });
  });

  test('initial state and default values are correct', () => {
    render(<OnboardingPage />);

    // Step 0: Edad
    expect(screen.getByLabelText('¿Cuál es tu edad? (años)')).toHaveValue(null);
    expect(screen.queryByLabelText('¿Cuál es tu peso actual?')).not.toBeInTheDocument();
  });

  test('validates age field', async () => {
    render(<OnboardingPage />);

    const ageInput = screen.getByLabelText('¿Cuál es tu edad? (años)');
    const siguienteButton = screen.getByText('Siguiente');

    // Empty age
    fireEvent.change(ageInput, { target: { value: '' } });
    fireEvent.click(siguienteButton);
    await waitFor(() => {
      expect(screen.getByText('La edad debe ser un número.')).toBeInTheDocument();
    });

    // Age below min
    fireEvent.change(ageInput, { target: { value: '10' } });
    fireEvent.click(siguienteButton);
    await waitFor(() => {
      expect(screen.getByText('Debes tener al menos 12 años.')).toBeInTheDocument();
    });

    // Age above max
    fireEvent.change(ageInput, { target: { value: '150' } });
    fireEvent.click(siguienteButton);
    await waitFor(() => {
      expect(screen.getByText('La edad parece incorrecta.')).toBeInTheDocument();
    });

    // Valid age
    fireEvent.change(ageInput, { target: { value: '25' } });
    fireEvent.click(siguienteButton);
    await waitFor(() => {
      expect(screen.queryByText('La edad debe ser un número.')).not.toBeInTheDocument();
      expect(screen.queryByText('Debes tener al menos 12 años.')).not.toBeInTheDocument();
      expect(screen.queryByText('La edad parece incorrecta.')).not.toBeInTheDocument();
      expect(screen.getByText('¿Cuál es tu peso actual?')).toBeInTheDocument();
    });
  });

  test('validates weight and weight unit fields', async () => {
    render(<OnboardingPage />);

    // Advance to Step 1 (Weight)
    fireEvent.change(screen.getByLabelText('¿Cuál es tu edad? (años)'), { target: { value: '30' } });
    fireEvent.click(screen.getByText('Siguiente'));

    await waitFor(() => {
      const weightInput = screen.getByLabelText('¿Cuál es tu peso actual?');
      const siguienteButton = screen.getByText('Siguiente');

      // Empty weight
      fireEvent.change(weightInput, { target: { value: '' } });
      fireEvent.click(siguienteButton);
      expect(screen.getByText('El peso debe ser un número.')).toBeInTheDocument();
      expect(screen.getByText('Selecciona la unidad de peso.')).toBeInTheDocument();

      // Weight below min
      fireEvent.change(weightInput, { target: { value: '10' } });
      fireEvent.click(screen.getByLabelText('kg'));
      fireEvent.click(siguienteButton);
      expect(screen.getByText('El peso mínimo es 20.')).toBeInTheDocument();

      // Weight above max
      fireEvent.change(weightInput, { target: { value: '350' } });
      fireEvent.click(screen.getByLabelText('kg'));
      fireEvent.click(siguienteButton);
      expect(screen.getByText('El peso máximo es 300.')).toBeInTheDocument();

      // Valid weight and unit
      fireEvent.change(weightInput, { target: { value: '75' } });
      fireEvent.click(screen.getByLabelText('lb'));
      fireEvent.click(siguienteButton);
      waitFor(() => {
        expect(screen.queryByText('El peso debe ser un número.')).not.toBeInTheDocument();
        expect(screen.queryByText('Selecciona la unidad de peso.')).not.toBeInTheDocument();
        expect(screen.queryByText('El peso mínimo es 20.')).not.toBeInTheDocument();
        expect(screen.queryByText('El peso máximo es 300.')).not.toBeInTheDocument();
        expect(screen.getByText('¿Cuál es tu estatura?')).toBeInTheDocument();
      });
    });
  });

  test('validates height and height unit fields', async () => {
    render(<OnboardingPage />);

    // Advance to Step 2 (Height)
    fireEvent.change(screen.getByLabelText('¿Cuál es tu edad? (años)'), { target: { value: '30' } });
    fireEvent.click(screen.getByText('Siguiente'));
    await waitFor(() => screen.getByText('¿Cuál es tu peso actual?'));
    fireEvent.change(screen.getByLabelText('¿Cuál es tu peso actual?'), { target: { value: '75' } });
    fireEvent.click(screen.getByLabelText('kg'));
    fireEvent.click(screen.getByText('Siguiente'));

    await waitFor(() => {
      const heightInput = screen.getByLabelText('¿Cuál es tu estatura?');
      const siguienteButton = screen.getByText('Siguiente');

      // Empty height
      fireEvent.change(heightInput, { target: { value: '' } });
      fireEvent.click(siguienteButton);
      expect(screen.getByText('La estatura debe ser un número.')).toBeInTheDocument();
      expect(screen.getByText('Selecciona la unidad de estatura.')).toBeInTheDocument();

      // Height below min
      fireEvent.change(heightInput, { target: { value: '40' } });
      fireEvent.click(screen.getByLabelText('cm'));
      fireEvent.click(siguienteButton);
      expect(screen.getByText('La estatura mínima es 50 cm / 1.64 ft.')).toBeInTheDocument();

      // Height above max
      fireEvent.change(heightInput, { target: { value: '300' } });
      fireEvent.click(screen.getByLabelText('cm'));
      fireEvent.click(siguienteButton);
      expect(screen.getByText('La estatura máxima es 250 cm / 8.2 ft.')).toBeInTheDocument();

      // Valid height and unit
      fireEvent.change(heightInput, { target: { value: '180' } });
      fireEvent.click(screen.getByLabelText('ft'));
      fireEvent.click(siguienteButton);
      waitFor(() => {
        expect(screen.queryByText('La estatura debe ser un número.')).not.toBeInTheDocument();
        expect(screen.queryByText('Selecciona la unidad de estatura.')).not.toBeInTheDocument();
        expect(screen.queryByText('La estatura mínima es 50 cm / 1.64 ft.')).not.toBeInTheDocument();
        expect(screen.queryByText('La estatura máxima es 250 cm / 8.2 ft.')).not.toBeInTheDocument();
        expect(screen.getByLabelText('¿Cuál es tu género?')).toBeInTheDocument();
      });
    });
  });

  test('validates gender field', async () => {
    render(<OnboardingPage />);

    // Advance to Step 3 (Gender)
    fireEvent.change(screen.getByLabelText('¿Cuál es tu edad? (años)'), { target: { value: '30' } });
    fireEvent.click(screen.getByText('Siguiente'));
    await waitFor(() => screen.getByText('¿Cuál es tu peso actual?'));
    fireEvent.change(screen.getByLabelText('¿Cuál es tu peso actual?'), { target: { value: '75' } });
    fireEvent.click(screen.getByLabelText('kg'));
    fireEvent.click(screen.getByText('Siguiente'));
    await waitFor(() => screen.getByText('¿Cuál es tu estatura?'));
    fireEvent.change(screen.getByLabelText('¿Cuál es tu estatura?'), { target: { value: '180' } });
    fireEvent.click(screen.getByLabelText('cm'));
    fireEvent.click(screen.getByText('Siguiente'));

    await waitFor(() => {
      const siguienteButton = screen.getByText('Siguiente');

      // No gender selected
      fireEvent.click(siguienteButton);
      expect(screen.getByText('Selecciona tu género.')).toBeInTheDocument();

      // Gender selected
      fireEvent.click(screen.getByLabelText('Mujer'));
      fireEvent.click(siguienteButton);
      waitFor(() => {
        expect(screen.queryByText('Selecciona tu género.')).not.toBeInTheDocument();
        expect(screen.getByLabelText('¿Cuál es tu nivel de actividad física habitual?')).toBeInTheDocument();
      });
    });
  });

  test('validates activity level field', async () => {
    render(<OnboardingPage />);

    // Advance to Step 4 (Activity Level)
    fireEvent.change(screen.getByLabelText('¿Cuál es tu edad? (años)'), { target: { value: '30' } });
    fireEvent.click(screen.getByText('Siguiente'));
    await waitFor(() => screen.getByText('¿Cuál es tu peso actual?'));
    fireEvent.change(screen.getByLabelText('¿Cuál es tu peso actual?'), { target: { value: '75' } });
    fireEvent.click(screen.getByLabelText('kg'));
    fireEvent.click(screen.getByText('Siguiente'));
    await waitFor(() => screen.getByText('¿Cuál es tu estatura?'));
    fireEvent.change(screen.getByLabelText('¿Cuál es tu estatura?'), { target: { value: '180' } });
    fireEvent.click(screen.getByLabelText('cm'));
    fireEvent.click(screen.getByText('Siguiente'));
    await waitFor(() => screen.getByLabelText('¿Cuál es tu género?'));
    fireEvent.click(screen.getByLabelText('Hombre'));
    fireEvent.click(screen.getByText('Siguiente'));

    await waitFor(() => {
      const siguienteButton = screen.getByText('Siguiente');

      // No activity level selected
      fireEvent.click(siguienteButton);
      expect(screen.getByText('Selecciona tu nivel de actividad.')).toBeInTheDocument();

      // Activity level selected
      fireEvent.mouseDown(screen.getByPlaceholderText('Selecciona tu nivel de actividad'));
      fireEvent.click(screen.getByText('Activo (ejercicio moderado 3-5 días/semana)'));
      fireEvent.click(siguienteButton);
      waitFor(() => {
        expect(screen.queryByText('Selecciona tu nivel de actividad.')).not.toBeInTheDocument();
        expect(screen.getByLabelText('¿Cuál es tu meta principal de fitness?')).toBeInTheDocument();
      });
    });
  });

  test('validates fitness goal field', async () => {
    render(<OnboardingPage />);

    // Advance to Step 5 (Fitness Goal)
    fireEvent.change(screen.getByLabelText('¿Cuál es tu edad? (años)'), { target: { value: '30' } });
    fireEvent.click(screen.getByText('Siguiente'));
    await waitFor(() => screen.getByText('¿Cuál es tu peso actual?'));
    fireEvent.change(screen.getByLabelText('¿Cuál es tu peso actual?'), { target: { value: '75' } });
    fireEvent.click(screen.getByLabelText('kg'));
    fireEvent.click(screen.getByText('Siguiente'));
    await waitFor(() => screen.getByText('¿Cuál es tu estatura?'));
    fireEvent.change(screen.getByLabelText('¿Cuál es tu estatura?'), { target: { value: '180' } });
    fireEvent.click(screen.getByLabelText('cm'));
    fireEvent.click(screen.getByText('Siguiente'));
    await waitFor(() => screen.getByLabelText('¿Cuál es tu género?'));
    fireEvent.click(screen.getByLabelText('Hombre'));
    fireEvent.click(screen.getByText('Siguiente'));
    await waitFor(() => screen.getByLabelText('¿Cuál es tu nivel de actividad física habitual?'));
    fireEvent.mouseDown(screen.getByPlaceholderText('Selecciona tu nivel de actividad'));
    fireEvent.click(screen.getByText('Moderadamente activo (ejercicio ligero 1-3 días/semana)'));
    fireEvent.click(screen.getByText('Siguiente'));

    await waitFor(() => {
      const submitButton = screen.getByText('Aceptar y Finalizar');

      // No fitness goal selected
      fireEvent.click(submitButton);
      expect(screen.getByText('Selecciona tu meta de fitness.')).toBeInTheDocument();

      // Fitness goal selected
      fireEvent.mouseDown(screen.getByPlaceholderText('Selecciona tu objetivo principal'));
      fireEvent.click(screen.getByText('Aumentar masa muscular'));
      fireEvent.click(submitButton);
      waitFor(() => {
        expect(screen.queryByText('Selecciona tu meta de fitness.')).not.toBeInTheDocument();
      });
    });
  });

  // Mock the onSubmit function within the component to test submission without actual API calls
  test('mocks onSubmit function and prevents actual API calls', async () => {
    // We need to spy on the actual function imported by the component, not the component itself
    const OnboardingPageModule = require('./page');
    const mockOnSubmit = jest.fn();
    // Temporarily replace the internal onSubmit function used by the component
    const originalHandleSubmit = OnboardingPageModule.default.prototype.render.prototype.props.onSubmit;
    OnboardingPageModule.default.prototype.render.prototype.props.onSubmit = mockOnSubmit;

    render(<OnboardingPage />);

    // Fill out all steps
    fireEvent.change(screen.getByLabelText('¿Cuál es tu edad? (años)'), { target: { value: '30' } });
    fireEvent.click(screen.getByText('Siguiente'));
    await waitFor(() => screen.getByText('¿Cuál es tu peso actual?'));
    fireEvent.change(screen.getByLabelText('¿Cuál es tu peso actual?'), { target: { value: '75' } });
    fireEvent.click(screen.getByLabelText('kg'));
    fireEvent.click(screen.getByText('Siguiente'));
    await waitFor(() => screen.getByText('¿Cuál es tu estatura?'));
    fireEvent.change(screen.getByLabelText('¿Cuál es tu estatura?'), { target: { value: '180' } });
    fireEvent.click(screen.getByLabelText('cm'));
    fireEvent.click(screen.getByText('Siguiente'));
    await waitFor(() => screen.getByLabelText('¿Cuál es tu género?'));
    fireEvent.click(screen.getByLabelText('Hombre'));
    fireEvent.click(screen.getByText('Siguiente'));
    await waitFor(() => screen.getByLabelText('¿Cuál es tu nivel de actividad física habitual?'));
    fireEvent.mouseDown(screen.getByPlaceholderText('Selecciona tu nivel de actividad'));
    fireEvent.click(screen.getByText('Moderadamente activo (ejercicio ligero 1-3 días/semana)'));
    fireEvent.click(screen.getByText('Siguiente'));
    await waitFor(() => screen.getByLabelText('¿Cuál es tu meta principal de fitness?'));
    fireEvent.mouseDown(screen.getByPlaceholderText('Selecciona tu objetivo principal'));
    fireEvent.click(screen.getByText('Perder peso'));

    // Submit the form
    fireEvent.click(screen.getByText('Aceptar y Finalizar'));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledTimes(1);
      // Optionally check the data passed to onSubmit
      // expect(mockOnSubmit).toHaveBeenCalledWith(expect.objectContaining({
      //   age: 30,
      //   weight: 75,
      //   weightUnit: 'kg',
      //   height: 180,
      //   heightUnit: 'cm',
      //   gender: 'hombre',
      //   activityLevel: 'moderadamente_activo',
      //   fitnessGoal: 'perder_peso',
      // }));
    });

    // Restore the original onSubmit function
    OnboardingPageModule.default.prototype.render.prototype.props.onSubmit = originalHandleSubmit;
  });
});

    // Step 3: Objetivos y Preferencias
    await waitFor(() => {
      const goalsInput = screen.getByLabelText('Objetivos de fitness');
      const frequencyInput = screen.getByLabelText('Frecuencia de entrenamiento semanal');

      fireEvent.change(goalsInput, { target: { value: 'Build muscle' } });
      fireEvent.change(screen.getByLabelText('Preferencias de entrenamiento'), { target: { value: 'Gym' } });
      fireEvent.change(frequencyInput, { target: { value: '3' } });
      fireEvent.click(screen.getByText('Finalizar Onboarding'));
    });

  test('updates the progress bar correctly with each step', async () => {
    render(<OnboardingPage />);

    const getProgressValue = () => screen.getByRole('progressbar').getAttribute('aria-valuenow');

    // Initial state
    expect(getProgressValue()).toBe('33');

    // Advance to step 2
    const nameInput = screen.getByLabelText('Nombre');
    const genderSelect = screen.getByLabelText('Género');
    const ageInput = screen.getByLabelText('Edad');

    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(genderSelect, { target: { value: 'male' } });
    fireEvent.change(ageInput, { target: { value: '30' } });
    fireEvent.click(screen.getByText('Siguiente'));

    await waitFor(() => {
      expect(getProgressValue()).toBe('66');
    });

    // Advance to step 3
    const heightInput = screen.getByLabelText('Altura (cm)');
    const weightInput = screen.getByLabelText('Peso (kg)');
    const healthConditionInput = screen.getByLabelText('Condiciones de salud preexistentes');

    fireEvent.change(heightInput, { target: { value: '180' } });
    fireEvent.change(weightInput, { target: { value: '75' } });
    fireEvent.change(healthConditionInput, { target: { value: 'None' } });
    fireEvent.click(screen.getByText('Siguiente'));

    await waitFor(() => {
      expect(getProgressValue()).toBe('100');
    });
  });

  test('displays correct fields for each step', async () => {
    render(<OnboardingPage />);

    // Step 1: Información Personal
    expect(screen.getByLabelText('Nombre')).toBeInTheDocument();
    expect(screen.getByLabelText('Género')).toBeInTheDocument();
    expect(screen.getByLabelText('Edad')).toBeInTheDocument();
    expect(screen.queryByLabelText('Altura (cm)')).not.toBeInTheDocument();

    // Advance to step 2
    const nameInput = screen.getByLabelText('Nombre');
    const genderSelect = screen.getByLabelText('Género');
    const ageInput = screen.getByLabelText('Edad');

    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(genderSelect, { target: { value: 'male' } });
    fireEvent.change(ageInput, { target: { value: '30' } });
    fireEvent.click(screen.getByText('Siguiente'));

    // Step 2: Información de Salud
    await waitFor(() => {
      expect(screen.queryByLabelText('Nombre')).not.toBeInTheDocument();
      expect(screen.getByLabelText('Altura (cm)')).toBeInTheDocument();
      expect(screen.getByLabelText('Peso (kg)')).toBeInTheDocument();
      expect(screen.getByLabelText('Condiciones de salud preexistentes')).toBeInTheDocument();
      expect(screen.queryByLabelText('Objetivos de fitness')).not.toBeInTheDocument();
    });

    // Advance to step 3
    const heightInput = screen.getByLabelText('Altura (cm)');
    const weightInput = screen.getByLabelText('Peso (kg)');
    const healthConditionInput = screen.getByLabelText('Condiciones de salud preexistentes');

    fireEvent.change(heightInput, { target: { value: '180' } });
    fireEvent.change(weightInput, { target: { value: '75' } });
    fireEvent.change(healthConditionInput, { target: { value: 'None' } });
    fireEvent.click(screen.getByText('Siguiente'));

    // Step 3: Objetivos y Preferencias
    await waitFor(() => {
      expect(screen.queryByLabelText('Altura (cm)')).not.toBeInTheDocument();
      expect(screen.getByLabelText('Objetivos de fitness')).toBeInTheDocument();
      expect(screen.getByLabelText('Preferencias de entrenamiento')).toBeInTheDocument();
      expect(screen.getByLabelText('Frecuencia de entrenamiento semanal')).toBeInTheDocument();
    });
  });

  test('initial state and default values are correct', () => {
    render(<OnboardingPage />);

    // Step 1: Información Personal
    expect(screen.getByLabelText('Nombre')).toHaveValue('');
    expect(screen.getByLabelText('Género')).toHaveValue('');
    expect(screen.getByLabelText('Edad')).toHaveValue(null); // Assuming age is number input
  });

  // Mock the onSubmit function within the component to test submission without actual API calls
  test('mocks onSubmit function and prevents actual API calls', async () => {
    const mockOnSubmit = jest.fn();
    jest.spyOn(require('./page'), 'onSubmit').mockImplementation(mockOnSubmit);

    render(<OnboardingPage />);

    // Step 1: Información Personal
    const nameInput = screen.getByLabelText('Nombre');
    const genderSelect = screen.getByLabelText('Género');
    const ageInput = screen.getByLabelText('Edad');

    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(genderSelect, { target: { value: 'male' } });
    fireEvent.change(ageInput, { target: { value: '30' } });
    fireEvent.click(screen.getByText('Siguiente'));

    // Step 2: Información de Salud
    await waitFor(() => {
      const heightInput = screen.getByLabelText('Altura (cm)');
      const weightInput = screen.getByLabelText('Peso (kg)');
      const healthConditionInput = screen.getByLabelText('Condiciones de salud preexistentes');

      fireEvent.change(heightInput, { target: { value: '180' } });
      fireEvent.change(weightInput, { target: { value: '75' } });
      fireEvent.change(healthConditionInput, { target: { value: 'None' } });
      fireEvent.click(screen.getByText('Siguiente'));
    });

    // Step 3: Objetivos y Preferencias
    await waitFor(() => {
      const goalsInput = screen.getByLabelText('Objetivos de fitness');
      const preferencesInput = screen.getByLabelText('Preferencias de entrenamiento');
      const frequencyInput = screen.getByLabelText('Frecuencia de entrenamiento semanal');

      fireEvent.change(goalsInput, { target: { value: 'Build muscle' } });
      fireEvent.change(preferencesInput, { target: { value: 'Gym' } });
      fireEvent.change(frequencyInput, { target: { value: '3' } });
      fireEvent.click(screen.getByText('Finalizar Onboarding'));
    });

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledTimes(1);
    });
22  });