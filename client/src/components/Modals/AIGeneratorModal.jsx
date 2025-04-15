import { useState } from 'react';
import { X, Loader2 } from 'lucide-react';

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
    additionalInstructions: ''
  });

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await onGenerate(formData);
      onClose();
    } catch (error) {
      console.error('Error generating content:', error);
      // You could add error handling UI here
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
    // { value: 'table', label: 'Table' }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h2 className="text-xl font-semibold text-gray-800">Generate Lecture Content with AI</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Topic */}
          <div className="space-y-2">
            <label htmlFor="topic" className="block text-sm font-medium text-gray-700">Topic</label>
            <input
              id="topic"
              type="text"
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter the main topic for your lecture"
              value={formData.topic}
              onChange={(e) => handleChange('topic', e.target.value)}
              required
            />
          </div>

          {/* Section Count */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Number of Sections: {formData.sectionCount}
            </label>
            <input
              type="range"
              min="1"
              max="10"
              step="1"
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              value={formData.sectionCount}
              onChange={(e) => handleChange('sectionCount', parseInt(e.target.value))}
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>1</span>
              <span>5</span>
              <span>10</span>
            </div>
          </div>

          {/* Section Types */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Section Types</label>
            <div className="grid grid-cols-2 gap-2">
              {sectionTypeOptions.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={`section-${option.value}`}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
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

          {/* Section Length */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Section Length</label>
            <div className="flex space-x-4">
              {['short', 'medium', 'long'].map((length) => (
                <div key={length} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id={length}
                    name="sectionLength"
                    value={length}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    checked={formData.sectionLength === length}
                    onChange={() => handleChange('sectionLength', length)}
                  />
                  <label htmlFor={length} className="text-sm text-gray-700 capitalize">
                    {length}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Tone and Style */}
          <div className="space-y-2">
            <label htmlFor="tone" className="block text-sm font-medium text-gray-700">Tone and Style</label>
            <select
              id="tone"
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
          <div className="space-y-2">
            <label htmlFor="audience" className="block text-sm font-medium text-gray-700">Target Audience</label>
            <select
              id="audience"
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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

          {/* Additional options */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Additional Options</label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="include-header"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  checked={formData.includeHeader}
                  onChange={(e) => handleChange('includeHeader', e.target.checked)}
                />
                <label htmlFor="include-header" className="text-sm text-gray-700">Include Header</label>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="include-footer"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  checked={formData.includeFooter}
                  onChange={(e) => handleChange('includeFooter', e.target.checked)}
                />
                <label htmlFor="include-footer" className="text-sm text-gray-700">Include Footer</label>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="include-emojis"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  checked={formData.includeEmojis}
                  onChange={(e) => handleChange('includeEmojis', e.target.checked)}
                />
                <label htmlFor="include-emojis" className="text-sm text-gray-700">Include Emojis</label>
              </div>
            </div>
          </div>

          {/* Additional Instructions */}
          <div className="space-y-2">
            <label htmlFor="instructions" className="block text-sm font-medium text-gray-700">
              Additional Instructions (Optional)
            </label>
            <textarea
              id="instructions"
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Add any specific instructions for content generation"
              value={formData.additionalInstructions}
              onChange={(e) => handleChange('additionalInstructions', e.target.value)}
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                'Generate Content'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AIGeneratorModal;