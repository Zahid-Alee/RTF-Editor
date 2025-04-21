import { useState } from 'react';
import { X, Loader2, ChevronDown, Bot, Sparkles, Wand2 } from 'lucide-react';

const AIGeneratorModal = ({ isOpen, onClose, onGenerate }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    topic: '',
    sectionCount: 3,
    sectionTypes: ['paragraph', 'bulletList', 'codeBlock'],
    sectionLength: 'medium',
    tone: 'professional',
    includeHeader: true,
    includeFooter: false,
    includeEmojis: false,
    targetAudience: 'students',
    model: 'openai',
    additionalInstructions: ''
  });
  
  const [showAdvanced, setShowAdvanced] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await onGenerate(formData);
      onClose();
    } catch (error) {
      console.error('Error generating content:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const sectionTypeOptions = [
    { value: 'paragraph', label: 'Paragraph' },
    { value: 'heading', label: 'Heading' },
    { value: 'bulletList', label: 'Bullet List' },
    { value: 'orderedList', label: 'Numbered List' },
    { value: 'taskList', label: 'Task List' },
    { value: 'codeBlock', label: 'Code Block' },
    { value: 'blockquote', label: 'Blockquote' },
  ];

  const modelOptions = [
    { value: 'openai', label: 'OpenAI' },
    { value: 'gemini', label: 'Gemini' },
  ];

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-20 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-purple-100">
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-t-xl">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-full bg-purple-100">
              <Bot className="h-5 w-5 text-purple-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800">Generate Lecture Content</h2>
          </div>
          <button 
            onClick={onClose}
            className="text-purple-500 hover:text-purple-700 focus:outline-none"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Two column layout for essential fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left column */}
            <div className="space-y-5">
              {/* Topic */}
              <div>
                <label htmlFor="topic" className="block text-sm font-medium text-gray-800 mb-2">Topic*</label>
                <input
                  id="topic"
                  type="text"
                  className="block w-full px-4 py-2 bg-white border border-purple-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-800 placeholder-purple-300"
                  placeholder="Enter main topic"
                  value={formData.topic}
                  onChange={(e) => handleChange('topic', e.target.value)}
                  required
                />
              </div>

              {/* AI Model Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-2">AI Model</label>
                <div className="flex gap-2">
                  {modelOptions.map(option => (
                    <button
                      key={option.value}
                      type="button"
                      className={`px-4 py-2 text-sm rounded-lg flex-1 transition-colors ${formData.model === option.value ? 'bg-purple-600 text-white shadow-md' : 'bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200'}`}
                      onClick={() => handleChange('model', option.value)}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tone and Style */}
              <div>
                <label htmlFor="tone" className="block text-sm font-medium text-gray-800 mb-2">Tone</label>
                <select
                  id="tone"
                  className="block w-full px-4 py-2 bg-white border border-purple-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-800"
                  value={formData.tone}
                  onChange={(e) => handleChange('tone', e.target.value)}
                >
                  <option value="professional">Professional</option>
                  <option value="casual">Casual</option>
                  <option value="friendly">Friendly</option>
                  <option value="enthusiastic">Enthusiastic</option>
                  <option value="humorous">Humorous</option>
                  <option value="technical">Technical</option>
                </select>
              </div>
              
              {/* Target Audience */}
              <div>
                <label htmlFor="audience" className="block text-sm font-medium text-gray-800 mb-2">Audience</label>
                <select
                  id="audience"
                  className="block w-full px-4 py-2 bg-white border border-purple-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-800"
                  value={formData.targetAudience}
                  onChange={(e) => handleChange('targetAudience', e.target.value)}
                >
                  <option value="students">Students</option>
                  <option value="beginners">Beginners</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                  <option value="professionals">Professionals</option>
                </select>
              </div>
            </div>

            {/* Right column */}
            <div className="space-y-5">
              {/* Section Count */}
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-2">
                  Sections: <span className="text-purple-600 font-semibold">{formData.sectionCount}</span>
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="1"
                    max="10"
                    step="1"
                    className="w-full h-2 bg-purple-100 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-purple-600"
                    value={formData.sectionCount}
                    onChange={(e) => handleChange('sectionCount', parseInt(e.target.value))}
                  />
                </div>
              </div>

              {/* Section Length */}
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-2">Length</label>
                <div className="flex gap-3">
                  {['short', 'medium', 'long'].map((length) => (
                    <button
                      key={length}
                      type="button"
                      className={`px-4 py-2 text-sm rounded-lg capitalize transition-colors ${formData.sectionLength === length ? 'bg-purple-600 text-white shadow-md' : 'bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200'}`}
                      onClick={() => handleChange('sectionLength', length)}
                    >
                      {length}
                    </button>
                  ))}
                </div>
              </div>

              {/* Section Types */}
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-2">Section Types</label>
                <div className="grid grid-cols-2 gap-3">
                  {sectionTypeOptions.map((option) => (
                    <div key={option.value} className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        id={`section-${option.value}`}
                        className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-purple-300 rounded"
                        checked={formData.sectionTypes.includes(option.value)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            handleChange('sectionTypes', [...formData.sectionTypes, option.value]);
                          } else {
                            handleChange(
                              'sectionTypes',
                              formData.sectionTypes.filter((type) => type !== option.value)
                            );
                          }
                        }}
                      />
                      <label htmlFor={`section-${option.value}`} className="text-sm text-gray-700">
                        {option.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Simple Options */}
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-2">Include</label>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="include-header"
                      className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-purple-300 rounded"
                      checked={formData.includeHeader}
                      onChange={(e) => handleChange('includeHeader', e.target.checked)}
                    />
                    <label htmlFor="include-header" className="text-sm text-gray-700">Header</label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="include-footer"
                      className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-purple-300 rounded"
                      checked={formData.includeFooter}
                      onChange={(e) => handleChange('includeFooter', e.target.checked)}
                    />
                    <label htmlFor="include-footer" className="text-sm text-gray-700">Footer</label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="include-emojis"
                      className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-purple-300 rounded"
                      checked={formData.includeEmojis}
                      onChange={(e) => handleChange('includeEmojis', e.target.checked)}
                    />
                    <label htmlFor="include-emojis" className="text-sm text-gray-700">Emojis</label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Advanced Options */}
          <div>
            <button
              type="button"
              className="text-sm text-purple-600 hover:text-gray-800 flex items-center group"
              onClick={() => setShowAdvanced(!showAdvanced)}
            >
              <ChevronDown className={`h-4 w-4 mr-1 transition-transform ${showAdvanced ? 'rotate-180' : ''} text-purple-500 group-hover:text-purple-700`} />
              {showAdvanced ? 'Hide' : 'Show'} Advanced Options
            </button>
          </div>

          {showAdvanced && (
            <div className="pt-4">
              <label htmlFor="instructions" className="block text-sm font-medium text-gray-800 mb-2">
                Additional Instructions
              </label>
              <textarea
                id="instructions"
                className="block w-full px-4 py-3 bg-white border border-purple-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-800 placeholder-purple-300"
                placeholder="Add any specific instructions for content generation..."
                value={formData.additionalInstructions}
                onChange={(e) => handleChange('additionalInstructions', e.target.value)}
                rows={3}
              />
            </div>
          )}

          <div className="flex justify-end space-x-4 pt-6 border-t border-purple-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-5 py-2.5 bg-white text-purple-700 border border-purple-300 rounded-lg shadow-sm hover:bg-purple-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-1 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg shadow-md hover:from-purple-700 hover:to-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-1 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Generate Content
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AIGeneratorModal;