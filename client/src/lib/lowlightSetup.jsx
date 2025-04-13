import { common, createLowlight } from 'lowlight';
import javascript from 'highlight.js/lib/languages/javascript';
import typescript from 'highlight.js/lib/languages/typescript';
import jsx from 'highlight.js/lib/languages/javascript';
import tsx from 'highlight.js/lib/languages/typescript';
import html from 'highlight.js/lib/languages/xml';
import css from 'highlight.js/lib/languages/css';
import scss from 'highlight.js/lib/languages/scss';
import less from 'highlight.js/lib/languages/less';
import python from 'highlight.js/lib/languages/python';
import java from 'highlight.js/lib/languages/java';
import cpp from 'highlight.js/lib/languages/cpp';
import csharp from 'highlight.js/lib/languages/csharp';
import ruby from 'highlight.js/lib/languages/ruby';
import php from 'highlight.js/lib/languages/php';
import go from 'highlight.js/lib/languages/go';
import rust from 'highlight.js/lib/languages/rust';
import swift from 'highlight.js/lib/languages/swift';
import kotlin from 'highlight.js/lib/languages/kotlin';
import sql from 'highlight.js/lib/languages/sql';
import bash from 'highlight.js/lib/languages/bash';
import shell from 'highlight.js/lib/languages/shell';
import powershell from 'highlight.js/lib/languages/powershell';
import json from 'highlight.js/lib/languages/json';
import xml from 'highlight.js/lib/languages/xml';
import yaml from 'highlight.js/lib/languages/yaml';
import markdown from 'highlight.js/lib/languages/markdown';
import diff from 'highlight.js/lib/languages/diff';
import plaintext from 'highlight.js/lib/languages/plaintext';

// Create lowlight instance with all languages
const lowlight = createLowlight(common);

// Register additional languages
lowlight.register('javascript', javascript);
lowlight.register('typescript', typescript);
lowlight.register('jsx', jsx);
lowlight.register('tsx', tsx);
lowlight.register('html', html);
lowlight.register('css', css);
lowlight.register('scss', scss);
lowlight.register('less', less);
lowlight.register('python', python);
lowlight.register('java', java);
lowlight.register('cpp', cpp);
lowlight.register('csharp', csharp);
lowlight.register('ruby', ruby);
lowlight.register('php', php);
lowlight.register('go', go);
lowlight.register('rust', rust);
lowlight.register('swift', swift);
lowlight.register('kotlin', kotlin);
lowlight.register('sql', sql);
lowlight.register('bash', bash);
lowlight.register('shell', shell);
lowlight.register('powershell', powershell);
lowlight.register('json', json);
lowlight.register('xml', xml);
lowlight.register('yaml', yaml);
lowlight.register('markdown', markdown);
lowlight.register('diff', diff);
lowlight.register('plaintext', plaintext);

// Aliases for common language names
lowlight.register('js', javascript);
lowlight.register('ts', typescript);
lowlight.register('react', jsx);
lowlight.register('reactts', tsx);
lowlight.register('c#', csharp);
lowlight.register('sh', bash);
lowlight.register('zsh', bash);
lowlight.register('md', markdown);

export default lowlight;