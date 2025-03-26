'use client';
import { useParams } from 'next/navigation';
import { supabase } from '@/supabase/supabaseClient';
import { useEffect, useState } from 'react';

export default function StockItemDetail() {
  const params = useParams();
  const [item, setItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const { data, error } = await supabase
          .from('stock_items')
          .select('*, suppliers(name)')
          .eq('id', params.id)
          .single();

        if (error) throw error;
        setItem(data);
      } catch (error) {
        console.error('Error fetching stock item:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [params.id]);

  if (loading) return <div>Loading...</div>;
  if (!item) return <div>Item not found</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">{item.name}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-black">
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Stock Information</h2>
          <p>Quantity: {item.quantity}</p>
          <p>LPO Number: {item.lpo_number}</p>
          <p>GRN Number: {item.grn_number}</p>
          <p>Cost: UGX {item.cost}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Supplier Information</h2>
          <p>Supplier: {item.suppliers?.name || 'N/A'}</p>
          <p>Date Added: {new Date(item.created_at).toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );
}