'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';

const categories = ['Fitness', 'Career', 'Learning', 'Wellness', 'Finance'];

export default function AddGoalPage() {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(categories[0]);
  const [targetDate, setTargetDate] = useState('');
  const [rewardName, setRewardName] = useState('');
  const [rewardPrice, setRewardPrice] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const session = useSession();
  const supabase = useSupabaseClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    if (!session) {
      setError('You must be signed in to add a goal.');
      setLoading(false);
      return;
    }
    const { data, error } = await supabase.from('goals').insert([
      {
        user_id: session.user.id,
        title,
        category,
        target_date: targetDate || null,
        reward_name: rewardName,
        reward_price: rewardPrice ? parseFloat(rewardPrice) : null,
        completed: false,
      },
    ]);
    if (error) {
      setError(error.message);
    } else {
      router.push('/');
    }
    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4 text-center">Add a New Goal</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Goal Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
          className="border rounded p-2"
        />
        <select
          value={category}
          onChange={e => setCategory(e.target.value)}
          className="border rounded p-2"
        >
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        <input
          type="date"
          value={targetDate}
          onChange={e => setTargetDate(e.target.value)}
          className="border rounded p-2"
        />
        <input
          type="text"
          placeholder="Reward Name"
          value={rewardName}
          onChange={e => setRewardName(e.target.value)}
          required
          className="border rounded p-2"
        />
        <input
          type="number"
          placeholder="Reward Price"
          value={rewardPrice}
          onChange={e => setRewardPrice(e.target.value)}
          min="0"
          step="0.01"
          required
          className="border rounded p-2"
        />
        {error && <div className="text-red-600 text-sm">{error}</div>}
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white rounded p-2 font-semibold hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Adding...' : 'Add Goal'}
        </button>
      </form>
    </div>
  );
} 