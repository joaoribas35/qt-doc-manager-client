import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';

import { App } from './app/app';

const rootElement = document.getElementById('root')!;
const root = ReactDOM.createRoot(rootElement);
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
