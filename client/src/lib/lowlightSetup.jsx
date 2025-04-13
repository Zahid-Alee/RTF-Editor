import { common, createLowlight } from 'lowlight';
import javascript from 'highlight.js/lib/languages/javascript';
import html from 'highlight.js/lib/languages/xml';
import css from 'highlight.js/lib/languages/css';
import python from 'highlight.js/lib/languages/python';
import java from 'highlight.js/lib/languages/java';
import cpp from 'highlight.js/lib/languages/cpp';
import ruby from 'highlight.js/lib/languages/ruby';
import php from 'highlight.js/lib/languages/php';
import go from 'highlight.js/lib/languages/go';
import rust from 'highlight.js/lib/languages/rust';
import sql from 'highlight.js/lib/languages/sql';
import bash from 'highlight.js/lib/languages/bash';
import json from 'highlight.js/lib/languages/json';

// Create lowlight instance with all languages
const lowlight = createLowlight(common);

// Register additional languages
lowlight.register('javascript', javascript);
lowlight.register('html', html);
lowlight.register('css', css);
lowlight.register('python', python);
lowlight.register('java', java);
lowlight.register('cpp', cpp);
lowlight.register('ruby', ruby);
lowlight.register('php', php);
lowlight.register('go', go);
lowlight.register('rust', rust);
lowlight.register('sql', sql);
lowlight.register('bash', bash);
lowlight.register('json', json);

export default lowlight;