import { getDBInfo, getTables, initDB } from '@/db/client';
import { getStoragePermission } from '@/utils/helpers';

const useDB = () => {
  const initializeDB = async () => {
    await getStoragePermission();
    await initDB();
    const info = await getDBInfo();
    console.log('DB Info:', info);

    const result = await getTables();
    console.log('DB Tables:', result);
  };

  return { initializeDB };
};

export default useDB;
