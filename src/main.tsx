import { render } from 'preact';
import { App } from './app';
import { registerServiceWorker } from './registerServiceWorker';
import './styles.css';

registerServiceWorker();
render(<App />, document.getElementById('app')!);
