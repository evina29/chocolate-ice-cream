"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Heart, Calendar, Flame, TrendingUp, Plus, Edit3, Save, X, ArrowLeft, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface JournalEntry {
  id: string;
  title: string;
  content: string;
  date: string;
  timestamp: number;
}

interface MoodEntry {
  id: string;
  mood: number; // 1-10 scale
  note: string;
  date: string;
  timestamp: number;
}

const Dashboard = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'journal' | 'mood'>('journal');
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]);
  const [isWriting, setIsWriting] = useState(false);
  const [isMoodTracking, setIsMoodTracking] = useState(false);
  const [currentEntry, setCurrentEntry] = useState<Partial<JournalEntry>>({});
  const [currentMood, setCurrentMood] = useState<Partial<MoodEntry>>({});
  const [editingEntry, setEditingEntry] = useState<string | null>(null);
  const [editingMood, setEditingMood] = useState<string | null>(null);

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedJournals = localStorage.getItem('lumina-journals');
    const savedMoods = localStorage.getItem('lumina-moods');
    
    if (savedJournals) {
      setJournalEntries(JSON.parse(savedJournals));
    }
    if (savedMoods) {
      setMoodEntries(JSON.parse(savedMoods));
    }
  }, []);

  // Save journal entries to localStorage
  const saveJournalEntry = () => {
    if (!currentEntry.title || !currentEntry.content) return;
    
    if (editingEntry) {
      // Update existing entry
      const updatedEntries = journalEntries.map(entry => 
        entry.id === editingEntry 
          ? { ...entry, title: currentEntry.title!, content: currentEntry.content! }
          : entry
      );
      setJournalEntries(updatedEntries);
      localStorage.setItem('lumina-journals', JSON.stringify(updatedEntries));
      setEditingEntry(null);
    } else {
      // Create new entry
      const newEntry: JournalEntry = {
        id: Date.now().toString(),
        title: currentEntry.title,
        content: currentEntry.content,
        date: new Date().toLocaleDateString(),
        timestamp: Date.now()
      };
      
      const updatedEntries = [newEntry, ...journalEntries];
      setJournalEntries(updatedEntries);
      localStorage.setItem('lumina-journals', JSON.stringify(updatedEntries));
    }
    
    setCurrentEntry({});
    setIsWriting(false);
  };

  // Delete journal entry
  const deleteJournalEntry = (id: string) => {
    const updatedEntries = journalEntries.filter(entry => entry.id !== id);
    setJournalEntries(updatedEntries);
    localStorage.setItem('lumina-journals', JSON.stringify(updatedEntries));
  };

  // Edit journal entry
  const editJournalEntry = (entry: JournalEntry) => {
    setCurrentEntry(entry);
    setEditingEntry(entry.id);
    setIsWriting(true);
  };

  // Save mood entry to localStorage
  const saveMoodEntry = () => {
    if (!currentMood.mood) return;
    
    if (editingMood) {
      // Update existing mood
      const updatedMoods = moodEntries.map(mood => 
        mood.id === editingMood 
          ? { ...mood, mood: currentMood.mood!, note: currentMood.note || '' }
          : mood
      );
      setMoodEntries(updatedMoods);
      localStorage.setItem('lumina-moods', JSON.stringify(updatedMoods));
      setEditingMood(null);
    } else {
      // Create new mood
      const newMood: MoodEntry = {
        id: Date.now().toString(),
        mood: currentMood.mood,
        note: currentMood.note || '',
        date: new Date().toLocaleDateString(),
        timestamp: Date.now()
      };
      
      const updatedMoods = [newMood, ...moodEntries];
      setMoodEntries(updatedMoods);
      localStorage.setItem('lumina-moods', JSON.stringify(updatedMoods));
    }
    
    setCurrentMood({});
    setIsMoodTracking(false);
  };

  // Delete mood entry
  const deleteMoodEntry = (id: string) => {
    const updatedMoods = moodEntries.filter(mood => mood.id !== id);
    setMoodEntries(updatedMoods);
    localStorage.setItem('lumina-moods', JSON.stringify(updatedMoods));
  };

  // Edit mood entry
  const editMoodEntry = (mood: MoodEntry) => {
    setCurrentMood(mood);
    setEditingMood(mood.id);
    setIsMoodTracking(true);
  };

  // Calculate streaks
  const calculateJournalStreak = () => {
    if (journalEntries.length === 0) return 0;
    
    const sortedEntries = journalEntries.sort((a, b) => b.timestamp - a.timestamp);
    let streak = 0;
    let currentDate = new Date();
    
    for (const entry of sortedEntries) {
      const entryDate = new Date(entry.timestamp);
      const daysDiff = Math.floor((currentDate.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysDiff === streak) {
        streak++;
        currentDate = entryDate;
      } else if (daysDiff > streak) {
        break;
      }
    }
    
    return streak;
  };

  const calculateMoodStreak = () => {
    if (moodEntries.length === 0) return 0;
    
    const sortedEntries = moodEntries.sort((a, b) => b.timestamp - a.timestamp);
    let streak = 0;
    let currentDate = new Date();
    
    for (const entry of sortedEntries) {
      const entryDate = new Date(entry.timestamp);
      const daysDiff = Math.floor((currentDate.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysDiff === streak) {
        streak++;
        currentDate = entryDate;
      } else if (daysDiff > streak) {
        break;
      }
    }
    
    return streak;
  };

  const getMoodEmoji = (mood: number) => {
    if (mood <= 2) return '😢';
    if (mood <= 4) return '😔';
    if (mood <= 6) return '😐';
    if (mood <= 8) return '😊';
    return '😄';
  };

  const getMoodColor = (mood: number) => {
    if (mood <= 2) return 'bg-red-100 text-red-800';
    if (mood <= 4) return 'bg-orange-100 text-orange-800';
    if (mood <= 6) return 'bg-yellow-100 text-yellow-800';
    if (mood <= 8) return 'bg-green-100 text-green-800';
    return 'bg-blue-100 text-blue-800';
  };

  const journalStreak = calculateJournalStreak();
  const moodStreak = calculateMoodStreak();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-blue-500 text-white py-8">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center mb-4">
            <motion.button
              onClick={() => router.back()}
              className="flex items-center text-blue-100 hover:text-white transition-colors mr-4"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back
            </motion.button>
          </div>
          <motion.h1 
            className="text-4xl font-bold mb-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Your Mental Health Dashboard
          </motion.h1>
          <motion.p 
            className="text-blue-100 text-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Track your thoughts, feelings, and progress
          </motion.p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div 
            className="bg-white rounded-xl p-6 shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Journal Entries</p>
                <p className="text-2xl font-bold text-blue-600">{journalEntries.length}</p>
              </div>
              <BookOpen className="w-8 h-8 text-blue-600" />
            </div>
          </motion.div>

          <motion.div 
            className="bg-white rounded-xl p-6 shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Mood Entries</p>
                <p className="text-2xl font-bold text-green-600">{moodEntries.length}</p>
              </div>
              <Heart className="w-8 h-8 text-green-600" />
            </div>
          </motion.div>

          <motion.div 
            className="bg-white rounded-xl p-6 shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Journal Streak</p>
                <p className="text-2xl font-bold text-orange-600">{journalStreak}</p>
              </div>
              <Flame className="w-8 h-8 text-orange-600" />
            </div>
          </motion.div>

          <motion.div 
            className="bg-white rounded-xl p-6 shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Mood Streak</p>
                <p className="text-2xl font-bold text-purple-600">{moodStreak}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-600" />
            </div>
          </motion.div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-gray-200 rounded-lg p-1 mb-8">
          <motion.button
            className={`flex-1 py-3 px-6 rounded-md font-medium transition-colors ${
              activeTab === 'journal' 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-gray-600 hover:text-gray-800'
            }`}
            onClick={() => setActiveTab('journal')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <BookOpen className="w-5 h-5 inline mr-2" />
            Journal
          </motion.button>
          <motion.button
            className={`flex-1 py-3 px-6 rounded-md font-medium transition-colors ${
              activeTab === 'mood' 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-gray-600 hover:text-gray-800'
            }`}
            onClick={() => setActiveTab('mood')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Heart className="w-5 h-5 inline mr-2" />
            Mood Tracker
          </motion.button>
        </div>

        {/* Journal Tab */}
        {activeTab === 'journal' && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            {/* Add Journal Button */}
            {!isWriting && (
              <motion.button
                onClick={() => setIsWriting(true)}
                className="mb-6 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Plus className="w-5 h-5 mr-2" />
                New Journal Entry
              </motion.button>
            )}

            {/* Writing Interface */}
            {isWriting && (
              <motion.div 
                className="bg-white rounded-xl p-6 shadow-lg mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold">
                    {editingEntry ? 'Edit Journal Entry' : 'Write Your Journal Entry'}
                  </h3>
                  <button
                    onClick={() => {
                      setIsWriting(false);
                      setCurrentEntry({});
                      setEditingEntry(null);
                    }}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                
                <input
                  type="text"
                  placeholder="Entry title..."
                  value={currentEntry.title || ''}
                  onChange={(e) => setCurrentEntry({ ...currentEntry, title: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                
                <textarea
                  placeholder="What's on your mind today?"
                  value={currentEntry.content || ''}
                  onChange={(e) => setCurrentEntry({ ...currentEntry, content: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg h-40 resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                
                <div className="flex justify-end mt-4">
                  <motion.button
                    onClick={saveJournalEntry}
                    disabled={!currentEntry.title || !currentEntry.content}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {editingEntry ? 'Update Entry' : 'Save Entry'}
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* Journal Entries */}
            <div className="space-y-4">
              {journalEntries.map((entry, index) => (
                <motion.div
                  key={entry.id}
                  className="bg-white rounded-xl p-6 shadow-lg"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="text-lg font-bold text-gray-900">{entry.title}</h4>
                    <div className="flex items-center space-x-3">
                      <span className="text-sm text-gray-500">{entry.date}</span>
                      <div className="flex space-x-2">
                        <motion.button
                          onClick={() => editJournalEntry(entry)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Edit3 className="w-4 h-4" />
                        </motion.button>
                        <motion.button
                          onClick={() => deleteJournalEntry(entry.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-700 leading-relaxed">{entry.content}</p>
                </motion.div>
              ))}
              
              {journalEntries.length === 0 && (
                <motion.div 
                  className="text-center py-12 text-gray-500"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg">No journal entries yet</p>
                  <p className="text-sm">Start writing to track your thoughts and feelings</p>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}

        {/* Mood Tab */}
        {activeTab === 'mood' && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            {/* Add Mood Button */}
            {!isMoodTracking && (
              <motion.button
                onClick={() => setIsMoodTracking(true)}
                className="mb-6 bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Heart className="w-5 h-5 mr-2" />
                Track My Mood
              </motion.button>
            )}

            {/* Mood Tracking Interface */}
            {isMoodTracking && (
              <motion.div 
                className="bg-white rounded-xl p-6 shadow-lg mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold">
                    {editingMood ? 'Edit Mood Entry' : 'How are you feeling today?'}
                  </h3>
                  <button
                    onClick={() => {
                      setIsMoodTracking(false);
                      setCurrentMood({});
                      setEditingMood(null);
                    }}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                
                <div className="mb-6">
                  <p className="text-gray-700 mb-4">Rate your mood from 1 (very low) to 10 (excellent):</p>
                  <div className="grid grid-cols-5 gap-2">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((mood) => (
                      <motion.button
                        key={mood}
                        onClick={() => setCurrentMood({ ...currentMood, mood })}
                        className={`p-3 rounded-lg font-medium transition-colors ${
                          currentMood.mood === mood
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <div className="text-2xl mb-1">{getMoodEmoji(mood)}</div>
                        <div className="text-sm">{mood}</div>
                      </motion.button>
                    ))}
                  </div>
                </div>
                
                <textarea
                  placeholder="Any additional notes about how you're feeling? (optional)"
                  value={currentMood.note || ''}
                  onChange={(e) => setCurrentMood({ ...currentMood, note: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg h-24 resize-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                
                <div className="flex justify-end mt-4">
                  <motion.button
                    onClick={saveMoodEntry}
                    disabled={!currentMood.mood}
                    className="bg-green-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {editingMood ? 'Update Mood' : 'Save Mood'}
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* Mood Entries */}
            <div className="space-y-4">
              {moodEntries.map((entry, index) => (
                <motion.div
                  key={entry.id}
                  className="bg-white rounded-xl p-6 shadow-lg"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center space-x-3">
                      <span className="text-3xl">{getMoodEmoji(entry.mood)}</span>
                      <div>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getMoodColor(entry.mood)}`}>
                          Mood: {entry.mood}/10
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-sm text-gray-500">{entry.date}</span>
                      <div className="flex space-x-2">
                        <motion.button
                          onClick={() => editMoodEntry(entry)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Edit3 className="w-4 h-4" />
                        </motion.button>
                        <motion.button
                          onClick={() => deleteMoodEntry(entry.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </div>
                  </div>
                  {entry.note && (
                    <p className="text-gray-700 leading-relaxed">{entry.note}</p>
                  )}
                </motion.div>
              ))}
              
              {moodEntries.length === 0 && (
                <motion.div 
                  className="text-center py-12 text-gray-500"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <Heart className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg">No mood entries yet</p>
                  <p className="text-sm">Start tracking your mood to see patterns and progress</p>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
