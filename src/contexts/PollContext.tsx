// contexts/PollContext.tsx
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where, 
  getDocs, 
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from './AuthContext';
import { rewritePollQuestion } from '@/lib/gemini';

export interface PollOption {
  id: string;
  text: string;
  votes: number;
}

export interface Poll {
  id: string;
  question: string;
  options: PollOption[];
  createdAt: Date;
  isActive: boolean;
}

interface PollContextProps {
  polls: Poll[];
  addPoll: (question: string, options: string[]) => Promise<void>;
  updatePoll: (id: string, updatedPoll: Partial<Poll>) => Promise<void>;
  deletePoll: (id: string) => Promise<void>;
  vote: (pollId: string, optionId: string) => Promise<void>;
  rewriteQuestion: (question: string) => Promise<string>;
}

const PollContext = createContext<PollContextProps | undefined>(undefined);

export function PollProvider({ children }: { children: ReactNode }) {
  const [polls, setPolls] = useState<Poll[]>([]);
  const { user } = useAuth();

  // Load polls from Firestore when user logs in
  useEffect(() => {
    const loadPolls = async () => {
      if (!user) {
        // If not logged in, try to load from localStorage
        const storedPolls = localStorage.getItem('dhyan_polls');
        if (storedPolls) {
          setPolls(JSON.parse(storedPolls));
        }
        return;
      }

      try {
        const q = query(
          collection(db, 'polls'), 
          where('userId', '==', user.uid)
        );
        
        const querySnapshot = await getDocs(q);
        const loadedPolls: Poll[] = [];
        
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          loadedPolls.push({
            id: doc.id,
            question: data.question,
            options: data.options,
            createdAt: data.createdAt?.toDate() || new Date(),
            isActive: data.isActive
          });
        });
        
        setPolls(loadedPolls);
      } catch (error) {
        console.error('Error loading polls', error);
      }
    };

    loadPolls();
  }, [user]);

  // Save to localStorage when polls change
  useEffect(() => {
    if (polls.length > 0) {
      localStorage.setItem('dhyan_polls', JSON.stringify(polls));
    }
  }, [polls]);

  const rewriteQuestion = async (question: string): Promise<string> => {
    return await rewritePollQuestion(question);
  };

  const addPoll = async (question: string, optionTexts: string[]) => {
    try {
      const options: PollOption[] = optionTexts.map((text) => ({
        id: Date.now() + Math.random().toString(36).substring(2, 9),
        text,
        votes: 0
      }));
      
      const newPoll: Omit<Poll, 'id'> = {
        question,
        options,
        createdAt: new Date(),
        isActive: true
      };
      
      if (user) {
        // Add to Firestore if logged in
        const docRef = await addDoc(collection(db, 'polls'), {
          ...newPoll,
          userId: user.uid,
          createdAt: serverTimestamp()
        });
        
        setPolls([...polls, { ...newPoll, id: docRef.id }]);
      } else {
        // Add to local state only
        const pollWithId: Poll = {
          ...newPoll,
          id: Date.now().toString()
        };
        
        setPolls([...polls, pollWithId]);
      }
    } catch (error) {
      console.error('Error adding poll', error);
    }
  };

  const updatePoll = async (id: string, updatedPoll: Partial<Poll>) => {
    try {
      if (user) {
        // Update in Firestore if logged in
        const pollRef = doc(db, 'polls', id);
        await updateDoc(pollRef, updatedPoll);
      }
      
      // Update in local state
      setPolls(polls.map(poll => 
        poll.id === id ? { ...poll, ...updatedPoll } : poll
      ));
    } catch (error) {
      console.error('Error updating poll', error);
    }
  };

  const deletePoll = async (id: string) => {
    try {
      if (user) {
        // Delete from Firestore if logged in
        const pollRef = doc(db, 'polls', id);
        await deleteDoc(pollRef);
      }
      
      // Delete from local state
      setPolls(polls.filter(poll => poll.id !== id));
    } catch (error) {
      console.error('Error deleting poll', error);
    }
  };

  const vote = async (pollId: string, optionId: string) => {
    try {
      const pollIndex = polls.findIndex(p => p.id === pollId);
      if (pollIndex === -1) return;
      
      const poll = polls[pollIndex];
      const updatedOptions = poll.options.map(option => 
        option.id === optionId 
          ? { ...option, votes: option.votes + 1 } 
          : option
      );
      
      const updatedPoll = { ...poll, options: updatedOptions };
      
      if (user) {
        // Update in Firestore if logged in
        const pollRef = doc(db, 'polls', pollId);
        await updateDoc(pollRef, { options: updatedOptions });
      }
      
      // Update in local state
      const updatedPolls = [...polls];
      updatedPolls[pollIndex] = updatedPoll;
      setPolls(updatedPolls);
    } catch (error) {
      console.error('Error voting in poll', error);
    }
  };

  return (
    <PollContext.Provider 
      value={{ 
        polls, 
        addPoll, 
        updatePoll, 
        deletePoll, 
        vote,
        rewriteQuestion
      }}
    >
      {children}
    </PollContext.Provider>
  );
}

export function usePolls() {
  const context = useContext(PollContext);
  if (context === undefined) {
    throw new Error('usePolls must be used within a PollProvider');
  }
  return context;
}