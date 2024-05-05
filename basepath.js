// Importing necessary modules
import { dirname } from 'path';
import { fileURLToPath } from 'url';

// Using Node.js `import.meta` to get the URL of the current module's file
const basePath = dirname(fileURLToPath(import.meta.url));

// Exporting the base path to be used in other modules
export default basePath;
