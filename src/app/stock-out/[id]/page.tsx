'use client';
import { useParams } from 'next/navigation';
import { supabase } from '@/supabase/supabaseClient';
import { useEffect, useState } from 'react';

export default function StockOutDetail() {
  const params = useParams();
  interface StockOutRecord {
    name: string;
    quantity: number;
    takenby: string;
    issuedby: string;
    created_at: string;
  }

  const [record, setRecord] = useState<StockOutRecord | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecord = async () => {
      try {
        const { data, error } = await supabase
          .from('stock_out')
          .select('*')
          .eq('id', params.id)
          .single();

        if (error) throw error;
        setRecord(data);
      } catch (error) {
        console.error('Error fetching stock out record:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecord();
  }, [params.id]);

  if (loading) return <div className="flex-1 ml-16 p-6 flex items-center justify-center">
  <div className="animate-pulse flex space-x-2 items-center mt-50">
    <div className="h-2 w-2 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
    <div className="h-2 w-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
    <div className="h-2 w-2 bg-yellow-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
    <span className="ml-2 text-green-500 font-large">Loading...</span>
  </div>
</div>;
  if (!record) return <div>Record not found</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Stock Out Record</h1>
      <div className="bg-white p-6 rounded-lg shadow text-black">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-lg font-semibold mb-2">Item Information</h2>
            <p>Product: {record.name}</p>
            <p>Quantity: {record.quantity}</p>
          </div>
          <div>
            <h2 className="text-lg font-semibold mb-2">Transaction Details</h2>
            <p>Taken by: {record.takenby}</p>
            <p>Issued by: {record.issuedby}</p>
            <p>Date: {new Date(record.created_at).toLocaleDateString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
}