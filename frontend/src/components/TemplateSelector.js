import React, { useState } from 'react';
import { Check, Palette, Type } from 'lucide-react';

const templates = [
    { id: 'modern', name: 'Modern', icon: '🎨', preview: 'Gradient header, cards layout' },
    { id: 'professional', name: 'Professional', icon: '💼', preview: 'Sidebar, clean typography' },
    { id: 'creative', name: 'Creative', icon: '✨', preview: 'Bold colors, unique layout' },
    { id: 'minimal', name: 'Minimal', icon: '📄', preview: 'Simple, elegant design' },
    { id: 'executive', name: 'Executive', icon: '👔', preview: 'Corporate, structured' },
];

const TemplateSelector = ({ selectedTemplate, onSelectTemplate, onCustomize }) => {
    const [showCustomizer, setShowCustomizer] = useState(false);

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                {templates.map(template => (
                    <button
                        key={template.id}
                        onClick={() => onSelectTemplate(template.id)}
                        className={`p-4 border-2 rounded-xl text-left transition-all ${
                            selectedTemplate === template.id 
                                ? 'border-blue-500 bg-blue-50' 
                                : 'border-gray-200 hover:border-gray-300'
                        }`}
                    >
                        <div className="text-3xl mb-2">{template.icon}</div>
                        <div className="font-semibold">{template.name}</div>
                        <div className="text-xs text-gray-500 mt-1">{template.preview}</div>
                        {selectedTemplate === template.id && (
                            <Check size={16} className="text-blue-500 mt-2" />
                        )}
                    </button>
                ))}
            </div>
            
            <div className="flex gap-2">
                <button 
                    onClick={() => setShowCustomizer(!showCustomizer)}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                    <Palette size={14} /> Customize Colors
                </button>
                <button className="flex items-center gap-2 px-3 py-1.5 text-sm bg-gray-100 rounded-lg hover:bg-gray-200">
                    <Type size={14} /> Font Settings
                </button>
            </div>
            
            {showCustomizer && onCustomize && (
                <div className="p-4 bg-white border rounded-lg">
                    <h4 className="font-medium mb-3">Color Customization</h4>
                    <div className="flex gap-3">
                        {['#2563EB', '#7C3AED', '#DC2626', '#059669', '#D97706'].map(color => (
                            <button
                                key={color}
                                onClick={() => onCustomize('primary', color)}
                                className="w-8 h-8 rounded-full border-2 border-white shadow"
                                style={{ backgroundColor: color }}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default TemplateSelector;