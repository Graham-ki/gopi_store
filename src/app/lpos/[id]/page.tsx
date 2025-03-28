'use client';
import { useParams } from 'next/navigation';
import { supabase } from '@/supabase/supabaseClient';
import { useEffect, useState } from 'react';

export default function LPODetail() {
  const params = useParams();
  interface LPO {
    lpo_number: string;
    status: string;
    amount: number;
    created_at: string;
    suppliers?: { name: string };
  }

  const [lpo, setLpo] = useState<LPO | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLPO = async () => {
      try {
        const { data, error } = await supabase
          .from('purchase_lpo')
          .select('*, suppliers(name)')
          .eq('id', params.id)
          .single();

        if (error) throw error;
        setLpo(data);
      } catch (error) {
        console.error('Error fetching LPO:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLPO();
  }, [params.id]);

  if (loading) return <div className="flex-1 ml-16 p-6 flex items-center justify-center">
  <div className="animate-pulse flex space-x-2 items-center mt-50">
    <div className="h-2 w-2 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
    <div className="h-2 w-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
    <div className="h-2 w-2 bg-yellow-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
    <span className="ml-2 text-green-500 font-large">Loading...</span>
  </div>
</div>;
  if (!lpo) return <div>LPO not found</div>;

  return (
    <div className="p-6 text-black">
      <h1 className="text-2xl font-bold mb-4 text-white">LPO #{lpo.lpo_number}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">LPO Details</h2>
          <p>Status: {lpo.status}</p>
          <p>Amount: UGX {lpo.amount}</p>
          <p>Created: {new Date(lpo.created_at).toLocaleDateString()}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Supplier Information</h2>
          <p>Supplier: {lpo.suppliers?.name || 'N/A'}</p>
        </div>
      </div>
    </div>
  );
}