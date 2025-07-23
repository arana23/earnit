'use client';
import { useEffect, useState } from 'react';
import { supabase } from './lib/supabaseClient';
import { useSession } from '@supabase/auth-helpers-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSupabaseClient } from '@supabase/auth-helpers-react';

export default function Home() {
  const [goals, setGoals] = useState<{ id: number; title: string; category: string; completed: boolean; reward: { name: string; price: number } }[]>([]);
  const session = useSession();
  const router = useRouter();
  const supabase = useSupabaseClient();

  useEffect(() => {
    if (!session) {
      router.push('/signin');
    }
  }, [session, router]);

  useEffect(() => {
    const fetchGoals = async () => {
      const { data, error } = await supabase.from('goals').select('*');
      if (error) console.error(error);
      else setGoals(data);
    };
  
    fetchGoals();
  }, []);
  
  const markComplete = async (goalId: number) => {
    const { error } = await supabase
      .from('goals')
      .update({ completed: true, completed_at: new Date().toISOString() })
      .eq('id', goalId);
    if (!error) {
      setGoals(goals => goals.map(goal => goal.id === goalId ? { ...goal, completed: true } : goal));
    } else {
      alert('Failed to mark as complete: ' + error.message);
    }
  };

  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-6 row-start-2 w-full max-w-xl">
        <h1 className="text-2xl font-bold text-center">🎯 Your Goals</h1>
        <div className="flex justify-center mb-4">
          <Link href="/add-goal">
            <button className="bg-blue-600 text-white px-4 py-2 rounded font-semibold hover:bg-blue-700">+ Add Goal</button>
          </Link>
        </div>

        {goals.map((goal) => (
          <div
            key={goal.id}
            className={`rounded-xl p-4 border shadow ${
              goal.completed ? 'opacity-50 bg-gray-100' : 'bg-white'
            }`}
          >
            <div className="flex justify-between">
              <h2 className="text-lg font-semibold">{goal.title}</h2>
              <span className="text-sm text-gray-500">{goal.category}</span>
            </div>

            <p className="text-sm mt-1">
              Reward: <strong>{goal.reward.name}</strong> (${goal.reward.price})
            </p>

            {!goal.completed && (
              <button
                onClick={() => markComplete(goal.id)}
                className="mt-2 text-sm text-green-600 underline"
              >
                Mark as Complete
              </button>
            )}

            {goal.completed && (
              <p className="mt-2 text-sm text-green-700 font-medium">
                ✅ Completed!
              </p>
            )}
          </div>
        ))}
      </main>
    </div>
  );
}
