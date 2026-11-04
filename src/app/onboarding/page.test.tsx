import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import OnboardingPage from './page';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock useToast
jest.mock('@/hooks/use-toast', () => ({
  useToast: jest.fn(),
}));

describe('OnboardingPage', () => {
  const mockPush = jest.fn();
  const mockToast = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
    (useToast as jest.Mock).mockReturnValue({
      toast: mockToast,
    });
  });

  test('renders without crashing and displays welcome title', () => {
    render(<OnboardingPage />);
    expect(screen.getByText('¡Bienvenido/a a Valky369!')).toBeInTheDocument();
    expect(screen.getByText('Paso 1 de 6')).toBeInTheDocument();
    expect(screen.getByLabelText('¿Cuál es tu edad? (años)')).toBeInTheDocument();
  });

  test('navigates to next step when clicking "Siguiente" with valid age', async () => {
    render(<OnboardingPage />);

    const ageInput = screen.getByLabelText('¿Cuál es tu edad? (años)');
    fireEvent.change(ageInput, { target: { value: '28' } });

    const nextButton = screen.getByText('Siguiente');
    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(screen.getByText('Paso 2 de 6')).toBeInTheDocument();
      expect(screen.getByText('¿Cuál es tu peso actual?')).toBeInTheDocument();
    });
  });

  test('shows validation error when attempting to advance with invalid age', async () => {
    render(<OnboardingPage />);

    const nextButton = screen.getByText('Siguiente');
    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(screen.getByText('La edad debe ser un número.')).toBeInTheDocument();
    });
  });

  test('navigates backwards when "Atrás" is clicked from step 2', async () => {
    render(<OnboardingPage />);

    // Advance to step 2
    const ageInput = screen.getByLabelText('¿Cuál es tu edad? (años)');
    fireEvent.change(ageInput, { target: { value: '30' } });
    fireEvent.click(screen.getByText('Siguiente'));

    await waitFor(() => {
      expect(screen.getByText('Paso 2 de 6')).toBeInTheDocument();
    });

    // Go back to step 1
    const backButton = screen.getByText('Atrás');
    fireEvent.click(backButton);

    await waitFor(() => {
      expect(screen.getByText('Paso 1 de 6')).toBeInTheDocument();
      expect(screen.getByLabelText('¿Cuál es tu edad? (años)')).toBeInTheDocument();
    });
  });

  test('validates age boundaries (min 12, max 120)', async () => {
    render(<OnboardingPage />);

    const ageInput = screen.getByLabelText('¿Cuál es tu edad? (años)');
    const nextButton = screen.getByText('Siguiente');

    // Too young (< 12)
    fireEvent.change(ageInput, { target: { value: '10' } });
    fireEvent.click(nextButton);
    await waitFor(() => {
      expect(screen.getByText('Debes tener al menos 12 años.')).toBeInTheDocument();
    });

    // Too old (> 120)
    fireEvent.change(ageInput, { target: { value: '130' } });
    fireEvent.click(nextButton);
    await waitFor(() => {
      expect(screen.getByText('La edad parece incorrecta.')).toBeInTheDocument();
    });
  });

  test('validates weight boundaries when navigating step 2', async () => {
    render(<OnboardingPage />);

    // Go to step 2
    fireEvent.change(screen.getByLabelText('¿Cuál es tu edad? (años)'), { target: { value: '25' } });
    fireEvent.click(screen.getByText('Siguiente'));

    await waitFor(() => {
      expect(screen.getByText('¿Cuál es tu peso actual?')).toBeInTheDocument();
    });

    const weightInput = screen.getByPlaceholderText('Ej: 70');
    const nextButton = screen.getByText('Siguiente');

    // Weight below minimum (20)
    fireEvent.change(weightInput, { target: { value: '10' } });
    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(screen.getByText('El peso mínimo es 20.')).toBeInTheDocument();
    });

    // Weight above maximum (300)
    fireEvent.change(weightInput, { target: { value: '350' } });
    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(screen.getByText('El peso máximo es 300.')).toBeInTheDocument();
    });
  });

  test('validates height boundaries when navigating step 3', async () => {
    render(<OnboardingPage />);

    // Step 1: Age
    fireEvent.change(screen.getByLabelText('¿Cuál es tu edad? (años)'), { target: { value: '25' } });
    fireEvent.click(screen.getByText('Siguiente'));

    // Step 2: Weight
    await waitFor(() => expect(screen.getByText('¿Cuál es tu peso actual?')).toBeInTheDocument());
    fireEvent.change(screen.getByPlaceholderText('Ej: 70'), { target: { value: '70' } });
    fireEvent.click(screen.getByText('Siguiente'));

    // Step 3: Height
    await waitFor(() => expect(screen.getByText('¿Cuál es tu estatura?')).toBeInTheDocument());
    const heightInput = screen.getByPlaceholderText('Ej: 175');
    const nextButton = screen.getByText('Siguiente');

    // Height below min (50)
    fireEvent.change(heightInput, { target: { value: '30' } });
    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(screen.getByText('La estatura mínima es 50 cm / 1.64 ft.')).toBeInTheDocument();
    });

    // Height above max (250)
    fireEvent.change(heightInput, { target: { value: '280' } });
    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(screen.getByText('La estatura máxima es 250 cm / 8.2 ft.')).toBeInTheDocument();
    });
  });

  test('progress bar updates correctly across steps', async () => {
    render(<OnboardingPage />);

    // Step 1
    expect(screen.getByText('Paso 1 de 6')).toBeInTheDocument();

    // Advance to Step 2
    fireEvent.change(screen.getByLabelText('¿Cuál es tu edad? (años)'), { target: { value: '25' } });
    fireEvent.click(screen.getByText('Siguiente'));

    await waitFor(() => {
      expect(screen.getByText('Paso 2 de 6')).toBeInTheDocument();
    });

    // Advance to Step 3
    fireEvent.change(screen.getByPlaceholderText('Ej: 70'), { target: { value: '70' } });
    fireEvent.click(screen.getByText('Siguiente'));

    await waitFor(() => {
      expect(screen.getByText('Paso 3 de 6')).toBeInTheDocument();
    });
  });
});