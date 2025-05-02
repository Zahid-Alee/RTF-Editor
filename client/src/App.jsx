import Editor from './components/Editor';
import { EditorProvider } from './context/EditorContext';
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";

export const getMetaContent = (name) => {
  const meta = document.querySelector(`meta[name="${name}"]`);
  return meta?.getAttribute('content') || null;
};
function App() {

  return (
    <QueryClientProvider client={queryClient}>
      <EditorProvider >
        <div className="bg-slate-50 min-h-screen font-sans">
          <Editor />
        </div>
      </EditorProvider>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
