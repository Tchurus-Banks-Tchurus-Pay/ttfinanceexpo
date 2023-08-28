import { useEffect, useState } from 'react';
import { Text } from '../components/Themed';
import { supabase } from '../constants/Supabase';


const TableEditor = () => {

    const [name, setName] = useState('');

   
  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from('accounts')
        .select('*');
      if (data) {
        console.log('Dados do Supabase:', data);
        console.log(data[0]['account_number']);
        setName(data[0]['account_number']);
      }
      if (error) {
        console.error('Erro do Supabase:', error);
      }
    };

    fetchData();
  }, []);

 return  <Text>Veio do Supabase: {name}</Text>

};

export default TableEditor;