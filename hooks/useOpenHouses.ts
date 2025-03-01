import { useState, useCallback, useEffect } from 'react';
import { supabaseApi, OpenHouse } from '../lib/supabase';

export function useOpenHouses() {
  const [openHouses, setOpenHouses] = useState<OpenHouse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOpenHouses = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabaseApi.openHouses.getAll();
      
      if (error) {
        setError(error.message);
        return;
      }
      
      setOpenHouses(data || []);
    } catch (err) {
      setError('Failed to fetch open houses');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const getOpenHouseById = useCallback(async (id: string) => {
    try {
      const { data, error } = await supabaseApi.openHouses.getById(id);
      
      if (error) {
        throw new Error(error.message);
      }
      
      return data;
    } catch (err) {
      console.error('Error fetching open house:', err);
      throw err;
    }
  }, []);

  const createOpenHouse = useCallback(async (openHouse: Omit<OpenHouse, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabaseApi.openHouses.create(openHouse);
      
      if (error) {
        throw new Error(error.message);
      }
      
      setOpenHouses(prev => [...prev, data]);
      return data;
    } catch (err) {
      console.error('Error creating open house:', err);
      throw err;
    }
  }, []);

  const updateOpenHouse = useCallback(async (id: string, updates: Partial<OpenHouse>) => {
    try {
      const { data, error } = await supabaseApi.openHouses.update(id, updates);
      
      if (error) {
        throw new Error(error.message);
      }
      
      setOpenHouses(prev => 
        prev.map(oh => oh.id === id ? data : oh)
      );
      
      return data;
    } catch (err) {
      console.error('Error updating open house:', err);
      throw err;
    }
  }, []);

  const deleteOpenHouse = useCallback(async (id: string) => {
    try {
      const { error } = await supabaseApi.openHouses.delete(id);
      
      if (error) {
        throw new Error(error.message);
      }
      
      setOpenHouses(prev => 
        prev.filter(oh => oh.id !== id)
      );
      
      return true;
    } catch (err) {
      console.error('Error deleting open house:', err);
      throw err;
    }
  }, []);

  const getOpenHousesByStatus = useCallback(async (status: OpenHouse['status']) => {
    try {
      const { data, error } = await supabaseApi.openHouses.getByStatus(status);
      
      if (error) {
        throw new Error(error.message);
      }
      
      return data || [];
    } catch (err) {
      console.error(`Error fetching ${status} open houses:`, err);
      throw err;
    }
  }, []);

  useEffect(() => {
    fetchOpenHouses();
  }, [fetchOpenHouses]);

  return {
    openHouses,
    loading,
    error,
    fetchOpenHouses,
    getOpenHouseById,
    createOpenHouse,
    updateOpenHouse,
    deleteOpenHouse,
    getOpenHousesByStatus,
  };
}