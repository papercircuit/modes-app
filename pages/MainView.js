import React from 'react';
import { useEffect, useState } from 'react';
import Matter from 'matter-js';
import { Engine, Render, World, Bodies, Body, Events } from 'matter-js';
import { Synth } from 'tone';

const MainView = () => {
  const [mode, setMode] = useState('Ionian');
  const [key, setKey] = useState('C');
  const [engine, setEngine] = useState(null);
  const [synth, setSynth] = useState(null);
  const [isPressed, setIsPressed] = useState(false);

  const notes = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];

  const notesInMode = {
    Ionian: [0, 2, 4, 5, 7, 9, 11],
    Dorian: [0, 2, 3, 5, 7, 9, 10],
    Phrygian: [0, 1, 3, 5, 7, 8, 10],
    Lydian: [0, 2, 4, 6, 7, 9, 11],
    Mixolydian: [0, 2, 4, 5, 7, 9, 10],
    Aeolian: [0, 2, 3, 5, 7, 8, 10],
    Locrian: [0, 1, 3, 5, 6, 8, 10],
  };

  let notesInKey = [];

  const handleModeChange = (event) => {
    setMode(event.target.value);
  };

  const handleKeyChange = (event) => {
    setKey(event.target.value);
  };

  useEffect(() => {
    const engine = Engine.create();
    const render = Render.create({
      element: document.body,
      engine: engine,
      options: {
        width: 800,
        height: 600,
      },
    });

    // Initialize the synth when the button with id "start" is clicked
    const startButton = document.getElementById('start');
    startButton.onclick = () => {
      const synth = new Synth().toDestination();
      setSynth(synth);
      console.log('synth started', synth)
      // play a note to indicate that the synth is ready
      synth.triggerAttackRelease('C4', '8n');
    };

    Matter.Runner.run(engine);
    Render.run(render);

    notesInKey = notes.map((note, i) => {
      const noteIndex = (notes.indexOf(key) + i) % 7;
      const noteSemitones = notesInMode[mode][noteIndex];
      const noteBody = Bodies.rectangle(50 + i * 100, 50 + noteSemitones * 20, 80, 30, {
        isStatic: true,
        render: {
          fillStyle: '#ffffff',
        },
      }
      );

      Events.on(noteBody, 'mousedown', () => {
        setIsPressed(true);
        noteBody.render.fillStyle = '#ff0000';
        Body.translate(noteBody, { x: 0, y: -10 });
        synth.triggerAttackRelease(`${key}${noteSemitones + 4}`, '8n');
        console.log('note pressed', noteBody)
      });

      Events.on(noteBody, 'mouseup', () => {
        setIsPressed(false);
        noteBody.render.fillStyle = '#ffffff';
        Body.translate(noteBody, { x: 0, y: 10 });
      });
    
      World.add(engine.world, noteBody);
 
      return { note, noteSemitones, noteBody };
    });

    // Update the position of the notes when the mode or key changes
    const updateNotes = () => {
      notesInKey.forEach((note) => {
        const noteIndex = (notes.indexOf(key) + notes.indexOf(note.note)) % 7;
        const noteSemitones = notesInMode[mode][noteIndex];
        Body.setPosition(note.noteBody, {
          x: 50 + notes.indexOf(note.note) * 100,
          y: 50 + noteSemitones * 20,
        });
      });
    };

    setEngine(engine);
    updateNotes();
  }, []);

  useEffect(() => {
    if (engine) {
      engine.world.bodies.forEach((body) => {
        World.remove(engine.world, body);
      });
      notesInKey.forEach((note) => {
        World.add(engine.world, note.noteBody);
      });
     
    }
  }
  , [mode, key]);



  useEffect(() => {
  if (engine && synth) {
    notesInKey.forEach((note) => {
      const { noteBody, noteSemitones } = note;

      Events.on(noteBody, 'mousedown', () => {
        setIsPressed(true);
        noteBody.render.fillStyle = '#ff0000';
        Body.translate(noteBody, { x: 0, y: -10 });
        synth.triggerAttackRelease(`${key}${noteSemitones + 4}`, '8n');
      });

      Events.on(noteBody, 'mouseup', () => {
        setIsPressed(false);
        noteBody.render.fillStyle = '#ffffff';
        Body.translate(noteBody, { x: 0, y: 10 });
      });
    });
  }
}, [engine, synth]);


  return (
    <div>
      <h1>MODES</h1>
      <div>

        <select value={mode} onChange={handleModeChange}>
          <option value="Ionian">Ionian</option>
          <option value="Dorian">Dorian</option>
          <option value="Phrygian">Phrygian</option>
          <option value="Lydian">Lydian</option>
          <option value="Mixolydian">Mixolydian</option>
          <option value="Aeolian">Aeolian</option>
          <option value="Locrian">Locrian</option>
        </select>

        <select value={key} onChange={handleKeyChange}>
          <option value="C">C</option>
          <option value="C#">C#</option>
          <option value="D">D</option>
          <option value="D#">D#</option>
          <option value="E">E</option>
          <option value="F">F</option>
          <option value="F#">F#</option>
          <option value="G">G</option>
          <option value="G#">G#</option>
          <option value="A">A</option>
          <option value="A#">A#</option>
          <option value="B">B</option>
        </select>

        <button id="start">Start</button>

      </div>
    </div>
  );
};

export default MainView;
