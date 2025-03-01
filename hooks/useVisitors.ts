import { useState, useCallback } from 'react';
import { supabaseApi, Visitor } from '../lib/supabase';

export function useVisitors() {
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchVisitors = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabaseApi.visitors.getAll();
      
      if (error) {
        setError(error.message);
        return;
      }
      
      setVisitors(data || []);
    } catch (err) {
      setError('Failed to fetch visitors');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchVisitorsByOpenHouse = useCallback(async (openHouseId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabaseApi.visitors.getByOpenHouse(openHouseId);
      
      if (error) {
        setError(error.message);
        return [];
      }
      
      setVisitors(data || []);
      return data || [];
    } catch (err) {
      setError('Failed to fetch visitors for this open house');
      console.error(err);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const getVisitorById = useCallback(async (id: string) => {
    try {
      const { data, error } = await supabaseApi.visitors.getById(id);
      
      if (error) {
        throw new Error(error.message);
      }
      
      return data;
    } catch (err) {
      console.error('Error fetching visitor:', err);
      throw err;
    }
  }, []);

  const createVisitor = useCallback(async (visitor: Omit<Visitor, 'id' | 'created_at'>) => {
    try {
      const { data, error } = await supabaseApi.visitors.create(visitor);
      
      if (error) {
        throw new Error(error.message);
      }
      
      setVisitors(prev => [data, ...prev]);
      return data;
    } catch (err) {
      console.error('Error creating visitor:', err);
      throw err;
    }
  }, []);

  const updateVisitor = useCallback(async (id: string, updates: Partial<Visitor>) => {
    try {
      const { data, error } = await supabaseApi.visitors.update(id, updates);
      
      if (error) {
        throw new Error(error.message);
      }
      
      setVisitors(prev => 
        prev.map(v => v.id === id ? data : v)
      );
      
      return data;
    } catch (err) {
      console.error('Error updating visitor:', err);
      throw err;
    }
  }, []);

  const deleteVisitor = useCallback(async (id: string) => {
    try {
      const { error } = await supabaseApi.visitors.delete(id);
      
      if (error) {
        throw new Error(error.message);
      }
      
      setVisitors(prev => 
        prev.filter(v => v.id !== id)
      );
      
      return true;
    } catch (err) {
      console.error('Error deleting visitor:', err);
      throw err;
    }
  }, []);

  const getVisitorsByStatus = useCallback(async (status: Visitor['status']) => {
    try {
      const { data, error } = await supabaseApi.visitors.getByStatus(status);
      
      if (error) {
        throw new Error(error.message);
      }
      
      return data || [];
    } catch (err) {
      console.error(`Error fetching ${status} visitors:`, err);
      throw err;
    }
  }, []);

  return {
    visitors,
    loading,
    error,
    fetchVisitors,
    fetchVisitorsByOpenHouse,
    getVisitorById,
    createVisitor,
    updateVisitor,
    deleteVisitor,
    getVisitorsByStatus,
  };
}