'use client';

import { useEffect, useState } from 'react';
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import { useRouter } from 'next/navigation';

export default function CompletedGoalsPage() {
  const [completedGoals, setCompletedGoals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const session = useSession();
  const supabase = useSupabaseClient();
  const router = useRouter();

  useEffect(() => {
    if (!session) {
      router.push('/signin');
      return;
    }
    const fetchCompletedGoals = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('goals')
        .select('*')
        .eq('user_id', session.user.id)
        .eq('completed', true);
      if (!error && data) {
        setCompletedGoals(data);
      }
      setLoading(false);
    };
    fetchCompletedGoals();
  }, [session, supabase, router]);

  const totalUnlocked = completedGoals.reduce((sum, goal) => sum + (goal.reward_price || 0), 0);

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4 text-center">Completed Goals & Rewards</h1>
      {loading ? (
        <div>Loading...</div>
      ) : completedGoals.length === 0 ? (
        <div className="text-center text-gray-500">No completed goals yet.</div>
      ) : (
        <>
          <ul className="mb-4">
            {completedGoals.map(goal => (
              <li key={goal.id} className="flex justify-between items-center border-b py-2">
                <span>
                  <span className="font-semibold">{goal.title}</span> <span className="text-xs text-gray-500">({goal.category})</span>
                </span>
                <span className="text-green-700">${goal.reward_price}</span>
              </li>
            ))}
          </ul>
          <div className="text-lg font-semibold text-center">
            Total Rewards Unlocked: <span className="text-green-700">${totalUnlocked.toFixed(2)}</span>
          </div>
        </>
      )}
    </div>
  );
} 