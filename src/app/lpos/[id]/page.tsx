'use client';
import { useParams } from 'next/navigation';
import { supabase } from '@/supabase/supabaseClient';
import { useEffect, useState } from 'react';

export default function LPODetail() {
  const params = useParams();
  const [lpo, setLpo] = useState<any>(null);
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

  if (loading) return <div>Loading...</div>;
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