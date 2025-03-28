'use client';
import { useParams } from 'next/navigation';
import { supabase } from '@/supabase/supabaseClient';
import { useEffect, useState } from 'react';

export default function StockItemDetail() {
  const params = useParams();
  const [item, setItem] = useState<{
    name: string;
    quantity: number;
    grn_number: string;
    cost: number;
    suppliers?: { name: string };
    created_at: string;
  } | null>(null);
  const [lpoNumber, setLpoNumber] = useState<string>('N/A');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        // First fetch the stock item with supplier info
        const { data: itemData, error: itemError } = await supabase
          .from('stock_items')
          .select('*, suppliers(name)')
          .eq('id', params.id)
          .single();

        if (itemError) throw itemError;
        setItem(itemData);

        // If the item has an lpo_id, fetch the LPO number
        if (itemData?.lpo_id) {
          const { data: lpoData, error: lpoError } = await supabase
            .from('purchase_lpo')
            .select('lpo_number')
            .eq('id', itemData.lpo_id)
            .single();

          if (!lpoError && lpoData) {
            setLpoNumber(lpoData.lpo_number || 'N/A');
          }
        }
      } catch (error) {
        console.error('Error fetching stock item:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [params.id]);

  if (loading) return <div className="flex-1 ml-16 p-6 flex items-center justify-center">
  <div className="animate-pulse flex space-x-2 items-center mt-50">
    <div className="h-2 w-2 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
    <div className="h-2 w-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
    <div className="h-2 w-2 bg-yellow-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
    <span className="ml-2 text-green-500 font-large">Loading...</span>
  </div>
</div>;
  if (!item) return <div>Item not found</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">{item.name}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-black">
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Stock Information</h2>
          <p>Quantity: {item.quantity}</p>
          <p>LPO Number: {lpoNumber}</p>
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