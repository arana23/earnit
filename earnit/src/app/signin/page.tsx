'use client';

import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { useSupabaseClient } from '@supabase/auth-helpers-react';

export default function SignIn() {
  const supabase = useSupabaseClient();

  return (
    <div style={{ maxWidth: 400, margin: 'auto', padding: 32 }}>
      <Auth supabaseClient={supabase} appearance={{ theme: ThemeSupa }} />
    </div>
  );
} 