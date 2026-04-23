import React, { useState } from 'react';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, X, Plus } from 'lucide-react';

const SortableItem = ({ id, title, onRemove, isVisible, onToggle }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div ref={setNodeRef} style={style} className="bg-white border rounded-lg p-3 mb-2">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <button {...attributes} {...listeners} className="cursor-grab text-gray-400 hover:text-gray-600">
                        <GripVertical size={20} />
                    </button>
                    <span className="font-medium">{title}</span>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={() => onToggle(id)} className="text-sm text-blue-500">
                        {isVisible ? 'Hide' : 'Show'}
                    </button>
                    <button onClick={() => onRemove(id)} className="text-red-500">
                        <X size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
};

const DragDropSections = ({ sections, setSections }) => {
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = (event) => {
        const { active, over } = event;
        if (active.id !== over.id) {
            const oldIndex = sections.findIndex(s => s.id === active.id);
            const newIndex = sections.findIndex(s => s.id === over.id);
            setSections(arrayMove(sections, oldIndex, newIndex));
        }
    };

    const toggleSection = (id) => {
        setSections(sections.map(s => 
            s.id === id ? { ...s, visible: !s.visible } : s
        ));
    };

    const removeSection = (id) => {
        setSections(sections.filter(s => s.id !== id));
    };

    const addSection = () => {
        const newId = `section-${Date.now()}`;
        setSections([...sections, {
            id: newId,
            title: 'New Section',
            visible: true,
            type: 'custom'
        }]);
    };

    return (
        <div className="bg-gray-50 rounded-xl p-4">
            <h3 className="font-semibold mb-3 flex items-center justify-between">
                Customize Resume Sections
                <button onClick={addSection} className="text-blue-500 text-sm flex items-center gap-1">
                    <Plus size={16} /> Add Section
                </button>
            </h3>
            
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <SortableContext
                    items={sections.map(s => s.id)}
                    strategy={verticalListSortingStrategy}
                >
                    {sections.map(section => (
                        <SortableItem
                            key={section.id}
                            id={section.id}
                            title={section.title}
                            isVisible={section.visible}
                            onRemove={removeSection}
                            onToggle={toggleSection}
                        />
                    ))}
                </SortableContext>
            </DndContext>
            
            <p className="text-xs text-gray-400 mt-3">Drag to reorder sections</p>
        </div>
    );
};

export default DragDropSections;