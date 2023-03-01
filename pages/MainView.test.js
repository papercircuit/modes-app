import { render, screen } from '@testing-library/react';
import MainView from './MainView';

// test that the MainView component renders
test('renders MainView', () => {
    render(<MainView />);
    const linkElement = screen.getByText(/MODES/i);
    expect(linkElement).toBeInTheDocument();
    }
);

// test that matter.js is imported
test('matter.js is imported', () => {
    expect(Matter).toBeDefined();
});

// test that the synth is initialized when the start button is clicked
test('synth is initialized when start button is clicked', () => {
    const startButton = document.getElementById('start');
    startButton.click();
    expect(synth).toBeDefined();
});



