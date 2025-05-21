// components/polls/PollForm.tsx
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { usePolls } from '@/contexts/PollContext';

interface PollFormProps {
  onComplete: () => void;
}

export default function PollForm({ onComplete }: PollFormProps) {
  const { addPoll, rewriteQuestion } = usePolls();
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState<string[]>(['', '']);
  const [isRewriting, setIsRewriting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddOption = () => {
    setOptions([...options, '']);
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleRemoveOption = (index: number) => {
    if (options.length <= 2) return; // Keep at least 2 options
    const newOptions = options.filter((_, i) => i !== index);
    setOptions(newOptions);
  };

  const handleRewriteQuestion = async () => {
    if (!question.trim()) return;
    
    setIsRewriting(true);
    try {
      const rewritten = await rewriteQuestion(question);
      setQuestion(rewritten);
    } catch (error) {
      console.error('Error rewriting question:', error);
    } finally {
      setIsRewriting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const trimmedQuestion = question.trim();
    const validOptions = options.filter(opt => opt.trim() !== '');
    
    if (!trimmedQuestion || validOptions.length < 2) return;
    
    setIsSubmitting(true);
    
    try {
      await addPoll(trimmedQuestion, validOptions);
      setQuestion('');
      setOptions(['', '']);
      onComplete();
    } catch (error) {
      console.error('Error creating poll:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.form 
      className="retro-card mb-6 crt-effect"
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <h3 className="text-lg mb-4">Create New Poll</h3>
      
      <div className="space-y-4">
        <div>
          <div className="flex justify-between items-center mb-1">
            <label htmlFor="question" className="block text-sm font-medium">
              Poll Question <span className="text-red-500">*</span>
            </label>
            <motion.button
              type="button"
              className="text-xs bg-purple-800 hover:bg-purple-700 text-white px-2 py-1 rounded"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleRewriteQuestion}
              disabled={!question.trim() || isRewriting}
            >
              {isRewriting ? 'Enhancing...' : '✨ Enhance with AI'}
            </motion.button>
          </div>
          <input
            id="question"
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Enter your poll question"
            className="retro-input w-full"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">
            Options <span className="text-red-500">*</span>
          </label>
          
          <div className="space-y-2">
            {options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="text"
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  placeholder={`Option ${index + 1}`}
                  className="retro-input w-full"
                  required
                />
                <motion.button
                  type="button"
                  className="text-red-500 hover:text-red-400"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleRemoveOption(index)}
                  disabled={options.length <= 2}
                >
                  ✕
                </motion.button>
              </div>
            ))}
            
            <motion.button
              type="button"
              className="text-sm text-cyan-400 hover:text-cyan-300 mt-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAddOption}
            >
              + Add Another Option
            </motion.button>
          </div>
        </div>
        
        <div className="flex justify-end space-x-3">
          <motion.button
            type="button"
            className="retro-button bg-gray-700 border-gray-800"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onComplete}
          >
            Cancel
          </motion.button>
          
          <motion.button
            type="submit"
            className="retro-button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={isSubmitting || !question.trim() || options.filter(o => o.trim()).length < 2}
          >
            {isSubmitting ? (
              <span className="inline-block animate-pulse">Creating...</span>
            ) : (
              'Create Poll'
            )}
          </motion.button>
        </div>
      </div>
    </motion.form>
  );
}