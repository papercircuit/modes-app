import { useEffect, useState } from 'react'
import Matter, { Engine, Render, World, Bodies } from 'matter-js'
import { Synth } from 'tone'


const MainView = () => {
    const [mode, setMode] = useState('Ionian')
    const [key, setKey] = useState('C')
    const [engine, setEngine] = useState(null)
    const [synth, setSynth] = useState(null)

    const notes = ['C', 'D', 'E', 'F', 'G', 'A', 'B']


    const notesInMode = {
        Ionian: [0, 2, 4, 5, 7, 9, 11],
        Dorian: [0, 2, 3, 5, 7, 9, 10],
        Phrygian: [0, 1, 3, 5, 7, 8, 10],
        Lydian: [0, 2, 4, 6, 7, 9, 11],
        Mixolydian: [0, 2, 4, 5, 7, 9, 10],
        Aeolian: [0, 2, 3, 5, 7, 8, 10],
        Locrian: [0, 1, 3, 5, 6, 8, 10],
      };

      const notesInKey = notes.map((note, i) => {
        const noteIndex = (notes.indexOf(key) + i) % 7;
        const noteSemitones = notesInMode[mode][noteIndex];
        const noteBody = Bodies.rectangle(50 + i * 100, 50 + noteSemitones * 20, 80, 30, {
            isStatic: true,
        });
        return { note, noteSemitones, noteBody };
        });

    


    const handleModeChange = (event) => {
        setMode(event.target.value);
        notesInKey.forEach((note) => {
            // here we are using the index of the note in the key to find the index of the note in the mode and then using that to find the number of semitones in the mode. The index of the note in the key is the index of the note in the mode plus the index of the key in the notes array. We use the modulo operator to wrap around the end of the array.
          const noteIndex = (notes.indexOf(key) + notes.indexOf(note.note)) % 7;
          const noteSemitones = notesInMode[mode][noteIndex];
          note.noteBody.position.y = 50 + noteSemitones * 20;
        });
     
      };
    
      const handleKeyChange = (event) => {
        setKey(event.target.value);
        notesInKey.forEach((note) => {
          const noteIndex = (notes.indexOf(key) + notes.indexOf(note.note)) % 7;
          const noteSemitones = notesInMode[mode][noteIndex];
          note.noteBody.position.y = 50 + noteSemitones * 20;
        });
     
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

        //   Initialize tone.js on first user interaction
        const synth = new Synth().toDestination();
      
      
        Matter.Runner.run(engine);
        Render.run(render);
      
        const notesInKey = notes.map((note, i) => {
          const noteIndex = (notes.indexOf(key) + i) % 7;
          const noteSemitones = notesInMode[mode][noteIndex];
          const noteBody = Bodies.rectangle(50 + i * 100, 50 + noteSemitones * 20, 80, 30, {
            isStatic: true,
          });
      
          World.add(engine.world, noteBody);

      
          return { note, noteSemitones, noteBody };
        });
      
      
        
        // Cleanup function to remove all notes when the component unmounts
        return () => {
          notesInKey.forEach((note) => {
            World.remove(engine.world, note.noteBody);
          });
        };
        
      }, [mode, key, engine, synth]);

    return (
        <>
            <div className="controls">
                <label>
                    Mode:
                    <select value={mode} onChange={handleModeChange}>
                        <option value="Ionian">Ion</option>
                        <option value="Dorian">Dorian</option>
                        <option value="Phrygian">Phrygian</option>
                        <option value="Lydian">Lydian</option>
                        <option value="Mixolydian">Mixolydian</option>
                        <option value="Aeolian">Aeolian</option>
                        <option value="Locrian">Locrian</option>
                    </select>
                </label>
                <label>
                    Key:
                    <select value={key} onChange={handleKeyChange}>
                        <option value="C">C</option>
                        <option value="D">D</option>
                        <option value="E">E</option>
                        <option value="F">F</option>
                        <option value="G">G</option>
                        <option value="A">A</option>
                        <option value="B">B</option>
                    </select>
                </label>
            </div>
            <div id="main" />
            <style jsx>{`
    .controls {
      display: flex;
      justify-content: center;
      margin-bottom: 2rem;
    }

    label {
      margin-right: 1rem;
    }
    `}
            </style>
        </>
    )
}

export default MainView
