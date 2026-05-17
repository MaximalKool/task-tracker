import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { LocalStorageTaskRepository } from '../data/LocalStorageTaskRepository';
import { App } from './App';
import './styles.css';

// Composition root: the only place a concrete repository is chosen.
// Swap this line to point the whole app at a different backend.
const repository = new LocalStorageTaskRepository();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App repo={repository} />
  </StrictMode>,
);
